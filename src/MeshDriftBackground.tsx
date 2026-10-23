import { useEffect, useRef } from 'react'

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

vec3 shade(vec2 p, float time) {
  vec3 color = u_colors[0] * 0.15;
  float total = 0.15;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= u_colorCount) break;
    float index = float(i);
    vec2 center = vec2(
      sin(time * (0.21 + index * 0.071) + index * 2.4 + u_seed),
      cos(time * (0.17 + index * 0.093) + index * 1.7)) * (0.45 + u_intensity * 0.35);
    float weight = exp(-dot(p - center, p - center) * 6.0);
    color += u_colors[i] * weight;
    total += weight;
  }
  return color / total;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 point = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 cursor = (0.5 * u_mouse * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 delta = point - cursor;
  float distanceToCursor = length(delta);
  float cursorMask = u_cursorPresence * (1.0 - smoothstep(0.0, u_cursorRadius, distanceToCursor));

  if (u_cursorPresence > 0.001) {
    float angle = cursorMask * u_cursorStrength * 2.2;
    float cosine = cos(angle);
    float sine = sin(angle);
    point = cursor + mat2(cosine, -sine, sine, cosine) * delta;
  }

  point *= u_scale;
  point += u_offset;
  point += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  point += u_warp * (vec2(fbm(point * u_detail + u_seed), fbm(point * u_detail + vec2(5.2, 1.3))) - 0.5);

  vec3 color = shade(point, u_time);
  color = (color - 0.5) * u_contrast + 0.5;
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luminance), color, u_saturation);
  color += u_brightness;

  float vignetteDistance = length(uv - 0.5) * 1.41421356;
  color *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vignetteDistance);
  color += (grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function MeshDriftBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false })
    if (!canvas || !gl) return

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const colors = gl.getUniformLocation(program, 'u_colors')
    const scene = gl.getUniformLocation(program, 'u_scene')
    const shape = gl.getUniformLocation(program, 'u_shape')
    const surface = gl.getUniformLocation(program, 'u_surface')
    const finish = gl.getUniformLocation(program, 'u_finish')
    const transform = gl.getUniformLocation(program, 'u_transform')
    const space = gl.getUniformLocation(program, 'u_space')
    const cursor = gl.getUniformLocation(program, 'u_cursor')
    const darkPalette = [0.063, 0.063, 0.063, 0.961, 0.961, 0.961, 0.690, 0.690, 0.690, 0.227, 0.227, 0.227]
    const lightPalette = [0.88, 0.91, 0.96, 0.98, 0.985, 0.995, 0.80, 0.85, 0.92, 0.91, 0.94, 0.98]
    let isLightMode: boolean | null = null
    let pointerX = 0
    let pointerY = 0
    let animationFrame = 0
    let startTime = performance.now()
    let pausedAt = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * ratio))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * ratio))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const movePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    }
    const render = (now: number) => {
      const seconds = (now - startTime) / 1000
      const nextLightMode = canvas.closest('.theme-root')?.classList.contains('theme-light') ?? false
      if (nextLightMode !== isLightMode) {
        isLightMode = nextLightMode
      }
      gl.uniform3fv(colors, isLightMode ? lightPalette : darkPalette)
      gl.uniform4f(scene, canvas.width, canvas.height, seconds * -1.37, 4)
      gl.uniform4f(shape, 1.30, 0.56, 0.67, 0.19)
      gl.uniform4f(surface, 2.02, isLightMode ? 1.0 : 1.17, 0.00, 1.00)
      gl.uniform4f(finish, 0.00, isLightMode ? 0.08 : 0.15, 0.007, isLightMode ? 0.025 : 0.10)
      gl.uniform4f(transform, 5069.0, 2.72, 0.15, 0.0)
      gl.uniform4f(space, 0.09, 0.15, pointerX, pointerY)
      gl.uniform4f(cursor, 1.0, 2.0, isLightMode ? 0.95 : 0.73, isLightMode ? 0.44 : 0.36)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      animationFrame = requestAnimationFrame(render)
    }
    const handleVisibility = () => {
      if (document.hidden) {
        pausedAt = performance.now()
        cancelAnimationFrame(animationFrame)
      } else {
        startTime += performance.now() - pausedAt
        animationFrame = requestAnimationFrame(render)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', movePointer)
    document.addEventListener('visibilitychange', handleVisibility)
    animationFrame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', movePointer)
      document.removeEventListener('visibilitychange', handleVisibility)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return <canvas ref={canvasRef} className="mesh-drift-background" aria-hidden="true" />
}

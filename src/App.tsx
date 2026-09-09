import { useState } from 'react'
import devPhoto from '@/imports/istockphoto-840640768-170667a.jpg'
import MeshDriftBackground from './MeshDriftBackground'
import { MagneticCursor } from './components/ui/magnetic-cursor'
import { TextDisperse } from './components/ui/text-disperse'
import { TextScramble } from './components/ui/text-scramble'

const PROJECTS = [
  { id: 0, title: 'portfolio v3', category: 'Design & Development', accent: '#4a4b6a' },
  { id: 1, title: 'e-commerce store', category: 'Web Development', accent: '#3a5a4a' },
  { id: 2, title: 'design system', category: 'UX/UI Design', accent: '#5a3a6a' },
  { id: 3, title: 'task manager app', category: 'Mobile App', accent: '#6a3a3a' },
  { id: 4, title: 'analytics dashboard', category: 'Data Visualization', accent: '#3d5a6a' },
  { id: 5, title: 'blog platform', category: 'Full Stack', accent: '#4a5a3a' },
]

const SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Next.js',
  'PostgreSQL', 'Figma', 'GraphQL', 'Tailwind CSS',
  'Docker', 'AWS',
]

const NAV_ITEMS = [
  { label: 'MENU', id: 'home' },
  { label: 'TRABALHOS', id: 'work' },
  { label: 'SOBRE', id: 'about' },
  { label: 'CONTATO', id: 'contact' },
]

type Section = 'home' | 'work' | 'about' | 'contact'

// ─── Blob ────────────────────────────────────────────────────────────────────

interface BlobProps {
  style: React.CSSProperties
  animClass?: string
}

function Blob({ style, animClass = '' }: BlobProps) {
  return (
    <div
      className={`absolute pointer-events-none ${animClass}`}
      style={{
        background: 'radial-gradient(ellipse at 35% 25%, #363748 0%, #1c1d28 100%)',
        boxShadow: 'inset 0 4px 16px rgba(255,255,255,0.07), 0 20px 60px rgba(0,0,0,0.6)',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10%', left: '18%',
          width: '42%', height: '28%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.09) 0%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(3px)',
        }}
      />
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg width="42" height="32" viewBox="0 0 42 32" fill="none" aria-label="logo" style={{ pointerEvents: 'none' }}>
      <path d="M13 4L1 16L13 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 4L41 16L29 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="25" y1="2" x2="17" y2="30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {[4, 11, 18].flatMap(y =>
        [4, 11, 18].map(x => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" fill="rgba(255,255,255,0.75)" />
        ))
      )}
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="4" y1="4" x2="18" y2="18" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="4" x2="4" y2="18" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection({ navigate }: { navigate: (s: Section) => void }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <MeshDriftBackground />

      <div className="relative z-10 text-center px-8 max-w-4xl">
        <h1
          className="font-black uppercase tracking-tight mb-8"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2rem,5.5vw,4.4rem)',
            lineHeight: 0.92,
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 400,
              display: 'inline-block',
              marginRight: '0.16em',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 1)',
            }}
          >
            Ei, sou 
          </span>
          <TextScramble className="text-white" text="JOÃO VITOR DA M. S." />
          <br />
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 400,
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 1)',
            }}
          >
            {' MAIS PODE ME CHAMAR '}
          </span>
          <TextDisperse className="text-white">MÁIA</TextDisperse>
        </h1>

        <p
          className="font-light leading-relaxed mb-10"
          style={{ color: 'rgba(255,255,255,0.36)', fontSize: '0.875rem' }}
        >
          Sou desenvolvedor front-end e designer de UX/UI.
          <br />
          &amp; creative technologist
        </p>

        <div className="flex items-center justify-center gap-10">
          <button
            data-magnetic
            onClick={() => navigate('work')}
            className="text-sm font-light transition-colors duration-200 hover:text-white"
            style={{ color: 'rgba(255,255,255,0.52)' }}
          >
            → Veja meus projetos
          </button>
          <button
            data-magnetic
            onClick={() => navigate('about')}
            className="text-sm font-light transition-colors duration-200 hover:text-white"
            style={{ color: 'rgba(255,255,255,0.52)' }}
          >
            → mais sobre mim
          </button>
        </div>
      </div>
    </div>
  )
}

function WorkSection() {
  const [hovered, setHovered] = useState(0)
  const active = PROJECTS[hovered]

  return (
    <div className="relative flex w-full h-full overflow-hidden">
      <MeshDriftBackground />

      {/* Left sticky preview */}
      <div
        className="relative z-10 hidden md:flex w-[48%] h-full flex-col items-start justify-end p-14 transition-all duration-700 flex-shrink-0"
        style={{
          background: `radial-gradient(ellipse at 42% 42%, ${active.accent}99 0%, transparent 78%)`,
        }}
      >
        <p
          className="text-xs font-light uppercase tracking-[0.25em] mb-2"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          PROJECT
        </p>
        <p
          className="font-black uppercase leading-none"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.2rem,4.5vw,3.8rem)',
            color: 'rgba(255,255,255,0.12)',
            letterSpacing: '-0.01em',
          }}
        >
          {active.title}
        </p>
      </div>

      {/* Right list */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-10 md:px-14 py-28 overflow-y-auto">
        <div
          className="flex items-baseline justify-between pb-5 mb-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h2
            className="font-black uppercase tracking-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)' }}
          >
            TRABALHOS
          </h2>
          <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {PROJECTS.length}
          </span>
        </div>

        {PROJECTS.map((project, i) => (
          <button
            key={project.id}
            onMouseEnter={() => setHovered(i)}
            className="w-full flex items-center justify-between py-5 text-left"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span
              className="font-bold tracking-wide transition-colors duration-150"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.15rem',
                color: hovered === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.65)',
                letterSpacing: '0.03em',
              }}
            >
              {hovered === i && <span className="mr-2">→</span>}
              {project.title}
            </span>
            <span
              className="text-xs font-light uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              {project.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function AboutSection() {
  const [isPhotoHovered, setIsPhotoHovered] = useState(false)

  return (
    <div className="relative flex w-full h-full items-center px-8 md:px-20 lg:px-28 overflow-y-auto">
      <MeshDriftBackground />

      <div className="relative z-10 w-full max-w-5xl py-20">
        <h2
          className="font-black uppercase tracking-tight mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)' }}
        >
          SOBRE MIM
        </h2>
        <div className="h-px mb-12" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <div className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-16 items-start">
          {/* Photo with background removed via radial vignette */}
          <div
            className="relative flex-shrink-0 mx-auto md:mx-0"
            style={{
              width: 220,
              height: 290,
              transform: isPhotoHovered ? 'translateX(-6px) scale(1.04)' : 'translateX(0) scale(1)',
              transformOrigin: 'center center',
              transition: 'transform 220ms ease-out',
            }}
            onMouseEnter={() => setIsPhotoHovered(true)}
            onMouseLeave={() => setIsPhotoHovered(false)}
          >
            <img
              src={devPhoto}
              alt="Developer photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
              }}
            />
            {/* Soft fade keeps the portrait integrated with the animated background. */}
            <div
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '24%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Bio + skills */}
          <div className="space-y-8">
            <div>
              <p
                className="leading-[1.9] mb-5 font-light"
                style={{ color: 'rgba(255,255,255,0.52)', fontSize: '0.95rem' }}
              >
                Sou um desenvolvedor front-end apaixonado, baseado no Brasil. 
                Especializo-me na criação de experiências web belas e de alto desempenho utilizando tecnologias 
                modernas. Valorizo ​​profundamente sistemas 
                de design, acessibilidade e a arte de escrever código limpo.
              </p>
              <p
                className="leading-[1.9] font-light"
                style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.875rem' }}
              >
                Quando não estou programando, você me encontrará explorando projetos de código aberto,
                projetando conceitos de UI ou experimentando com programação criativa e arte gerativa.
              </p>
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-[0.22em] font-light mb-4"
                style={{ color: 'rgba(255,255,255,0.22)' }}
              >
                TECNOLOGIAS
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <span
                    key={skill}
                    className="text-xs font-light px-3 py-1.5 cursor-default transition-all duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'
                      ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
                      ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactSection() {
  return (
    <div className="relative flex w-full h-full items-center px-8 md:px-20 lg:px-28">
      <MeshDriftBackground />

      <div className="relative z-10 w-full max-w-5xl">
        <h2
          className="font-black uppercase tracking-tight mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)' }}
        >
          CONTATO
        </h2>
        <div className="h-px mb-12" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <div className="grid md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <p
              className="text-xs uppercase tracking-[0.22em] font-light mb-4"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              E-MAIL
            </p>
            <a
              href="mailto:hello@yourname.dev"
              className="font-light transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.9rem' }}
            >
              ↗ hello@yourname.dev
            </a>
          </div>

          <div>
            <p
              className="text-xs uppercase tracking-[0.22em] font-light mb-4"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              REDES SOCIAIS
            </p>
            <div className="space-y-3">
              {[
                { label: 'github', href: 'https://github.com' },
                { label: 'linkedin', href: 'https://linkedin.com' },
                { label: 'twitter', href: 'https://twitter.com' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-light transition-colors duration-200 hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.9rem' }}
                >
                  ↗ {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [current, setCurrent] = useState<Section>('home')
  const [visible, setVisible] = useState(true)
  const [navOpen, setNavOpen] = useState(false)

  const navigateTo = (section: Section) => {
    setNavOpen(false)
    if (section === current) return
    setVisible(false)
    setTimeout(() => {
      setCurrent(section)
      setVisible(true)
    }, 260)
  }

  return (
    <MagneticCursor magneticFactor={0.55} blendMode="exclusion" cursorSize={24}>
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ background: '#252631', fontFamily: "'Outfit', sans-serif", color: 'white' }}
      >
      <MeshDriftBackground />

      {/* ─── FIXED HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        {!navOpen && (
          <button
            data-magnetic
            onClick={() => navigateTo('home')}
            className="flex h-12 w-14 items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
          >
            <Logo />
          </button>
        )}
        {!navOpen && (
          <button
            data-magnetic
            onClick={() => setNavOpen(true)}
            className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-1"
            aria-label="Open menu"
          >
            <GridIcon />
          </button>
        )}
      </header>

      {/* ─── NAV OVERLAY ─── */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: 'transparent',
          opacity: navOpen ? 1 : 0,
          pointerEvents: navOpen ? 'auto' : 'none',
          transition: 'opacity 0.45s ease',
        }}
      >
        <MeshDriftBackground />

        {navOpen && (
          <button
            data-magnetic
            onClick={() => setNavOpen(false)}
            className="absolute top-6 right-8 z-10 opacity-60 hover:opacity-100 transition-opacity duration-200 p-1"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        )}
        {/* Left blob cluster */}
        <div className="hidden absolute left-0 top-0 h-full w-64 overflow-hidden">
          <Blob animClass="float-1" style={{ width: 150, height: 320, top: 70, left: -55, borderRadius: '38% 62% 32% 68% / 45% 38% 62% 55%', transform: 'rotate(10deg)' }} />
          <Blob animClass="float-2" style={{ width: 90, height: 90, top: 430, left: 55, borderRadius: '50%' }} />
          <Blob animClass="float-3" style={{ width: 190, height: 290, bottom: 40, left: -25, borderRadius: '55% 45% 38% 62% / 52% 48% 52% 48%', transform: 'rotate(-15deg)' }} />
          <Blob animClass="float-1" style={{ width: 70, height: 180, top: 200, left: 100, borderRadius: '40% 60% 55% 45% / 50% 50% 50% 50%', transform: 'rotate(30deg)' }} />
        </div>

        <div className="absolute top-7 left-8 z-10 flex items-center gap-4">
          <button
            data-magnetic
            onClick={() => navigateTo('home')}
            className="flex h-12 w-14 items-center justify-center"
            style={{ opacity: 0.6 }}
            aria-label="Go to home"
          >
            <Logo />
          </button>
          <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>
            João vitor / Desenvolvedor  
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center pl-[22vw] md:pl-[26vw] pr-12">
          <nav>
            {NAV_ITEMS.map(({ label, id }, i) => (
              <button
                key={id}
                onClick={() => navigateTo(id as Section)}
                className="flex items-baseline gap-5 group w-full text-left"
              >
                <span
                  className="text-xs font-light tabular-nums"
                  style={{ color: 'rgba(255,255,255,0.25)', width: '2rem' }}
                >
                  0{i + 1}
                </span>
                <span
                  data-magnetic
                  data-magnetic-static
                  className="inline-block font-black uppercase text-white group-hover:text-white/25 transition-colors duration-200"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 'clamp(3rem,9vw,7rem)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex gap-7 mt-10" style={{ paddingLeft: '3.5rem' }}>
            {[
              { label: 'github', href: 'https://github.com' },
              { label: 'linkedin', href: 'https://linkedin.com' },
            ].map(({ label, href }) => (
              <a
                data-magnetic
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                ↗ {label}
              </a>
            ))}
          </div>
        </div>

        <div
          className="absolute rounded-full"
          style={{ right: '14%', top: '22%', width: 28, height: 28, border: '1px solid rgba(255,255,255,0.12)' }}
        />
      </div>

      {/* ─── SECTION STAGE ─── */}
      <div
        className="w-full h-full"
        style={{
          opacity: visible ? 1 : 0,
          filter: visible ? 'blur(0px)' : 'blur(6px)',
          transition: 'opacity 0.26s ease, filter 0.26s ease',
        }}
      >
        {current === 'home' && <HeroSection navigate={navigateTo} />}
        {current === 'work' && <WorkSection />}
        {current === 'about' && <AboutSection />}
        {current === 'contact' && <ContactSection />}
      </div>
      </div>
    </MagneticCursor>
  )
}

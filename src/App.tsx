import { useEffect, useState } from 'react'
import devPhoto from '@/imports/istockphoto-840640768-170667a.jpg'
import draMilenaPreview from '@/imports/project-dra-milena.jpg'
import churrascariaPreview from '@/imports/project-churrascaria-tradicao-gaucha.jpg'
import telasPreview from '@/imports/project-telas-e-redes-sul.jpg'
import pizzariaPreview from '@/imports/project-pizzaria-tradicao-gaucha.jpg'
import nitidaPreview from '@/imports/project-nitida.jpg'
import elcanaPreview from '@/imports/project-elcana.jpg'
import MeshDriftBackground from './MeshDriftBackground'
import { MagneticCursor } from './components/ui/magnetic-cursor'
import WavyText from './components/ui/wavy-text'

const PROJECTS = [
  {
    id: 0,
    title: 'Dra. Milena',
    category: 'Landing Page',
    description: 'Site premium para advocacia.',
    descriptionEn: 'Premium law firm website.',
    accent: '#4a4b6a',
    image: draMilenaPreview,
    url: 'https://dramilenaadvocacia.netlify.app/',
  },
  {
    id: 1,
    title: 'Churrascaria Tradição Gaúcha',
    category: 'Landing Page',
    description: 'Landing page para churrascaria.',
    descriptionEn: 'Landing page for a Brazilian steakhouse.',
    accent: '#3a5a4a',
    image: churrascariaPreview,
    url: 'https://churrascariatradicaogaucha.netlify.app/',
  },
  {
    id: 2,
    title: 'Telas e Redes Sul',
    category: 'Landing Page',
    description: 'Loja de redes e telas.',
    descriptionEn: 'Website for a screens and nets store.',
    accent: '#5a3a6a',
    image: telasPreview,
    url: 'https://redesetelasflorianopolis.com.br/',
  },
  {
    id: 3,
    title: 'Pizzaria Tradição Gaúcha',
    category: 'Landing Page',
    description: 'Site para pizzaria.',
    descriptionEn: 'Website for a pizzeria.',
    accent: '#6a3a3a',
    image: pizzariaPreview,
    url: 'https://pizzariatradicaogaucha.vercel.app/',
  },
  {
    id: 4,
    title: 'Nítida',
    category: 'Landing Page',
    description: 'Site para empresa de limpeza.',
    descriptionEn: 'Website for a cleaning company.',
    accent: '#3d5a6a',
    image: nitidaPreview,
    url: 'https://nitidalimpeza.netlify.app/',
  },
  {
    id: 5,
    title: 'Elcana',
    category: 'Institucional',
    description: 'Site institucional para escola.',
    descriptionEn: 'Institutional website for a school.',
    accent: '#4a5a3a',
    image: elcanaPreview,
    url: 'https://elcana-ten.vercel.app/',
  },
]

const SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Next.js',
  'PostgreSQL', 'Figma', 'GraphQL', 'Tailwind CSS',
  'Docker', 'AWS',
]

type Section = 'home' | 'work' | 'about' | 'contact'
type Language = 'pt' | 'en'

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
      <path d="M13 4L1 16L13 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 4L41 16L29 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="25" y1="2" x2="17" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {[4, 11, 18].flatMap(y =>
        [4, 11, 18].map(x => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" fill="currentColor" opacity="0.75" />
        ))
      )}
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" opacity="0.75" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" opacity="0.75" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ThemeIcon({ darkMode }: { darkMode: boolean }) {
  return darkMode ? (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2.5v2M12 19.5v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2.5 12h2m15 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HeroSection({
  navigate,
  language,
}: {
  navigate: (s: Section) => void
  language: Language
}) {
  const isEnglish = language === 'en'

  return (
    <div className="mobile-page-section relative w-full h-full flex items-center justify-center overflow-hidden">
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
              WebkitTextStroke: '1.5px var(--text-primary)',
            }}
          >
            {isEnglish ? "Hi, I'm " : 'Ei, sou '}
          </span>
          <WavyText>JOÃO VITOR DA M. S.</WavyText>
          <br />
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 400,
              color: 'transparent',
              WebkitTextStroke: '1.5px var(--text-primary)',
            }}
          >
            {isEnglish ? ' BUT YOU CAN CALL ME ' : ' MAIS PODE ME CHAMAR '}
          </span>
          <WavyText>MÁIA</WavyText>
        </h1>

        <p
          className="font-light leading-relaxed mb-10"
          style={{ color: 'var(--text-36)', fontSize: '0.875rem' }}
        >
          {isEnglish
            ? 'I am a front-end developer and UX/UI designer.'
            : 'Sou desenvolvedor front-end e designer de UX/UI.'}
          <br />
          &amp; creative technologist
        </p>

        <div className="flex items-center justify-center gap-10">
          <button
            data-magnetic
            onClick={() => navigate('work')}
            className="text-sm font-light transition-colors duration-200 hover:text-[var(--text-primary)]"
            style={{ color: 'var(--text-52)' }}
          >
            {isEnglish ? '→ View my work' : '→ Veja meus projetos'}
          </button>
          <button
            data-magnetic
            onClick={() => navigate('about')}
            className="text-sm font-light transition-colors duration-200 hover:text-[var(--text-primary)]"
            style={{ color: 'var(--text-52)' }}
          >
            {isEnglish ? '→ more about me' : '→ mais sobre mim'}
          </button>
        </div>
      </div>
    </div>
  )
}

function WorkSection({ language, darkMode }: { language: Language; darkMode: boolean }) {
  const [hovered, setHovered] = useState(0)
  const active = PROJECTS[hovered]
  const isEnglish = language === 'en'

  const selectProject = (index: number) => {
    setHovered(index)
  }

  return (
    <div className="mobile-work-section relative flex w-full h-full overflow-hidden">
      {/* Left sticky preview */}
      <div
        className="relative z-10 hidden md:block w-[49%] h-full flex-shrink-0"
        style={{
          background: darkMode
            ? `radial-gradient(ellipse at 42% 42%, ${active.accent}99 0%, transparent 78%)`
            : 'radial-gradient(ellipse at 42% 42%, rgba(107, 142, 184, 0.2) 0%, transparent 78%)',
        }}
      >
        <a
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-0 bottom-0 top-1/4 overflow-hidden rounded-tr-[2.5rem]"
          aria-label={`${isEnglish ? 'Visit' : 'Visitar'} ${active.title}`}
        >
          <img
            key={`${active.id}-preview`}
            src={active.image}
            alt={`${isEnglish ? 'Preview of' : 'Prévia de'} ${active.title}`}
            className="absolute inset-0 h-full w-full object-contain object-top"
          />
        </a>
      </div>

      {/* Right list */}
      <div className="mobile-work-list relative z-10 flex-1 flex flex-col justify-center px-10 md:px-10 py-28 overflow-y-auto">
        <div
          className="flex items-baseline justify-between pb-5 mb-0"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <h2
            className="font-black uppercase tracking-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)' }}
          >
            {isEnglish ? 'WORK' : 'TRABALHOS'}
          </h2>
          <span className="text-sm font-light" style={{ color: 'var(--text-25)' }}>
            {PROJECTS.length}
          </span>
        </div>

        {PROJECTS.map((project, i) => (
          <a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => selectProject(i)}
            onFocus={() => selectProject(i)}
            className="group flex w-full items-center justify-between gap-4 py-4 text-left"
            style={{ borderBottom: '1px solid var(--line)' }}
          >
            <span className="min-w-0 flex-1">
              <span
                className="block truncate font-bold tracking-wide transition-colors duration-150"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.15rem',
                  color: hovered === i ? 'var(--text-primary)' : 'var(--text-65)',
                  letterSpacing: '0.03em',
                }}
              >
                {hovered === i && <span className="mr-2">→</span>}
                {project.title}
              </span>
              <span className="mt-1 block truncate text-xs font-light" style={{ color: 'var(--text-45)' }}>
                {isEnglish ? project.descriptionEn : project.description}
              </span>
            </span>
            <span
              className="hidden text-xs font-light uppercase tracking-wider sm:block"
              style={{ color: 'var(--text-28)' }}
            >
              {isEnglish
                ? project.category === 'Institucional' ? 'Institutional' : 'Landing Page'
                : project.category}
            </span>
            <span className="sr-only">{isEnglish ? 'Open project website' : 'Abrir site do projeto'}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function AboutSection({ language }: { language: Language }) {
  const [isPhotoHovered, setIsPhotoHovered] = useState(false)
  const isEnglish = language === 'en'

  return (
    <div className="mobile-about-section relative flex w-full h-full items-center px-8 md:px-20 lg:px-28 overflow-y-auto">
      <div className="about-section-content relative z-10 w-full max-w-5xl py-20">
        <h2
          className="font-black uppercase tracking-tight mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)' }}
        >
          {isEnglish ? 'ABOUT ME' : 'SOBRE MIM'}
        </h2>
        <div className="h-px mb-12" style={{ background: 'var(--line)' }} />

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
              alt={isEnglish ? 'Developer photo' : 'Foto do desenvolvedor'}
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
                style={{ color: 'var(--text-52)', fontSize: '0.95rem' }}
              >
                {isEnglish
                  ? 'I am a passionate front-end developer based in Brazil. I specialize in creating beautiful, high-performance web experiences with modern technologies. I deeply value design systems, accessibility, and the art of writing clean code.'
                  : 'Sou um desenvolvedor front-end apaixonado, baseado no Brasil. Especializo-me na criação de experiências web belas e de alto desempenho utilizando tecnologias modernas. Valorizo profundamente sistemas de design, acessibilidade e a arte de escrever código limpo.'}
              </p>
              <p
                className="leading-[1.9] font-light"
                style={{ color: 'var(--text-28)', fontSize: '0.875rem' }}
              >
                {isEnglish
                  ? "When I'm not coding, you'll find me exploring open-source projects, designing UI concepts, or experimenting with creative coding and generative art."
                  : 'Quando não estou programando, você me encontrará explorando projetos de código aberto, projetando conceitos de UI ou experimentando com programação criativa e arte generativa.'}
              </p>
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-[0.22em] font-light mb-4"
                style={{ color: 'var(--text-22)' }}
              >
                {isEnglish ? 'TECHNOLOGIES' : 'TECNOLOGIAS'}
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <span
                    key={skill}
                    className="text-xs font-light px-3 py-1.5 cursor-default transition-all duration-200"
                    style={{ border: '1px solid var(--line)', color: 'var(--text-45)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-80)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-45)'
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

function ContactSection({ language }: { language: Language }) {
  const isEnglish = language === 'en'

  return (
    <div className="mobile-contact-section relative flex w-full h-full items-center px-8 md:px-20 lg:px-28">
      <div className="relative z-10 w-full max-w-5xl">
        <h2
          className="font-black uppercase tracking-tight mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem,6vw,5rem)' }}
        >
          {isEnglish ? 'CONTACT' : 'CONTATO'}
        </h2>
        <div className="h-px mb-12" style={{ background: 'var(--line)' }} />

        <div className="mobile-contact-grid grid md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <p
              className="text-xs uppercase tracking-[0.22em] font-light mb-4"
              style={{ color: 'var(--text-22)' }}
            >
              EMAIL
            </p>
            <a
              href="mailto:hello@yourname.dev"
              className="flex w-fit items-center gap-2 font-light transition-colors duration-200 hover:text-[var(--text-primary)]"
              style={{ color: 'var(--text-58)', fontSize: '0.9rem' }}
            >
              <ArrowUpRightIcon />
              hello@yourname.dev
            </a>
          </div>

          <div>
            <p
              className="text-xs uppercase tracking-[0.22em] font-light mb-4"
              style={{ color: 'var(--text-22)' }}
            >
              {isEnglish ? 'SOCIAL MEDIA' : 'REDES SOCIAIS'}
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
                  className="flex w-fit items-center gap-2 font-light transition-colors duration-200 hover:text-[var(--text-primary)]"
                  style={{ color: 'var(--text-58)', fontSize: '0.9rem' }}
                >
                  <ArrowUpRightIcon />
                  {label}
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
  const [language, setLanguage] = useState<Language>('pt')
  const [darkMode, setDarkMode] = useState(true)
  const isEnglish = language === 'en'
  const navItems = [
    { label: 'MENU', id: 'home' as const },
    { label: isEnglish ? 'WORK' : 'TRABALHOS', id: 'work' as const },
    { label: isEnglish ? 'ABOUT' : 'SOBRE', id: 'about' as const },
    { label: isEnglish ? 'CONTACT' : 'CONTATO', id: 'contact' as const },
  ]

  useEffect(() => {
    document.documentElement.lang = isEnglish ? 'en' : 'pt-BR'
  }, [isEnglish])

  useEffect(() => {
    const pageBackground = darkMode ? '#252631' : '#f4f7fc'
    document.documentElement.style.backgroundColor = pageBackground
    document.body.style.backgroundColor = pageBackground
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', pageBackground)
  }, [darkMode])

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
    <MagneticCursor magneticFactor={0.55} blendMode="difference" cursorColor="#ffffff" cursorSize={24}>
      <div
        className={`theme-root relative w-full h-full overflow-hidden ${darkMode ? 'theme-dark' : 'theme-light'}`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
      <MeshDriftBackground />

      {/* ─── FIXED HEADER ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
        style={{ pointerEvents: navOpen ? 'none' : 'auto' }}
      >
        {!navOpen && (
          <button
            data-magnetic
            onClick={() => navigateTo('home')}
            className="flex h-12 w-14 items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
          >
            <Logo />
          </button>
        )}
        <div className="flex items-center gap-5">
          {!navOpen && (
            <button
              data-magnetic
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 opacity-60 transition-opacity duration-200 hover:opacity-100"
              aria-label={darkMode
                ? (isEnglish ? 'Switch to light mode' : 'Ativar modo claro')
                : (isEnglish ? 'Switch to dark mode' : 'Ativar modo escuro')}
              title={darkMode
                ? (isEnglish ? 'Light mode' : 'Modo claro')
                : (isEnglish ? 'Dark mode' : 'Modo escuro')}
            >
              <ThemeIcon darkMode={darkMode} />
            </button>
          )}
          {!navOpen && (
            <button
              data-magnetic
              onClick={() => setLanguage(isEnglish ? 'pt' : 'en')}
              className="text-sm font-light opacity-60 hover:opacity-100 transition-opacity duration-200 p-1"
              aria-label={isEnglish ? 'Mudar idioma para português' : 'Switch language to English'}
              title={isEnglish ? 'Português (Brasil)' : 'English'}
            >
              {isEnglish ? 'BR' : 'EN'}
            </button>
          )}
          {!navOpen && (
            <button
              data-magnetic
              onClick={() => setNavOpen(true)}
              className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-1"
              aria-label={isEnglish ? 'Open menu' : 'Abrir menu'}
            >
              <GridIcon />
            </button>
          )}
        </div>
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
        {navOpen && (
          <div className="absolute top-6 right-8 z-10 flex items-center gap-5">
            <button
              data-magnetic
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 opacity-60 transition-opacity duration-200 hover:opacity-100"
              aria-label={darkMode
                ? (isEnglish ? 'Switch to light mode' : 'Ativar modo claro')
                : (isEnglish ? 'Switch to dark mode' : 'Ativar modo escuro')}
              title={darkMode
                ? (isEnglish ? 'Light mode' : 'Modo claro')
                : (isEnglish ? 'Dark mode' : 'Modo escuro')}
            >
              <ThemeIcon darkMode={darkMode} />
            </button>
            <button
              data-magnetic
              onClick={() => setLanguage(isEnglish ? 'pt' : 'en')}
              className="text-sm font-light opacity-60 hover:opacity-100 transition-opacity duration-200 p-1"
              aria-label={isEnglish ? 'Mudar idioma para português' : 'Switch language to English'}
              title={isEnglish ? 'Português (Brasil)' : 'English'}
            >
              {isEnglish ? 'BR' : 'EN'}
            </button>
            <button
              data-magnetic
              onClick={() => setNavOpen(false)}
              className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-1"
              aria-label={isEnglish ? 'Close menu' : 'Fechar menu'}
            >
              <CloseIcon />
            </button>
          </div>
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
            aria-label={isEnglish ? 'Go to home' : 'Ir para o início'}
          >
            <Logo />
          </button>
          <span className="text-sm font-light" style={{ color: 'var(--text-35)' }}>
            {isEnglish ? 'João Vitor / Developer' : 'João Vitor / Desenvolvedor'}
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center pl-[22vw] md:pl-[26vw] pr-12">
          <nav>
            {navItems.map(({ label, id }, i) => (
              <button
                key={id}
                onClick={() => navigateTo(id as Section)}
                className="flex items-baseline gap-5 group w-full text-left"
              >
                <span
                  className="text-xs font-light tabular-nums"
                  style={{ color: 'var(--text-25)', width: '2rem' }}
                >
                  0{i + 1}
                </span>
                <span
                  data-magnetic
                  className="inline-block font-black uppercase text-[var(--text-primary)] group-hover:opacity-60 transition-opacity duration-200"
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
                className="text-sm font-light transition-colors duration-200 hover:text-[var(--text-primary)]"
                style={{ color: 'var(--text-30)' }}
              >
                <span className="inline-flex items-center gap-2">
                  <ArrowUpRightIcon />
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div
          className="absolute rounded-full"
          style={{ right: '14%', top: '22%', width: 28, height: 28, border: '1px solid var(--line)' }}
        />
      </div>

      {/* ─── SECTION STAGE ─── */}
      <div
        className="section-stage w-full h-full"
        style={{
          opacity: visible && !navOpen ? 1 : 0,
          filter: visible && !navOpen ? 'blur(0px)' : 'blur(6px)',
          pointerEvents: navOpen ? 'none' : 'auto',
          transition: 'opacity 0.26s ease, filter 0.26s ease',
        }}
      >
          {current === 'home' && <HeroSection navigate={navigateTo} language={language} />}
          {current === 'work' && <WorkSection language={language} darkMode={darkMode} />}
          {current === 'about' && <AboutSection language={language} />}
          {current === 'contact' && <ContactSection language={language} />}
      </div>
      </div>
    </MagneticCursor>
  )
}

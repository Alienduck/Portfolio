import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/About.css'

gsap.registerPlugin(ScrollTrigger)

// Tunic-inspired sacred cross / konami-style easter egg
// The Tunic fox explores ruins and discovers a language. The sacred cross is an icon.
// Sequence: ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight
const TUNIC_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

export default function About() {
  const [tunicUnlocked, setTunicUnlocked] = useState(false)
  const [tunicPhase, setTunicPhase] = useState(0)
  const keyBuffer = useRef<string[]>([])
  const crossRef = useRef<SVGSVGElement>(null)
  const pageRef = useRef<HTMLElement>(null)

  // Hidden golden pattern - Tunic sacred cross SVG
  // It glows subtly when hovered, and reacts to arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()

    keyBuffer.current = [...keyBuffer.current, e.key].slice(-TUNIC_SEQUENCE.length)

    const buf = keyBuffer.current
    const seq = TUNIC_SEQUENCE.slice(0, buf.length)

    // Show progress visually
    const match = buf.every((k, i) => k === seq[i])
    if (match) {
      setTunicPhase(buf.length)
    } else {
      keyBuffer.current = []
      setTunicPhase(0)
    }

    if (buf.join(',') === TUNIC_SEQUENCE.join(',')) {
      setTunicUnlocked(true)
      keyBuffer.current = []
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!tunicUnlocked || !crossRef.current) return

    // Animate the sacred cross reveal
    const tl = gsap.timeline()
    tl.to(crossRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' })
      .to('.tunic-glyph', {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out'
      })
      .to('.tunic-message', { opacity: 1, y: 0, duration: 0.6 })
  }, [tunicUnlocked])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry
      gsap.set('.about-headline', { clipPath: 'inset(0 100% 0 0)' })
      gsap.set('.about-para', { opacity: 0, y: 30 })
      gsap.set('.interest-card', { opacity: 0, y: 50 })
      gsap.set('.hidden-cross', { opacity: 0, scale: 0.8 })
      gsap.set('.about-photo-wrap', { opacity: 0, x: 60 })

      const tl = gsap.timeline({ delay: 0.3 })
      tl.to('.about-headline', { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.out', stagger: 0.1 })
        .to('.about-para', { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, '-=0.5')
        .to('.about-photo-wrap', { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')

      // Interest cards on scroll
      gsap.to('.interest-card', {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.interests-grid', start: 'top 80%' }
      })

      // Subtle cross hint pulse
      gsap.to('.hidden-cross', {
        opacity: 0.15, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut'
      })

    }, pageRef)

    return () => ctx.revert()
  }, [])

  const interests = [
    {
      icon: '🦊',
      title: 'Jeux vidéo',
      desc: 'Des mondes qui racontent des histoires à travers leur design, leur mystère et leur langage.',
      highlight: false,
    },
    {
      icon: '⚗️',
      title: 'Algorithmique',
      desc: 'Trouver l\'élégance dans la logique, résoudre des puzzles qui n\'ont pas encore de solution.',
      highlight: false,
    },
    {
      icon: '🎨',
      title: 'UI/Motion Design',
      desc: 'Donner vie aux interfaces. Faire que chaque pixel ait l\'intention d\'exister.',
      highlight: false,
    },
    {
      icon: '📡',
      title: 'Systèmes distribués',
      desc: 'L\'orchestration de services, la resilience, l\'architecture à grande échelle.',
      highlight: false,
    },
    {
      icon: '🔭',
      title: 'Sciences & IA',
      desc: 'L\'apprentissage automatique comme outil, pas comme mystère.',
      highlight: false,
    },
    {
      icon: '🌿',
      title: 'Exploration',
      desc: 'Explorer des lieux, des idées et des codes que personne n\'a encore vraiment compris.',
      highlight: true,
    },
  ]

  return (
    <main ref={pageRef} className="page about-page">
      <section className="about-hero">
        <div className="about-left">
          <span className="section-tag">À PROPOS</span>
          <h1 className="about-headline">
            <div>Étudiant.</div>
            <div><span className="gradient-text">Développeur.</span></div>
            <div>Curieux.</div>
          </h1>
          <div className="about-paras">
            <p className="about-para">
              Je suis étudiant en informatique, passionné par la création d'expériences numériques qui
              mêlent technique rigoureuse et sensibilité artistique. Je crois que le meilleur code
              est celui qu'on ne voit pas, mais qu'on ressent.
            </p>
            <p className="about-para">
              Mon approche : comprendre avant de coder. Concevoir avant de construire.
              Et toujours chercher la couche cachée sous ce qu'on nous montre.
            </p>
            <p className="about-para about-hint">
              <span className="hint-mono">// hint : certaines vérités se trouvent au bout des flèches</span>
            </p>
          </div>
        </div>

        <div className="about-right">
          <div className="about-photo-wrap">
            <div className="about-photo-frame">
              <div className="about-photo-inner">
                <div className="about-photo-gradient" />
                <div className="about-photo-code">
                  <pre>{`function explore() {
  const world = new World();
  while (world.hasSecrets()) {
    const clue = world
      .look()
      .find(isHidden);
    if (clue) decode(clue);
  }
}`}</pre>
                </div>
              </div>
            </div>
            <div className="about-photo-deco" />
          </div>

          {/* Hidden Tunic sacred cross - subtly pulsing */}
          <div className="hidden-cross-wrap">
            <svg
              ref={crossRef}
              className={`hidden-cross ${tunicUnlocked ? 'unlocked' : ''}`}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sacred cross - Tunic style */}
              <rect x="42" y="10" width="16" height="80" fill="url(#goldGrad)" rx="1" />
              <rect x="10" y="38" width="80" height="16" fill="url(#goldGrad)" rx="1" />
              {/* Corner ornaments */}
              <circle cx="42" cy="38" r="4" fill="url(#goldGrad)" />
              <circle cx="58" cy="38" r="4" fill="url(#goldGrad)" />
              <circle cx="42" cy="54" r="4" fill="url(#goldGrad)" />
              <circle cx="58" cy="54" r="4" fill="url(#goldGrad)" />
              {/* Center gem */}
              <polygon points="50,44 56,50 50,56 44,50" fill="#fcd34d" />
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f4b942" />
                  <stop offset="100%" stopColor="#fcd34d" />
                </linearGradient>
              </defs>
            </svg>

            {/* Progress indicator for the sequence */}
            {tunicPhase > 0 && !tunicUnlocked && (
              <div className="tunic-progress">
                {TUNIC_SEQUENCE.map((_, i) => (
                  <div key={i} className={`tunic-pip ${i < tunicPhase ? 'active' : ''}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TUNIC EASTER EGG REVEAL */}
      {tunicUnlocked && (
        <section className="tunic-reveal">
          <div className="tunic-reveal-inner">
            <div className="tunic-glyphs">
              {['✦', '◈', '⟡', '✦', '◈', '⟡'].map((g, i) => (
                <span key={i} className="tunic-glyph">{g}</span>
              ))}
            </div>
            <div className="tunic-message">
              <p className="tunic-msg-text">
                « Dans les ruines oubliées, le renard avance sans guide.<br />
                Il apprend la langue du monde en observant ses formes.<br />
                <span className="gradient-text-gold">Tunic</span> — le jeu qui m'a appris que ne pas comprendre,<br />
                c'est déjà commencer à chercher. »
              </p>
              <span className="tunic-credit">— jeu favori de tous les temps</span>
            </div>
          </div>
        </section>
      )}

      {/* INTERESTS */}
      <section className="interests-section">
        <div className="section-header">
          <span className="section-tag">INTÉRÊTS</span>
          <h2 className="section-title">Ce qui m'anime</h2>
        </div>
        <div className="interests-grid">
          {interests.map(item => (
            <div key={item.title} className={`interest-card ${item.highlight ? 'highlight' : ''}`}>
              <span className="interest-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {item.highlight && <div className="interest-glow" />}
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section">
        <div className="section-header">
          <span className="section-tag">PARCOURS</span>
          <h2 className="section-title">Mon chemin</h2>
        </div>
        <div className="timeline">
          {[
            { year: '2024', title: 'Projets personnels avancés', desc: 'APIs, motion design, systèmes complexes.' },
            { year: '2023', title: 'Premières contributions open-source', desc: 'Découverte de l\'écosystème dev.' },
            { year: '2022', title: 'Licence Informatique', desc: 'Algorithmes, réseaux, bases de données.' },
            { year: '2021', title: 'Premier projet React', desc: 'Le début de l\'obsession frontend.' },
          ].map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
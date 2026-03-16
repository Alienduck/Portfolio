import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/About.css'
import secretSound from '../assets/secret.wav'

gsap.registerPlugin(ScrollTrigger)

const TUNIC_SEQUENCE = ['ArrowUp', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowRight']
const UNLOCK_SOUND = new Audio(secretSound)
UNLOCK_SOUND.volume = 0.4

const TIMELINE_ITEMS = [
  {
    year: '2025',
    title: 'Dev Confirmé',
    desc: "Apprentissage de Rust et du web moderne et retour sur Unity — la syntaxe ne pose plus de problèmes.",
    tags: ['Rust', 'React', 'TypeScript', 'Unity', 'GSAP'],
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
  },
  {
    year: '2024',
    title: 'Entrée en Matière',
    desc: "Apprentissage du C et du web basique - Les bases solides.",
    tags: ['C', 'HTML', 'CSS', 'JavaScript', 'PostgreSQL'],
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #60a5fa, #818cf8)',
  },
  {
    year: '2023',
    title: 'Passage sur Unity',
    desc: "Découverte de ce qu'est un moteur de jeu avec CoolMountain. Le game-dev devient une passion, pas juste un hobby.",
    tags: ['C#', 'Unity', 'Blender', 'Git'],
    color: '#818cf8',
    gradient: 'linear-gradient(135deg, #818cf8, #c084fc)',
  },
  {
    year: '2022',
    title: 'Apprentissage Python',
    desc: "Le début de l'ascension. Mes premiers pas vers un monde plus vaste que je ne l'imagine.",
    tags: ['Python', 'Algorithmique', 'Discord.py'],
    color: '#c084fc',
    gradient: 'linear-gradient(135deg, #c084fc, #a78bfa)',
  },
]

TIMELINE_ITEMS.reverse()

const isMobile = () => window.innerWidth <= 768

export default function About() {
  const [tunicUnlocked, setTunicUnlocked] = useState(false)
  const [tunicPhase, setTunicPhase] = useState(0)
  const [activeCard, setActiveCard] = useState(0)
  const keyBuffer = useRef<string[]>([])
  const crossRef = useRef<SVGSVGElement>(null)
  const pageRef = useRef<HTMLElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // ===== TUNIC EASTER EGG =====
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
    e.preventDefault()
    keyBuffer.current = [...keyBuffer.current, e.key].slice(-TUNIC_SEQUENCE.length)
    const buf = keyBuffer.current
    const seq = TUNIC_SEQUENCE.slice(0, buf.length)
    if (buf.every((k, i) => k === seq[i])) setTunicPhase(buf.length)
    else { keyBuffer.current = []; setTunicPhase(0) }
    if (buf.join(',') === TUNIC_SEQUENCE.join(',')) {
      UNLOCK_SOUND.currentTime = 0
      UNLOCK_SOUND.play().catch(console.warn)
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
    const tl = gsap.timeline()
    tl.to(crossRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' })
      .to('.tunic-glyph', { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' })
      .to('.tunic-message', { opacity: 1, y: 0, duration: 0.6 })
  }, [tunicUnlocked])

  // ===== PAGE ENTRY ANIMATIONS =====
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.about-headline', { clipPath: 'inset(0 100% 0 0)' })
      gsap.set('.about-para', { opacity: 0, y: 30 })
      gsap.set('.interest-card', { opacity: 0, y: 50 })
      gsap.set('.hidden-cross', { opacity: 0, scale: 0.8 })
      gsap.set('.about-photo-wrap', { opacity: 0, x: 60 })

      const tl = gsap.timeline({ delay: 0.3 })
      tl.to('.about-headline', { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.out', stagger: 0.1 })
        .to('.about-para', { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, '-=0.5')
        .to('.about-photo-wrap', { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')

      gsap.to('.interest-card', {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.interests-grid', start: 'top 95%', once: true },
      })

      gsap.from('.music-content > *', {
        opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.music-section', start: 'top 85%', once: true }
      })

      gsap.from('.music-player-wrap', {
        opacity: 0, scale: 0.95, duration: 0.8, ease: 'power2.out', delay: 0.2,
        scrollTrigger: { trigger: '.music-section', start: 'top 85%', once: true }
      })

      gsap.to('.hidden-cross', { opacity: 0.15, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // ===== DESKTOP ONLY : GSAP doom-scroll pin =====
  useEffect(() => {
    if (isMobile()) return
    if (!scrollerRef.current || !pinnedRef.current) return

    const total = TIMELINE_ITEMS.length
    const st = ScrollTrigger.create({
      trigger: scrollerRef.current,
      start: 'top top',
      end: () => `+=${total * window.innerHeight}`,
      pin: pinnedRef.current,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const index = Math.min(Math.floor(self.progress * total), total - 1)
        setActiveCard(prev => prev !== index ? index : prev)
      },
    })
    return () => st.kill()
  }, [])

  // ===== DESKTOP ONLY : card 3D transitions =====
  useEffect(() => {
    if (isMobile()) return
    const cards = gsap.utils.toArray<HTMLElement>('.tl-card')
    cards.forEach((card, i) => {
      if (i === activeCard) {
        gsap.fromTo(card,
          { opacity: 0, rotateX: 10, z: -600, y: 60 },
          { opacity: 1, rotateX: 0, z: 0, y: 0, duration: 0.65, ease: 'expo.out' }
        )
      } else if (i < activeCard) {
        gsap.to(card, { opacity: 0, z: 300, y: -40, duration: 0.35, ease: 'expo.in' })
      } else {
        gsap.set(card, { opacity: 0, z: -800, y: 60, rotateX: 10 })
      }
    })
  }, [activeCard])

  // ===== MOBILE ONLY : IntersectionObserver sur les cartes =====
  useEffect(() => {
    if (!isMobile()) return
    const cards = document.querySelectorAll('.tl-mobile-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target) // once
          }
        })
      },
      { threshold: 0.15 }
    )
    cards.forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const interests = [
    { icon: '🦊', title: 'Game dev', desc: "Un processus long et parfois éprouvant, qui aboutis à des chefs d'oeuvres.", highlight: true },
    { icon: '⚗️', title: 'Algo', desc: "Trouver des solutions à des problèmes plus ou moins complexes et avec différentes manières.", highlight: true },
    { icon: '🎨', title: 'UI/Motion Design', desc: "Donner vie aux interfaces. Faire que chaque pixel ait l'intention d'exister.", highlight: false },
    { icon: '🔨', title: 'Architecture', desc: "Quelque chose que l'on apprend plus avec le temps et l'expérience qu'à l'école.", highlight: false },
    { icon: '🔭', title: 'Sciences & IA', desc: "Chat GPT n'est pas une IA mais un LLM, pour moi les seuls vrais algos d'IA sont fait avec NEAT", highlight: false },
    { icon: '🥊', title: 'Boxe', desc: "Un peu de sport ne fais pas de mal.", highlight: true },
  ]

  return (
    <main ref={pageRef} className="page about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-left">
          <span className="section-tag">À PROPOS</span>
          <h1 className="about-headline">
            <div>Étudiant.</div>
            <div><span className="gradient-text">Développeur.</span></div>
            <div>Passionné.</div>
          </h1>
          <div className="about-paras">
            <p className="about-para">
              Etudiant en informatique, passionné par le développement qui mélange technique rigoureuse
              et remise en question. Le code est en quelque sorte <span className="about-para-accent">une partie de nous</span>.
            </p>
            <p className="about-para">
              Mon approche : comprendre avant de coder. Concevoir avant de construire.
              Chercher la moindre optimisation sans être certain.
            </p>
            <p className="about-para about-hint">
              <span className="hint-mono">// hint : le <button className="gold" onClick={() => {
                gsap.set('.path-glow', { strokeOpacity: 1} )
                gsap.to('#mainPath', { className: "+=path-pulse", duration: 0 })
              }} onMouseEnter={() => {
                gsap.to('#mainPath', { className: "+=path-obvious", duration: 0 })
              }} onMouseLeave={() => {
                gsap.to('#mainPath', { className: "-=path-obvious", duration: 0 })
              }}>chemin</button> révèle les secrets</span>
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

          <div className="hidden-cross-wrap">
            <svg ref={crossRef} className={`hidden-cross ${tunicUnlocked ? 'unlocked' : ''}`}
              viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="42" y="10" width="16" height="80" fill="url(#goldGrad)" rx="1" />
              <rect x="10" y="38" width="80" height="16" fill="url(#goldGrad)" rx="1" />
              <circle cx="42" cy="38" r="4" fill="url(#goldGrad)" />
              <circle cx="58" cy="38" r="4" fill="url(#goldGrad)" />
              <circle cx="42" cy="54" r="4" fill="url(#goldGrad)" />
              <circle cx="58" cy="54" r="4" fill="url(#goldGrad)" />
              <polygon points="50,44 56,50 50,56 44,50" fill="#fcd34d" />
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f4b942" />
                  <stop offset="100%" stopColor="#fcd34d" />
                </linearGradient>
              </defs>
            </svg>
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

      {/* TUNIC EASTER EGG */}
      {tunicUnlocked && (
        <section className="tunic-reveal">
          <div className="tunic-reveal-inner">
            <div className="tunic-glyphs">
              {['✦', '◈', '⟡', '✦', '◈', '⟡'].map((g, i) => (
                <span key={i} className="tunic-glyph">{g}</span>
              ))}
            </div>
            <div className="tunic-message">
              <span className="gradient-text-gold">Tunic</span>
              <p className="tunic-msg-text">
                « Dans les ruines oubliées, le renard avance sans guide.<br />
                Il apprend la langue du monde en déchiffrant les glyphes.<br /><br />
                Le jeu qui m'a appris que ne pas comprendre,<br />
                c'est déjà commencer à chercher. »
              </p>
              <span className="tunic-credit">— Le jeu qui m'a à jamais marqué <span className='gold'>Tunic</span>.</span>
            </div>
          </div>
        </section>
      )}

      {/* INTERESTS */}
      <section className="interests-section">
        <div className="section-header">
          <span className="section-tag">INTÉRÊTS</span>
          <h2 className="section-title">Ce que j'étudie</h2>
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

      {/* MUSIC */}
      <section className="music-section">
        <div className="music-container">
          <div className="music-content">
            <span className="section-tag">Bande-son</span>
            <h2 className="section-title">Ce qui rythme mon <span className="gradient-text">code</span></h2>
            <p className="music-desc">
              Les meilleures OST que j'ai pu entendre jusqu'à maintenant. Faites les jeux d'ailleurs si ce n'est pas déjà fait.
            </p>
            <div className="music-visualizer">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="sound-bar" />
              ))}
            </div>
          </div>
          <div className="music-player-wrap">
            <div className="music-player-glow" />
            <div className="music-player-frame">
              <iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/4GJXiPh38Hdt7BZ3ixa6vU?utm_source=generator&theme=0" width="100%" height="500" allowFullScreen={ true } allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section">
        <div className="timeline-section-header">
          <span className="section-tag">PARCOURS</span>
          <h2 className="section-title">Mon chemin</h2>
        </div>

        {/* ── DESKTOP : doom-scroll GSAP ── */}
        <div ref={scrollerRef} className="tl-scroller tl-desktop-only">
          <div ref={pinnedRef} className="tl-pinned">
            <div className="tl-atmosphere">
              <div className="tl-horizon" />
              <div className="tl-rail tl-rail-left" />
              <div className="tl-rail tl-rail-right" />
              <div className="tl-grid-floor" />
              <div className="tl-vignette" />
              <div className="tl-scanline" />
            </div>

            {[...Array(10)].map((_, i) => (
              <div key={i} className="tl-particle" style={{
                left: `${10 + (i * 9) % 80}%`,
                top: `${15 + (i * 13) % 70}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                background: i % 2 === 0 ? 'rgba(167,139,250,0.7)' : 'rgba(96,165,250,0.7)',
                animationDuration: `${4 + (i % 4)}s`,
                animationDelay: `${(i * 0.7) % 4}s`,
              }} />
            ))}

            <div className="tl-stage">
              {TIMELINE_ITEMS.map((item, i) => (
                <div key={i} className="tl-card"
                  style={{ '--card-color': item.color, '--card-gradient': item.gradient } as React.CSSProperties}>
                  <div className="tl-card-inner">
                    <div className="tl-card-grid-bg" />
                    <div className="tl-card-bar" />
                    <div className="tl-card-header">
                      <span className="tl-card-num">{String(i + 1).padStart(2, '0')} / {String(TIMELINE_ITEMS.length).padStart(2, '0')}</span>
                      <span className="tl-card-year">{item.year}</span>
                    </div>
                    <h3 className="tl-card-title">{item.title}</h3>
                    <p className="tl-card-desc">{item.desc}</p>
                    <div className="tl-card-tags">
                      {item.tags.map(tag => <span key={tag} className="tl-card-tag">{tag}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="tl-nav">
              {TIMELINE_ITEMS.map((item, i) => (
                <div key={i} className={`tl-nav-dot ${i === activeCard ? 'active' : ''}`} data-year={item.year} />
              ))}
            </div>
            <div className="tl-progress-bar">
              <div className="tl-progress-fill" style={{ width: `${((activeCard + 1) / TIMELINE_ITEMS.length) * 100}%` }} />
            </div>
            <div className="tl-scroll-hint">
              <span>{String(activeCard + 1).padStart(2, '0')}</span>
              <span className="tl-hint-sep">—</span>
              <span>SCROLL</span>
              <span className="tl-hint-sep">—</span>
              <span>{String(TIMELINE_ITEMS.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* ── MOBILE : liste de cartes statiques ── */}
        <div className="tl-mobile-list">
          {TIMELINE_ITEMS.map((item, i) => (
            <div
              key={i}
              className="tl-mobile-card"
              style={{ '--card-color': item.color, '--card-gradient': item.gradient } as React.CSSProperties}
            >
              <div className="tl-mobile-dot" />
              {i < TIMELINE_ITEMS.length - 1 && <div className="tl-mobile-connector" />}

              <div className="tl-mobile-card-inner">
                <div className="tl-mobile-card-bar" />
                <div className="tl-mobile-card-header">
                  <span className="tl-mobile-year">{item.year}</span>
                  <span className="tl-mobile-num">{String(i + 1).padStart(2, '0')} / {String(TIMELINE_ITEMS.length).padStart(2, '0')}</span>
                </div>
                <h3 className="tl-mobile-title">{item.title}</h3>
                <p className="tl-mobile-desc">{item.desc}</p>
                <div className="tl-mobile-tags">
                  {item.tags.map(tag => <span key={tag} className="tl-mobile-tag">{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SVG Tunic — overflow contenu */}
      <div className="tunic-svg-wrap">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="495.000000pt" height="80.000000pt" viewBox="0 0 495.000000 80.000000"
 preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)"
          fill="rgb(233, 202, 64, 0.1)" stroke="none">
          <path d="M287 763 c-15 -15 -3 -25 78 -65 47 -23 85 -45 85 -48 0 -3 -38 -23
          -85 -45 l-84 -40 0 -72 -1 -73 -100 0 c-93 0 -100 -1 -100 -20 0 -20 7 -20
          620 -20 613 0 620 0 620 20 0 19 -7 20 -100 20 l-100 0 -2 173 c-3 145 -5 172
          -18 172 -13 0 -15 -27 -18 -172 l-2 -173 -380 0 -380 0 0 60 0 60 90 45 90 45
          101 -51 c72 -36 105 -47 112 -40 7 7 7 14 1 20 -8 9 -409 211 -417 211 -2 0
          -7 -3 -10 -7z"/>
          <path d="M1737 764 c-4 -4 -7 -83 -7 -176 l0 -168 -80 0 -79 0 -3 123 c-3 100
          -6 122 -18 122 -13 0 -15 -24 -18 -142 l-3 -143 221 0 c213 0 220 1 220 20 0
          19 -7 20 -100 20 l-100 0 -2 172 c-3 161 -9 194 -31 172z"/>
          <path d="M2283 716 l-102 -51 0 -142 -1 -143 820 0 c813 0 820 0 820 20 0 20
          -7 20 -300 20 l-300 0 -2 173 c-3 145 -5 172 -18 172 -13 0 -15 -27 -18 -172
          l-2 -173 -80 0 -79 0 -3 123 c-3 100 -6 122 -18 122 -12 0 -15 -22 -18 -122
          l-3 -123 -79 0 -80 0 -2 173 c-3 145 -5 172 -18 172 -13 0 -15 -27 -18 -172
          l-2 -173 -180 0 -180 0 0 60 0 60 100 50 c55 28 100 54 100 60 0 10 -209 121
          -225 118 -5 0 -56 -24 -112 -52z m192 -23 c41 -21 75 -40 75 -44 0 -3 -38 -23
          -85 -45 l-84 -39 -1 -72 0 -73 -80 0 -80 0 0 110 0 110 88 44 c48 25 88 45 89
          45 2 1 36 -16 78 -36z m332 -100 c-2 -21 -4 -4 -4 37 0 41 2 58 4 38 2 -21 2
          -55 0 -75z m-597 -65 c0 -57 -3 -78 -10 -68 -15 24 -10 150 6 150 2 0 4 -37 4
          -82z m597 -60 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z"/>
          <path d="M4133 716 l-102 -51 0 -142 -1 -143 420 0 c413 0 420 0 420 20 0 19
          -7 20 -100 20 l-100 0 0 60 0 60 100 50 c55 28 100 54 100 60 0 23 -26 17
          -109 -25 l-90 -45 -3 93 c-2 74 -6 92 -18 92 -12 0 -16 -18 -18 -92 l-3 -93
          -186 95 c-102 52 -191 94 -197 93 -6 0 -57 -24 -113 -52z m192 -23 c41 -21 75
          -40 75 -43 0 -3 -38 -25 -85 -48 l-85 -42 0 -70 0 -70 -80 0 -80 0 0 110 0
          110 88 44 c48 25 88 45 89 45 2 1 36 -16 78 -36z m215 -108 l90 -45 0 -60 0
          -60 -180 0 -180 0 0 60 0 60 88 44 c48 25 88 45 90 45 1 1 43 -19 92 -44z"/>
          <path d="M3387 663 c-4 -3 -7 -10 -7 -15 0 -12 219 -120 230 -113 22 14 5 27
          -100 80 -120 60 -114 58 -123 48z"/>
          <path d="M178 289 c-54 -27 -98 -53 -98 -59 0 -23 26 -17 109 25 l90 45 3 -93
          c2 -74 6 -92 18 -92 12 0 16 20 18 113 3 111 2 112 -20 111 -13 0 -67 -22
          -120 -50z"/>
          <path d="M578 289 c-54 -27 -98 -53 -98 -59 0 -23 27 -17 120 30 l101 51 99
          -52 100 -51 100 51 99 52 101 -51 c93 -47 120 -53 120 -30 0 13 -195 110 -220
          110 -11 0 -61 -20 -110 -45 l-90 -45 -90 45 c-49 25 -100 45 -112 44 -13 0
          -67 -22 -120 -50z"/>
          <path d="M1531 278 l1 -63 108 -53 109 -54 110 54 c60 29 110 59 110 65 1 15
          -190 113 -219 113 -11 0 -56 -18 -100 -40 l-80 -40 0 40 c0 33 -3 40 -20 40
          -18 0 -20 -6 -19 -62z m199 -48 l0 -70 -65 32 c-36 18 -65 35 -65 38 0 5 79
          47 128 69 1 0 2 -30 2 -69z m170 0 c0 -3 -29 -20 -65 -38 l-65 -32 0 70 0 70
          65 -32 c36 -18 65 -35 65 -38z"/>
          <path d="M2182 279 l3 -61 107 -55 107 -54 110 53 c60 29 110 59 110 65 1 15
          -189 113 -219 113 -19 0 -20 -6 -20 -90 l0 -90 -80 40 -80 40 0 50 c0 44 -3
          50 -20 50 -19 0 -21 -5 -18 -61z m25 4 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2
          -7 2 -21 0 -30z m343 -53 c0 -3 -29 -20 -65 -38 l-65 -32 0 70 0 70 65 -32
          c36 -18 65 -35 65 -38z"/>
          <path d="M2782 228 c2 -93 6 -113 18 -113 12 0 16 20 18 113 3 107 2 112 -18
          112 -20 0 -21 -5 -18 -112z"/>
          <path d="M2981 278 l0 -63 110 -53 109 -53 200 101 200 100 100 -50 c93 -47
          120 -53 120 -30 0 13 -195 110 -220 110 -11 0 -61 -20 -110 -45 l-90 -45 -90
          45 c-49 25 -99 45 -110 45 -11 0 -56 -18 -100 -40 l-80 -40 0 40 c0 33 -3 40
          -20 40 -18 0 -20 -6 -19 -62z m294 -5 c41 -21 75 -40 75 -43 0 -3 -34 -22 -75
          -43 l-75 -37 -75 37 c-41 21 -75 40 -75 43 0 4 133 76 147 79 2 1 36 -16 78
          -36z"/>
          <path d="M4032 278 c2 -48 7 -63 18 -63 11 0 16 15 18 63 3 57 1 62 -18 62
          -19 0 -21 -5 -18 -62z"/>
          <path d="M4232 228 c2 -93 6 -113 18 -113 12 0 16 20 18 113 3 107 2 112 -18
          112 -20 0 -21 -5 -18 -112z"/>
          <path d="M4632 228 c2 -93 6 -113 18 -113 12 0 16 20 18 113 3 107 2 112 -18
          112 -20 0 -21 -5 -18 -112z"/>
          </g>
        </svg>
      </div>
    </main>
  )
}
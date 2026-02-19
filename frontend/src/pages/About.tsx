import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/About.css'
import secretSound from '../assets/secret.wav'

gsap.registerPlugin(ScrollTrigger)

// Tunic-inspired sacred cross / konami-style easter egg
const TUNIC_SEQUENCE = ['ArrowUp', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowRight']
const UNLOCK_SOUND = new Audio(secretSound);
UNLOCK_SOUND.volume = 0.4; 

export default function About() {
  const [tunicUnlocked, setTunicUnlocked] = useState(false)
  const [tunicPhase, setTunicPhase] = useState(0)
  const keyBuffer = useRef<string[]>([])
  const crossRef = useRef<SVGSVGElement>(null)
  const pageRef = useRef<HTMLElement>(null)

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
      UNLOCK_SOUND.currentTime = 0
      const playPromise = UNLOCK_SOUND.play()

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("The audio still locked, click somewhere else to try again", error)
        })
      }

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
      title: 'Game dev',
      desc: "Le développement de jeu est un processus long et parfois éprouvant, qui aboutis à des chefs d'oeuvres.",
      highlight: true,
    },
    {
      icon: '⚗️',
      title: 'Algo',
      desc: "Trouver des solutions à des problèmes plus ou moins complexes et avec différentes manières.",
      highlight: true,
    },
    {
      icon: '🎨',
      title: 'UI/Motion Design',
      desc: 'Donner vie aux interfaces. Faire que chaque pixel ait l\'intention d\'exister.',
      highlight: false,
    },
    {
      icon: '🔨',
      title: 'Architecture',
      desc: "Quelque chose que l'on apprend plus avec le temps et l'expérience qu'à l'école.",
      highlight: false,
    },
    {
      icon: '🔭',
      title: 'Sciences & IA',
      desc: "Chat GPT n'est pas une IA mais un LLM, pour moi les seuls vrais algos d'IA sont fait avec NEAT",
      highlight: false,
    },
    {
      icon: '🥊',
      title: 'Boxe',
      desc: 'Un peu de sport n\'a jamais tué qui que ce soit.',
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
            <div>Passionné.</div>
          </h1>
          <div className="about-paras">
            <p className="about-para">
              Etudiant en informatique, passionné par le développement qui mélange technique rigoureuse
              remise en question. Le code est en quelque sorte <span className='about-para-accent'>une partie de nous</span>.
            </p>
            <p className="about-para">
              Mon approche : comprendre avant de coder. Concevoir avant de construire.
              Chercher la moindre optimisation sans être certain.
            </p>
            <p className="about-para about-hint">
              <span className="hint-mono">// hint : le <span className='gold'>chemin</span> révèle les sercrets</span>
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
                <span className="gradient-text-gold">Tunic</span>
              <p className="tunic-msg-text">
                « Dans les ruines oubliées, le renard avance sans guide.<br />
                Il apprend la langue du monde en apprenant les glyphes.<br />
                <br />
                 Le jeu qui m'a appris que ne pas comprendre,<br />
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
          <h2 className="section-title">Ce que j'aime particulièrement</h2>
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
            { year: '2025', title: 'Dev confirmé', desc: 'Apprentissage de Rust et du web moderne et retour sur Unity !' },
            { year: '2024', title: 'Entrée en matière (89)', desc: 'Apprentissage du C et du web basique.' },
            { year: '2023', title: 'Passage sur Unity', desc: 'Découverte de ce qu\'est un moteur de jeu avec CoolMounatin.' },
            { year: '2022', title: 'Apprentissage Python', desc: 'Le début de l\'ascencion.' },
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
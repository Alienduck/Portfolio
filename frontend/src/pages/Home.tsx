import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Home.css'
import '../styles/CoursesSection.css'

gsap.registerPlugin(ScrollTrigger)

// ─── COURSES CAROUSEL DATA ────────────────────────────────────────────────────

const SLIDES = [
  {
    type: 'intro',
    tag: 'CONCEPT',
    title: 'Comment ça marche ?',
    body: "Les cours sont divisés en deux types de fiches : les **Prémices** pour comprendre les concepts en profondeur, et les **Projects** pour mettre les mains dans le code. Chacun avance à son propre rythme, sans notes, sans pression.",
    icon: '📖',
    color: '#a78bfa',
  },
  {
    type: 'premices',
    tag: 'PRÉMICES',
    title: 'Théorie & Concepts',
    body: "Des fiches explicatives rédigées en Markdown (Obsidian), détaillées et facilement lisibles. Parfaites pour apprendre un concept, se remémorer une notion ou chercher une info rapidement.",
    icon: '🧠',
    color: '#60a5fa',
  },
  {
    type: 'projects',
    tag: 'PROJECTS',
    title: 'Pratique & Code',
    body: "Des projets concrets à développer — simples au début, progressivement plus ambitieux. Certains projets servent de base pour les suivants. Des conseils sont fournis pour ne jamais rester bloqué.",
    icon: '⚙️',
    color: '#6366f1',
  },
  {
    type: 'ambiance',
    tag: 'AMBIANCE',
    title: 'Cours à la carte',
    body: "Pas de notes, pas de stress. Tu peux me poser des questions et m'envoyer ton code quand tu veux. Chaque élève adapte les cours à sa façon d'apprendre.",
    icon: '🎯',
    color: '#34d399',
  },
  {
    type: 'tarifs',
    tag: 'TARIFS',
    title: 'Accès illimité aux fiches',
    body: "**30€ / mois** ou **15€ / 2 semaines**. Une fois inscrit, tu gardes l'accès aux fiches à vie — même après la fin des cours.",
    icon: '💎',
    color: '#f4b942',
  },
]

function CoursesSection() {
  const [active, setActive] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragDeltaX = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number>(null)

  // Auto-advance
  useEffect(() => {
    if (isDragging) return
    timerRef.current = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 15000)
    return () => clearInterval(timerRef.current as number)
  }, [isDragging])

  // GSAP slide animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.courses-slide-inner', {
        opacity: 0,
        y: 24,
        duration: 0.45,
        ease: 'power2.out',
      })
    }, trackRef)
    return () => ctx.revert()
  }, [active])

  // Entry animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.courses-section-header', { opacity: 0, y: 40, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true }
      })
      gsap.from('.courses-carousel-wrap', { opacity: 0, y: 50, duration: 0.8, delay: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
      })
      gsap.from('.courses-join-cta', { opacity: 0, y: 30, duration: 0.7, delay: 0.4, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Touch/mouse drag
  const onDragStart = (clientX: number) => {
    setIsDragging(true)
    dragStartX.current = clientX
    dragDeltaX.current = 0
  }
  const onDragMove = (clientX: number) => {
    if (!isDragging) return
    dragDeltaX.current = clientX - dragStartX.current
  }
  const onDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const delta = dragDeltaX.current
    if (Math.abs(delta) > 50) {
      clearInterval(timerRef.current as number)
      if (delta < 0) setActive(a => (a + 1) % SLIDES.length)
      else setActive(a => (a - 1 + SLIDES.length) % SLIDES.length)
    }
    dragDeltaX.current = 0
  }

  const slide = SLIDES[active]

  return (
    <section ref={sectionRef} className="courses-section">
      {/* Header */}
      <div className="courses-section-header">
        <span className="section-tag">ROBLOX STUDIO</span>
        <h2 className="section-title">
          Rejoignez nos <span className="gradient-text">futurs devs</span>
        </h2>
        <p className="courses-section-sub">
          J'enseigne le scripting Luau sur Roblox Studio — de zéro à des projets ambitieux. Les cours s'adaptent à chacun.
        </p>
      </div>

      {/* Carousel */}
      <div className="courses-carousel-wrap">
        {/* Slide track */}
        <div
          ref={trackRef}
          className="courses-track"
          onMouseDown={e => onDragStart(e.clientX)}
          onMouseMove={e => onDragMove(e.clientX)}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onTouchStart={e => onDragStart(e.touches[0].clientX)}
          onTouchMove={e => onDragMove(e.touches[0].clientX)}
          onTouchEnd={onDragEnd}
          style={{ '--slide-color': slide.color } as React.CSSProperties}
        >
          <div className="courses-slide-inner">
            <div className="courses-slide-icon">{slide.icon}</div>
            <span className="courses-slide-tag" style={{ color: slide.color }}>{slide.tag}</span>
            <h3 className="courses-slide-title">{slide.title}</h3>
            <p className="courses-slide-body" dangerouslySetInnerHTML={{ __html: slide.body.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          </div>

          {/* Decorative glow */}
          <div className="courses-slide-glow" style={{ background: `radial-gradient(circle at 80% 20%, ${slide.color}22, transparent 60%)` }} />
          <div className="courses-slide-line" style={{ background: `linear-gradient(90deg, transparent, ${slide.color}, transparent)` }} />
        </div>

        {/* Desktop arrows (absolute) */}
        <button className="courses-arrow courses-arrow-prev courses-arrow-desktop" onClick={() => setActive(a => (a - 1 + SLIDES.length) % SLIDES.length)} aria-label="Précédent">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="courses-arrow courses-arrow-next courses-arrow-desktop" onClick={() => setActive(a => (a + 1) % SLIDES.length)} aria-label="Suivant">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dots + mobile arrows row */}
        <div className="courses-nav-row">
          <button className="courses-arrow courses-arrow-mobile" onClick={() => setActive(a => (a - 1 + SLIDES.length) % SLIDES.length)} aria-label="Précédent">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="courses-dots">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                className={`courses-dot ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                style={{ '--dot-color': s.color } as React.CSSProperties}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button className="courses-arrow courses-arrow-mobile" onClick={() => setActive(a => (a + 1) % SLIDES.length)} aria-label="Suivant">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Counter */}
        <div className="courses-counter">
          <span className="courses-counter-cur">{String(active + 1).padStart(2, '0')}</span>
          <span className="courses-counter-sep"> / </span>
          <span className="courses-counter-tot">{String(SLIDES.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="courses-join-cta">
        <a href="mailto:oneuillyr@gmail.com" className="btn-primary btn-large">
          <span>Rejoindre les cours</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <p className="courses-cta-note">30€ / mois · 15€ / 2 semaines · Fiches à vie 🎓</p>
      </div>
      {/* <Link to="/courses" className='courses-link btn-secondary'>Plus d'informations</Link> */}
    </section>
  )
}

// ─── MAIN HOME ────────────────────────────────────────────────────────────────

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-tag', { opacity: 0, x: -30 })
      gsap.set('.hero-title-line', { clipPath: 'inset(0 100% 0 0)' })
      gsap.set('.hero-cta', { opacity: 0, y: 20 })
      gsap.set('.hero-scroll-hint', { opacity: 0 })
      gsap.set('.hero-badge', { scale: 0, opacity: 0 })
      gsap.set('.floating-chip', { opacity: 0, y: 30 })

      const tl = gsap.timeline({ delay: 0.2 })
      tl
        .to('.hero-tag', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
        .to('.hero-title-line', {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.15
        }, '-=0.2')
        .to('.hero-cta', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .to('.hero-badge', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.1 }, '-=0.3')
        .to('.floating-chip', { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.3')
        .to('.hero-scroll-hint', { opacity: 1, duration: 0.5 }, '-=0.1')

      if (svgRef.current) {
        const paths = svgRef.current.querySelectorAll('.svg-path')
        paths.forEach((path) => {
          const el = path as SVGPathElement
          const len = el.getTotalLength ? el.getTotalLength() : 500
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(el, {
            strokeDashoffset: 0,
            duration: 3,
            delay: 0.5 + Math.random(),
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
          })
        })
      }

      gsap.to(orbRef.current, {
        y: '-=30',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      gsap.to('.hero-orb-wrap', {
        y: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      })

      gsap.to('.hero-title-wrap', {
        y: 100,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      })

      const chips = document.querySelectorAll('.floating-chip')
      chips.forEach((chip, i) => {
        gsap.to(chip, {
          y: `${Math.sin(i) * 15}px`,
          x: `${Math.cos(i) * 8}px`,
          duration: 2.5 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      gsap.from('.stat-item', {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      })

      gsap.from('.skill-card', {
        y: 80,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.skills-section',
          start: 'top 75%',
        }
      })

    }, heroRef)

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 30
      const y = (clientY / window.innerHeight - 0.5) * 30
      gsap.to('.hero-orb-wrap', { x, y: `+=${y * 0.3}`, duration: 1, ease: 'power2.out' })
      gsap.to('.svg-deco', { x: -x * 0.5, y: -y * 0.5, duration: 1.5, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <main className="page">
      {/* HERO */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-orb-wrap">
          <div ref={orbRef} className="hero-orb">
            <div className="hero-orb-inner" />
            <div className="hero-orb-ring" />
            <div className="hero-orb-ring hero-orb-ring-2" />
          </div>
        </div>

        <svg ref={svgRef} className="svg-deco" viewBox="0 0 800 600" fill="none" preserveAspectRatio="xMidYMid slice">
          <path className="svg-path" d="M 50 300 Q 200 100 400 300 T 750 300" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
          <path className="svg-path" d="M 100 200 Q 300 50 500 250 T 780 180" stroke="rgba(124,58,237,0.25)" strokeWidth="1" />
          <path className="svg-path" d="M 0 400 Q 200 600 400 400 Q 600 200 800 400" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" />
          <circle className="svg-path" cx="650" cy="150" r="80" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
          <polygon className="svg-path" points="150,450 200,370 250,450" stroke="rgba(124,58,237,0.2)" strokeWidth="1" fill="none" />
        </svg>

        <div className="hero-content hero-title-wrap">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            <span>Available NOW</span>
          </div>

          <h1 className="hero-title">
            <div className="hero-title-line">
              <span className="gradient-text">CRÉER</span>
            </div>
            <div className="hero-title-line">L'EXPÉRIENCE</div>
            <div className="hero-title-line">
              <span>DU </span>
              <span className="gradient-text">FUTUR</span>
            </div>
          </h1>

          <div className="hero-badges">
            {['React', 'TypeScript', 'Luau', 'Rust', 'C#'].map(b => (
              <span key={b} className="hero-badge glow">{b}</span>
            ))}
          </div>

          <div className="hero-cta">
            <Link to="/projects" className="btn-primary">
              <span>Voir mes projets</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/about" className="btn-ghost">Me découvrir</Link>
          </div>
        </div>

        <div className="floating-chips">
          {['git', 'docker', 'linux', 'api', 'sql', 'css'].map((chip, i) => (
            <div key={chip} className="floating-chip" style={{ '--idx': i } as React.CSSProperties}>
              {chip}
            </div>
          ))}
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span className='glow'>SCROLL</span>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { num: '10+', label: 'Projets réalisés' },
            { num: '3+', label: 'Années d\'expérience' },
            { num: '∞', label: 'Intérêt pour le code' },
            { num: '🦊', label: "01010100 01010101 01001110 01001001 01000011" },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-num gradient-text">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="skills-section">
        <div className="section-header">
          <span className="section-tag">COMPÉTENCES</span>
          <h2 className="section-title">Stack & Technologies</h2>
        </div>
        <div className="skills-grid">
          {[
            { name: 'Frontend', techs: ['React', 'TypeScript', 'Axios', 'GSAP'], icon: '⬡' },
            { name: 'Backend', techs: ['Node.js', 'Express', 'Python', 'FastAPI', 'PostgreSQL'], icon: '⬡' },
            { name: 'Roblox Studio', techs: ['Studio', 'Luau', 'TypeScript', 'Rojo', 'Wally'], icon: '⬡' },
            { name: 'Unity', techs: ['C#', 'Git', 'Piskel', 'Blender', 'FL Studio'], icon: '⬡' },
          ].map(cat => (
            <div key={cat.name} className="skill-card">
              <div className="skill-card-header">
                <span className="skill-icon gradient-text">{cat.icon}</span>
                <h3>{cat.name}</h3>
              </div>
              <div className="skill-tags">
                {cat.techs.map(t => <span key={t} className="skill-tag glow">{t}</span>)}
              </div>
              <div className="skill-card-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* COURSES SECTION */}
      <CoursesSection />
    </main>
  )
}
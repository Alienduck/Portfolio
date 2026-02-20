import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Home.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
//   const titleRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation
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

      // SVG path animations
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

      // Orb floating
      gsap.to(orbRef.current, {
        y: '-=30',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Parallax on scroll
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

      // Floating chips orbit
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

      // Stats section entrance
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

      // Skills entrance
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

    // Mouse parallax
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

        {/* Floating tech chips */}
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

      {/* CTA FOOTER */}
      <section className="home-cta-section">
        <div className="home-cta-content">
          <p className="home-cta-label">PRÊT À COLLABORER ?</p>
          <h2>Travaillons <span className="gradient-text">ensemble</span></h2>
          <a href="mailto:contact@example.com" className="btn-primary btn-large">
            <span>Me contacter</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  )
}
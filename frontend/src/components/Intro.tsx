import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import '../styles/Intro.css'

interface IntroProps {
  onComplete: () => void
}

export default function Intro({ onComplete }: IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete })

      // Initial state
      gsap.set('.intro-line', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.intro-letter', { y: 120, opacity: 0 })
      gsap.set('.intro-sub', { opacity: 0, y: 20 })
      gsap.set('.intro-progress', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.hex-path', { strokeDashoffset: 600, opacity: 0 })
      gsap.set('.intro-dot', { scale: 0, opacity: 0 })
      gsap.set('.intro-glitch', { opacity: 0 })

      tl
        // Lines appear
        .to('.intro-line', { scaleX: 1, duration: 0.6, ease: 'expo.out', stagger: 0.1 })
        // Dots
        .to('.intro-dot', { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(2)' }, '-=0.3')
        // SVG hex trace
        .to('.hex-path', { strokeDashoffset: 0, opacity: 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.2')
        // Name letters
        .to('.intro-letter', {
          y: 0, opacity: 1,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.05
        }, '-=0.4')
        // Glitch flicker
        .to('.intro-glitch', { opacity: 1, duration: 0.05 })
        .to('.intro-glitch', { opacity: 0, duration: 0.05 })
        .to('.intro-glitch', { opacity: 1, duration: 0.05 })
        .to('.intro-glitch', { opacity: 0, duration: 0.1 })
        // Subtitle
        .to('.intro-sub', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        // Progress bar
        .to('.intro-progress', { scaleX: 1, duration: 0.8, ease: 'power2.inOut' })
        // Hold then exit
        .to(containerRef.current, { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.3')

    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  const letters = 'PORTFOLIO'.split('')

  return (
    <div ref={containerRef} className="intro-container">
      <div className="intro-bg-grid" />

      <div className="intro-lines">
        <div className="intro-line intro-line-top" />
        <div className="intro-line intro-line-bottom" />
      </div>

      <div className="intro-dots">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="intro-dot" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>

      <div className="intro-center">
        <svg ref={svgRef} className="intro-hex-svg" viewBox="0 0 200 200" fill="none">
          <polygon
            className="hex-path"
            points="100,10 182,55 182,145 100,190 18,145 18,55"
            stroke="url(#hexGrad)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="600"
            strokeDashoffset="600"
          />
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>

        <div className="intro-name">
          {letters.map((l, i) => (
            <span key={i} className="intro-letter">{l}</span>
          ))}
          <div className="intro-glitch">
            {letters.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>

        <div className="intro-sub">
          <span className="intro-sub-line">
            <span className="intro-sub-mono">_</span>
            ÉTUDIANT DÉVELOPPEUR
            <span className="intro-sub-mono">_</span>
          </span>
        </div>
      </div>

      <div className="intro-progress-track">
        <div className="intro-progress" />
      </div>

      <div className="intro-corner intro-corner-tl">00</div>
      <div className="intro-corner intro-corner-tr">2025</div>
    </div>
  )
}
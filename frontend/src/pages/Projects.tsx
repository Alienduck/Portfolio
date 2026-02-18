import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Projects.css'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 1,
    name: 'BrawlStarsAPI',
    desc: 'Application ayant pour but d\'apprendre React Frontend & Backend avec une API perso et une API externe.',
    tags: ['React', 'JS', 'Axios', 'MangoDB'],
    url: 'https://brawlstarsapi-1.onrender.com',
    year: '2026',
    status: 'Live',
    color: '#3b82f6',
  },
  {
    id: 2,
    name: 'Orengine',
    desc: 'Moteur graphique orienté GPU compatible Vulkan & Open GL fais uniquement en Rust.',
    tags: ['Rust', 'Cargo', 'Git', 'Vulkan', 'OpenGL'],
    url: 'https://github.com/Alienduck/Orengine',
    year: '2025-2026',
    status: 'WIP',
    color: '#edcc3a',
  },
  {
    id: 3,
    name: 'NEAT_mod',
    desc: 'Un module basé sur NEAT, un algorithme puissant d\'apprentissage neuronal par renforcement.',
    tags: ['Luau', 'Rojo', 'Wally', 'Git'],
    url: 'https://github.com/Alienduck/NEAT_mod',
    year: '2025',
    status: 'Complete',
    color: '#6366f1',
  },
  {
    id: 4,
    name: 'CinematicMaker',
    desc: 'Plugin pour Roblox Studio pour simplifier la création de cinématiques en jeu et en dehors.',
    tags: ['Luau', 'Roblox Studio', 'Roact', 'Wally', 'Rojo'],
    url: 'https://create.roblox.com/store/asset/135812529565935',
    year: '2025',
    status: 'Complete',
    color: '#8b5cf6',
  },
  {
    id: 5,
    name: 'GarbageItem',
    desc: 'Module de mise en cache de models afin d\'optimiser en jeu des ressources.',
    tags: ['Luau', 'Rojo', 'Wally', 'Git'],
    url: 'https://github.com/Alienduck/GarbageItem',
    year: '2025',
    status: 'Complete',
    color: '#2563eb',
  },
  {
    id: 6,
    name: 'BrawlBot',
    desc: 'Bot discord pour le jeu Brawl Stars ayant acumulé plus de 100 serveurs (max). Actuelle out',
    tags: ['Discord.api', 'Python', 'BeautifulSoup', 'request'],
    url: 'https://top.gg/bot/1131679227847135282',
    year: '2024',
    status: 'Complete',
    color: '#4f46e5',
  },
]

type Filter = 'All' | 'WIP' | 'Complete' | 'Live'

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All')
  const [_hovered, setHovered] = useState<number | null>(null)
  const pageRef = useRef<HTMLElement>(null)

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.status === filter)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.projects-header-content', { opacity: 0, y: 40 })
      gsap.to('.projects-header-content', { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    gsap.from('.project-card', {
      opacity: 0,
      y: 40,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
    })
  }, [filter])

  return (
    <main ref={pageRef} className="page projects-page">
      <section className="projects-hero">
        <div className="projects-header-content">
          <span className="section-tag">GITHUB</span>
          <h1 className="projects-title">
            <span>Mes </span>
            <span className="gradient-text">Projets</span>
          </h1>
          <p className="projects-subtitle">
            Une sélection de projets personnels et expérimentaux. Du code, des idées, des systèmes.
          </p>
        </div>

        <div className="projects-filters">
          {(['All', 'Live', 'Complete', 'WIP'] as Filter[]).map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="projects-grid-section">
        <div className="projects-grid">
          {filtered.map((project, _i) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ '--card-color': project.color } as React.CSSProperties}
            >
              <div className="project-card-top">
                <div className="project-meta">
                  <span className="project-year">{project.year}</span>
                  <span className={`project-status status-${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
                <div className="project-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 14L14 4M14 4H7M14 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="project-card-body">
                <h2 className="project-name">{project.name}</h2>
                <p className="project-desc">{project.desc}</p>
              </div>

              <div className="project-card-footer">
                <div className="project-tags">
                  {project.tags.map(t => (
                    <span key={t} className="project-tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="project-card-glow" />
              <div className="project-card-line" />
            </a>
          ))}
        </div>
      </section>

      <section className="projects-github-cta">
        <div className="github-cta-inner">
          <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          <div>
            <h3>Plus de projets sur GitHub</h3>
            <p>Retrouvez l'ensemble de mon code source et mes expérimentations.</p>
          </div>
          <a href="https://github.com/Alienduck" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <span>Voir le profil</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  )
}
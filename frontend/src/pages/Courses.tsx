import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/Courses.css'

gsap.registerPlugin(ScrollTrigger)

// ─── SHEET PREVIEW DATA ────────────────────────────────────────────────────────

const SHEET_TYPES = [
  {
    id: 'preambule',
    tag: 'PRÉAMBULE',
    icon: '🛠️',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    title: 'Installation & Outils',
    desc: 'Mise en place de l\'environnement de développement professionnel. Git, terminal, Rokit, Rojo, Wally — tout ce qu\'il faut pour démarrer.',
    preview: [
      { type: 'h2', text: '1. La "Triforce" du Développement' },
      { type: 'table', text: 'Rokit · Rojo · Wally' },
      { type: 'p', text: 'Pour développer professionnellement sur Roblox, nous utilisons trois piliers fondamentaux...' },
      { type: 'code', text: 'rokit init\nrokit install' },
      { type: 'h2', text: '2. Rokit (Le Chef d\'Orchestre)' },
      { type: 'p', text: 'Rokit est indispensable car il assure que tout le monde dans l\'équipe utilise exactement les mêmes versions...' },
      { type: 'tip', text: 'Sans Rokit, si vous mettez à jour Rojo mais pas votre collègue, tout casse.' },
    ],
  },
  {
    id: 'premices',
    tag: 'PRÉMICES',
    icon: '🧠',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    title: 'Humanoid',
    desc: 'Comprendre en profondeur l\'objet Humanoid de Roblox — vie, mouvement, états, animations, sécurité réseau.',
    preview: [
      { type: 'h2', text: '1. Définition' },
      { type: 'p', text: 'Le `Humanoid` est un objet spécial qui donne "vie" à un `Model`. Sans lui, un personnage n\'est qu\'un tas de briques...' },
      { type: 'table', text: 'Health · MaxHealth · WalkSpeed · JumpHeight' },
      { type: 'tip', text: 'Utilisez :TakeDamage(10) plutôt que Health -= 10 pour respecter les ForceFields.' },
      { type: 'h2', text: '2. Gestion des États' },
      { type: 'code', text: 'humanoid:SetStateEnabled(\n  Enum.HumanoidStateType.Jumping, false\n)' },
      { type: 'p', text: 'Running · Jumping · Freefall · Seated · Dead · Physics...' },
    ],
  },
  {
    id: 'projet',
    tag: 'PROJET',
    icon: '⚙️',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #34d399, #059669)',
    title: 'Système de Sprint',
    desc: 'Créer un système de sprint complet avec gestion d\'endurance et effet visuel sur le FOV de la caméra.',
    preview: [
      { type: 'info', text: 'Créer un système de Sprint avec gestion d\'endurance limitée.' },
      { type: 'h2', text: 'Étape 1 : Architecture' },
      { type: 'p', text: 'Nous allons travailler dans un LocalScript. Pourquoi ? Car la gestion des touches et de la Caméra est réservée au Client...' },
      { type: 'code', text: 'local RUN_SPEED = 24\nlocal WALK_SPEED = 16\nlocal MAX_STAMINA = 100' },
      { type: 'h2', text: 'Étape 2 : Les Services' },
      { type: 'p', text: 'Récupérez les services nécessaires et le Humanoid de manière sûre depuis un LocalScript...' },
      { type: 'code', text: 'local humanoid = character\n  :WaitForChild("Humanoid")' },
    ],
  },
]

const PACKS = [
  {
    name: 'Découverte',
    price: '15€',
    period: '/ 2 semaines',
    color: '#60a5fa',
    features: ['Accès à toutes les fiches', 'Support par message', 'Corrections de code', 'Fiches à vie 🎓'],
    cta: 'Commencer',
    highlight: false,
  },
  {
    name: 'Apprenti',
    price: '30€',
    period: '/ mois',
    color: '#a78bfa',
    features: ['Tout de Découverte', 'Appels vocaux illimités', 'Accès serveur Discord privé', 'Projets corrigés & notés', 'Fiches à vie 🎓'],
    cta: 'Rejoindre',
    highlight: true,
  },
]

const FAQ = [
  {
    q: 'Quel niveau faut-il pour commencer ?',
    a: 'Zéro requis. Les fiches Préambule couvrent l\'installation complète et les fiches Prémices partent des bases. Si tu sais ce qu\'est une variable, tu peux démarrer.',
  },
  {
    q: 'Comment se déroule concrètement un cours ?',
    a: 'Tu reçois les fiches, tu travailles à ton rythme. Tu m\'envoies tes questions par message ou on se retrouve en vocal. Quand tu termines un projet, tu me l\'envoies et je te donne un retour détaillé avec des pistes d\'amélioration.',
  },
  {
    q: 'C\'est quoi le Discord privé ?',
    a: 'Un serveur réservé aux apprentis actifs. Tu peux échanger avec les autres élèves, poser des questions, montrer tes avancées, et participer aux éventuels défis et compétitions.',
  },
  {
    q: 'Les compétitions, c\'est quoi exactement ?',
    a: 'Si on atteint assez d\'élèves, j\'organiserai des game jams internes : créer un jeu en temps limité, parfois entre élèves, parfois contre moi. Pur fun et apprentissage accéléré.',
  },
  {
    q: 'Est-ce que je garde les fiches si j\'arrête ?',
    a: 'Oui. Toutes les fiches auxquelles tu as eu accès pendant ton abonnement restent tiennes à vie. Tu pourras toujours t\'y référer.',
  },
  {
    q: 'Quels outils faut-il installer ?',
    a: 'Roblox Studio (gratuit), VSCode (gratuit), et les outils gérés par Rokit : Rojo et Wally. La fiche Préambule guide l\'installation pas à pas.',
  },
]

// ─── SHEET PREVIEW COMPONENT ───────────────────────────────────────────────────

function SheetPreview({ sheet }: { sheet: typeof SHEET_TYPES[0] }) {
  return (
    <div className="sheet-preview" style={{ '--sheet-color': sheet.color, '--sheet-gradient': sheet.gradient, opacity: 0 } as React.CSSProperties}>
      <div className="sheet-preview-header">
        <div className="sheet-preview-bar" />
        <div className="sheet-preview-meta">
          <span className="sheet-preview-tag" style={{ color: sheet.color }}>{sheet.tag}</span>
          <div className="sheet-preview-dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="sheet-preview-title-row">
          <span className="sheet-preview-icon">{sheet.icon}</span>
          <h4 className="sheet-preview-title">{sheet.title}</h4>
        </div>
      </div>

      <div className="sheet-preview-body">
        {sheet.preview.map((line, i) => (
          <div
            key={i}
            className={`sheet-line sheet-line-${line.type}`}
            style={{ '--line-delay': `${i * 0.06}s` } as React.CSSProperties}
          >
            {line.type === 'h2' && <span className="sl-h2">{line.text}</span>}
            {line.type === 'p' && <span className="sl-p">{line.text}</span>}
            {line.type === 'code' && (
              <pre className="sl-code">{line.text}</pre>
            )}
            {line.type === 'table' && (
              <div className="sl-table">
                {line.text.split(' · ').map((cell, ci) => (
                  <span key={ci} className="sl-table-cell">{cell}</span>
                ))}
              </div>
            )}
            {(line.type === 'tip' || line.type === 'info') && (
              <div className={`sl-callout sl-callout-${line.type}`}>
                <span className="sl-callout-icon">{line.type === 'tip' ? '💡' : 'ℹ️'}</span>
                <span>{line.text}</span>
              </div>
            )}
          </div>
        ))}

        {/* Fade + lock overlay */}
        <div className="sheet-fade-overlay">
          <div className="sheet-lock">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>Réservé aux apprentis</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ITEM ────────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' })
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' })
    }
  }, [open])

  return (
    <div className={`faq-item ${open ? 'open' : ''}`} style={{ '--faq-delay': `${index * 0.07}s` } as React.CSSProperties}>
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="faq-q-text">{q}</span>
        <svg className="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div ref={bodyRef} className="faq-answer" style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <p>{a}</p>
      </div>
    </div>
  )
}

// ─── MAIN COURSES PAGE ────────────────────────────────────────────────────────

export default function Courses() {
  const [activeSheet, setActiveSheet] = useState(0)
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      gsap.set('.courses-hero-tag', { opacity: 0, x: -30 })
      gsap.set('.courses-hero-title-line', { clipPath: 'inset(0 100% 0 0)' })
      gsap.set('.courses-hero-sub', { opacity: 0, y: 20 })
      gsap.set('.courses-hero-badges', { opacity: 0, y: 15 })

      const tl = gsap.timeline({ delay: 0.2 })
      tl.to('.courses-hero-tag', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
        .to('.courses-hero-title-line', { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.out', stagger: 0.12 }, '-=0.3')
        .to('.courses-hero-sub', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .to('.courses-hero-badges', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')

      // How it works
      gsap.from('.how-step', {
        y: 50, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.how-section', start: 'top 80%', once: true }
      })

      // Sheet tabs
      gsap.from('.sheet-tab', {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.sheets-section', start: 'top 80%', once: true }
      })

      // Packs
      gsap.from('.pack-card', {
        y: 60, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.packs-section', start: 'top 80%', once: true }
      })

      // Discord band
      gsap.from('.discord-band-inner', {
        y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.discord-band', start: 'top 85%', once: true }
      })

      // FAQ
      gsap.from('.faq-item', {
        y: 30, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.faq-section', start: 'top 80%', once: true }
      })

      // Final CTA
      gsap.from('.final-cta-inner', {
        scale: 0.95, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.final-cta', start: 'top 85%', once: true }
      })

    }, pageRef)
    return () => ctx.revert()
  }, [])

  // Re-animate preview on tab change
  useEffect(() => {
    gsap.from('.sheet-preview', {
      opacity: 1, x: 20, duration: 0.4, ease: 'linear'
    })
  }, [activeSheet])

  return (
    <main ref={pageRef} className="page courses-page">

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="courses-hero-section">
        <div className="courses-hero-bg-grid" />

        {/* Decorative orb */}
        <div className="courses-hero-orb">
          <div className="courses-hero-orb-inner" />
          <div className="courses-hero-orb-ring" />
          <div className="courses-hero-orb-ring courses-hero-orb-ring-2" />
        </div>

        <div className="courses-hero-content">
          <div className="courses-hero-tag">
            <span className="courses-hero-tag-dot" />
            <span>ROBLOX STUDIO · LUAU SCRIPTING</span>
          </div>

          <h1 className="courses-hero-title">
            <div className="courses-hero-title-line">APPRENDRE</div>
            <div className="courses-hero-title-line">
              <span className="gradient-text">À CRÉER</span>
            </div>
            <div className="courses-hero-title-line">DES JEUX</div>
          </h1>

          <p className="courses-hero-sub">
            Des cours de scripting Luau sur Roblox Studio. Fiches détaillées, projets concrets,
            feedback personnalisé — à ton rythme, sans pression.
          </p>

          <div className="courses-hero-badges">
            {['Luau', 'Rojo', 'Wally', 'OOP', 'Git', 'Roblox Studio'].map(b => (
              <span key={b} className="courses-hero-badge glow">{b}</span>
            ))}
          </div>

          <div className="courses-hero-cta">
            <a href="mailto:oneuillyr@gmail.com" className="btn-primary btn-large">
              <span>Rejoindre les cours</span>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="courses-hero-note">30€ / mois · 15€ / 2 semaines</span>
          </div>
        </div>

        {/* Corner labels */}
        <div className="courses-corner courses-corner-tl">COURS</div>
        <div className="courses-corner courses-corner-tr">LUAU</div>
        <div className="courses-hero-scanline" />
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════════════ */}
      <section className="how-section">
        <div className="how-header">
          <span className="section-tag">FONCTIONNEMENT</span>
          <h2 className="section-title">Comment ça marche ?</h2>
        </div>

        <div className="how-steps">
          {[
            {
              num: '01',
              icon: '💳',
              title: 'Tu t\'inscris',
              desc: 'Tu me contactes par mail, on se met d\'accord sur la formule. Tu règles et reçois immédiatement l\'accès aux fiches.',
              color: '#60a5fa',
            },
            {
              num: '02',
              icon: '📖',
              title: 'Tu apprends',
              desc: 'Tu travailles sur les fiches à ton rythme. Préambule pour l\'environnement, Prémices pour les concepts, Projets pour pratiquer.',
              color: '#a78bfa',
            },
            {
              num: '03',
              icon: '💬',
              title: 'Tu demandes',
              desc: 'Bloqué ? Tu m\'envoies un message ou on se retrouve en vocal. Chaque question mérite une réponse détaillée.',
              color: '#818cf8',
            },
            {
              num: '04',
              icon: '🏆',
              title: 'Tu progresses',
              desc: 'Tu m\'envoies tes projets, je corrige et donne des pistes d\'amélioration. Tu gardes l\'accès aux fiches à vie.',
              color: '#34d399',
            },
          ].map((step, i) => (
            <div key={i} className="how-step" style={{ '--step-color': step.color } as React.CSSProperties}>
              <div className="how-step-num">{step.num}</div>
              <div className="how-step-icon">{step.icon}</div>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-desc">{step.desc}</p>
              <div className="how-step-glow" />
              {i < 3 && <div className="how-step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SHEET TYPES ═════════════════════════════════════════════════ */}
      <section className="sheets-section">
        <div className="sheets-header">
          <span className="section-tag">LES FICHES</span>
          <h2 className="section-title">
            Trois types de <span className="gradient-text">contenus</span>
          </h2>
          <p className="sheets-sub">
            Chaque fiche est rédigée en Markdown avec <a href='https://obsidian.md/download' style={{ color: 'rgba(200, 0, 200, 1)', textDecoration: 'underline currentColor'}}>Obsidian</a>, structurée et lisible.
            Les projets sont libres — tu codes comme tu veux, je guide quand tu bloques.
          </p>
        </div>

        <div className="sheets-layout">
          {/* Tabs */}
          <div className="sheets-tabs">
            {SHEET_TYPES.map((sheet, i) => (
              <button
                key={sheet.id}
                className={`sheet-tab ${activeSheet === i ? 'active' : ''}`}
                onClick={() => setActiveSheet(i)}
                style={{ '--tab-color': sheet.color } as React.CSSProperties}
              >
                <span className="sheet-tab-icon">{sheet.icon}</span>
                <div className="sheet-tab-content">
                  <span className="sheet-tab-tag">{sheet.tag}</span>
                  <span className="sheet-tab-title">{sheet.title}</span>
                  <span className="sheet-tab-desc">{sheet.desc}</span>
                </div>
                <div className="sheet-tab-indicator" />
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="sheets-preview-wrap">
            <SheetPreview sheet={SHEET_TYPES[activeSheet]} />
          </div>
        </div>
      </section>

      {/* ═══ DISCORD BAND ════════════════════════════════════════════════ */}
      <section className="discord-band">
        <div className="discord-band-inner">
          <div className="discord-band-left">
            <svg className="discord-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.081.12 18.1.144 18.116c2.054 1.49 4.046 2.395 6.004 2.993a.077.077 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028c1.97-.6 3.961-1.506 6.015-2.993a.077.077 0 0 0 .032-.027c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            <div>
              <h3>Serveur Discord privé</h3>
              <p>Accessible dès ton inscription. Un espace réservé aux apprentis pour s'entraider, partager ses projets et participer aux futurs défis.</p>
            </div>
          </div>
          <div className="discord-band-features">
            {['Entraide entre élèves', 'Questions & réponses', 'Compétitions futures', 'Partage de projets'].map(f => (
              <div key={f} className="discord-feature">
                <span className="discord-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPETITIONS TEASER ════════════════════════════════════════ */}
      <section className="competitions-section">
        <div className="competitions-inner">
          <div className="competitions-badge">BIENTÔT</div>
          <h2 className="section-title">
            Compétitions & <span className="gradient-text">Game Jams</span>
          </h2>
          <p className="competitions-desc">
            Quand la communauté grandira, j'organiserai des défis internes — créer un jeu en temps limité,
            élèves contre élèves, ou même contre moi. Le meilleur apprentissage passe par la pratique sous pression.
          </p>
          <div className="competitions-cards">
            {[
              { icon: '⚔️', title: 'Élèves vs Élèves', desc: 'Deux équipes, un thème, un délai. Qui crée le meilleur jeu ?' },
              { icon: '🎯', title: 'Élèves vs Moi', desc: 'Tu penses être prêt ? Affronte le prof sur son propre terrain.' },
              { icon: '⏱️', title: 'Speed Run', desc: 'Le plus petit jeu fonctionnel en 2 heures. Simplicité et créativité.' },
            ].map((c, i) => (
              <div key={i} className="competition-card">
                <span className="competition-icon">{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
                <div className="competition-glow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PACKS ════════════════════════════════════════════════════════ */}
      <section className="packs-section">
        <div className="packs-header">
          <span className="section-tag">TARIFS</span>
          <h2 className="section-title">Choisir sa formule</h2>
          <p className="packs-sub">
            Dans tous les cas, les fiches consultées restent à toi à vie.
          </p>
        </div>

        <div className="packs-grid">
          {PACKS.map((pack, i) => (
            <div
              key={i}
              className={`pack-card ${pack.highlight ? 'pack-highlight' : ''}`}
              style={{ '--pack-color': pack.color } as React.CSSProperties}
            >
              {pack.highlight && <div className="pack-popular">POPULAIRE</div>}
              <div className="pack-header">
                <h3 className="pack-name">{pack.name}</h3>
                <div className="pack-price-wrap">
                  <span className="pack-price" style={{ color: pack.color }}>{pack.price}</span>
                  <span className="pack-period">{pack.period}</span>
                </div>
              </div>
              <ul className="pack-features">
                {pack.features.map((f, fi) => (
                  <li key={fi}>
                    <span className="pack-check" style={{ color: pack.color }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:oneuillyr@gmail.com" className={`pack-cta ${pack.highlight ? 'pack-cta-primary' : 'pack-cta-ghost'}`} style={{ '--pack-color': pack.color } as React.CSSProperties}>
                <span>{pack.cta}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="pack-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════════════════ */}
      <section className="faq-section">
        <div className="faq-header">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title">Questions fréquentes</h2>
        </div>
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ════════════════════════════════════════════════════ */}
      <section className="final-cta">
        <div className="final-cta-inner">
          <div className="final-cta-glow-l" />
          <div className="final-cta-glow-r" />
          <div className="final-cta-grid" />
          <span className="section-tag">PRÊT ?</span>
          <h2 className="final-cta-title">
            Commence à <span className="gradient-text">créer</span> aujourd'hui
          </h2>
          <p className="final-cta-sub">
            Un mail suffit. On se met d'accord, tu accèdes aux fiches et on démarre.
          </p>
          <a href="mailto:oneuillyr@gmail.com" className="btn-primary btn-large">
            <span>Envoyer un mail</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="final-cta-scanline" />
        </div>
      </section>

    </main>
  )
}
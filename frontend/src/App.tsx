import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Intro from './components/Intro'
import Nav from './components/Nav'
import AmbientBackground from './components/AmbientBackground'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'

gsap.registerPlugin(ScrollTrigger)

function AppContent() {
  const [introComplete, setIntroComplete] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    document.body.classList.add('loading')
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = cursorRingRef.current
    if (!cursor || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.01 })
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.5
      ringY += (mouseY - ringY) * 0.5
      gsap.set(ring, { x: ringX, y: ringY })
      requestAnimationFrame(animate)
    }

    const onEnter = () => {
      gsap.to(cursor, { scale: 2.5, background: 'var(--blue-bright)', duration: 0.2 })
      gsap.to(ring, { scale: 1.5, borderColor: 'var(--blue-bright)', duration: 0.2 })
    }
    const onLeave = () => {
      gsap.to(cursor, { scale: 1, background: 'var(--violet-bright)', duration: 0.2 })
      gsap.to(ring, { scale: 1, borderColor: 'rgba(124,58,237,0.6)', duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [introComplete, location.pathname])

  const handleIntroComplete = () => {
    setIntroComplete(true)
    document.body.classList.remove('loading')
  }

  return (
    <>
      <div className="noise" />
      <div ref={cursorRef} className="cursor" />
      <div ref={cursorRingRef} className="cursor-ring" />
      <AmbientBackground />

      {!introComplete && <Intro onComplete={handleIntroComplete} />}

      {introComplete && (
        <>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
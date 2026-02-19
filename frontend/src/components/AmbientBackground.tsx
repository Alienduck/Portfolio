import { useEffect, useRef } from 'react'

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let width = window.innerWidth
    let height = window.innerHeight
    let animId: number
    let t = 0

    canvas.width = width
    canvas.height = height

    const blobs = [
      { x: 0.2, y: 0.3, r: 0.35, color: [59, 130, 246], speed: 0.0003, phase: 0 },
      { x: 0.8, y: 0.7, r: 0.4, color: [124, 58, 237], speed: 0.0004, phase: Math.PI },
      { x: 0.5, y: 0.1, r: 0.3, color: [99, 102, 241], speed: 0.00025, phase: Math.PI / 2 },
    ]

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    const draw = () => {
      t++
      ctx.clearRect(0, 0, width, height)

      blobs.forEach(blob => {
        const x = (blob.x + Math.sin(t * blob.speed + blob.phase) * 0.15) * width
        const y = (blob.y + Math.cos(t * blob.speed * 0.7 + blob.phase) * 0.15) * height
        const r = blob.r * Math.min(width, height)

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.07)`)
        grad.addColorStop(1, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} id="ambient-canvas" />
      {/* Tunic Golden Path (Holy Cross) */}
      <svg
        viewBox="0 0 200 200"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '35vw',
          minWidth: '300px',
          height: 'auto',
          opacity: 0.03,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Point de départ (Cercle rempli) */}
        <circle
          cx="100"
          cy="150"
          r="6"
          fill="#f4b942"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(244, 185, 66, 0.6))'
          }}
        />

        <path
          d="M 100 150 L 100 100 L 10 100 L 10 50 L 150 50 L 150 100 L 200 100"
          fill="none"
          stroke="#f4b942"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(244, 185, 66, 0.5))'
          }}
        />
      </svg>
    </>
  )
}
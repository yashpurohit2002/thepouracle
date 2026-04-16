import { useMemo } from 'react'

const COLORS = ['#39ff14', '#ff2d78', '#00e5ff', '#ffd700', '#bf5fff', '#ff6600']

export default function PixelConfetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 1.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.floor(Math.random() * 8),
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9996] overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-pixel"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

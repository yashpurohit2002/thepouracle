import { useState, useEffect } from 'react'
import { CHALLENGE_MAP } from '../data/challenges'

export default function ActiveChallengeBar({ challenge, onComplete, onForfeit }) {
  const def = CHALLENGE_MAP[challenge.challenge_key]
  const totalSeconds = def?.duration || 0
  const [seconds, setSeconds] = useState(() => {
    if (!def?.duration) return null
    const elapsed = Math.floor((Date.now() - new Date(challenge.responded_at).getTime()) / 1000)
    return Math.max(0, def.duration - elapsed)
  })

  useEffect(() => {
    if (seconds === null) return // no timer challenge
    if (seconds <= 0) { onForfeit(); return }
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { onForfeit(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [seconds === null ? 'no-timer' : 'has-timer'])

  if (!def) return null

  const pct = totalSeconds > 0 && seconds !== null ? (seconds / totalSeconds) * 100 : 100
  const barColor = pct > 50 ? '#39ff14' : pct > 20 ? '#ffd700' : '#ff2d78'

  return (
    <div
      className="flex-shrink-0 border-b-2 px-4 py-3 animate-slide-up"
      style={{ borderColor: def.color, background: '#050508' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{def.emoji}</span>
          <div className="min-w-0">
            <div className="font-pixel text-xs truncate" style={{ color: def.color }}>
              {def.title}
            </div>
            <div className="font-pixel" style={{ fontSize: '0.45rem', color: '#444466' }}>
              from {challenge.from_player_name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {seconds !== null && (
            <span className="font-pixel text-sm" style={{ color: barColor }}>
              {seconds}s
            </span>
          )}
          <button
            className="btn-arcade btn-green text-xs py-2 px-3"
            style={{ minHeight: '36px', fontSize: '0.55rem' }}
            onClick={onComplete}
          >
            ✓ DONE
          </button>
          <button
            className="btn-arcade btn-pink text-xs py-2 px-3"
            style={{ minHeight: '36px', fontSize: '0.55rem' }}
            onClick={onForfeit}
          >
            ✗
          </button>
        </div>
      </div>
      {seconds !== null && (
        <div className="h-1 bg-arcade-border overflow-hidden">
          <div
            className="h-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
      )}
    </div>
  )
}

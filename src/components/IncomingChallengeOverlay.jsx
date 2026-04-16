import { useState, useEffect } from 'react'
import { CHALLENGE_MAP } from '../data/challenges'

export default function IncomingChallengeOverlay({ challenge, onAccept, onDecline }) {
  const [seconds, setSeconds] = useState(30)
  const def = CHALLENGE_MAP[challenge.challenge_key]

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { onDecline(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  if (!def) return null

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/95">
      <div className="w-full max-w-xs mx-4 animate-bounce-in">
        <div
          className="pixel-border-pink p-6 text-center"
          style={{ background: '#080005' }}
        >
          <div className="font-pixel text-xs text-gray-500 mb-1">INCOMING CHALLENGE FROM</div>
          <div className="font-pixel text-sm neon-pink mb-5">{challenge.from_player_name}</div>

          <div className="text-5xl mb-3 animate-pulse-glow">{def.emoji}</div>
          <div className="font-pixel text-sm mb-2" style={{ color: def.color }}>
            {def.title}
          </div>
          <div
            className="font-pixel leading-relaxed mb-4"
            style={{ fontSize: '0.55rem', color: '#888899' }}
          >
            {def.description}
          </div>
          {def.duration && (
            <div className="font-pixel text-xs text-gray-600 mb-5">
              you'll have{' '}
              {def.duration >= 60
                ? `${Math.round(def.duration / 60)} min`
                : `${def.duration}s`}{' '}
              to complete it
            </div>
          )}

          {/* Response countdown */}
          <div className="font-pixel text-xs text-gray-600 mb-2">
            auto-declines in <span className="neon-yellow">{seconds}s</span>
          </div>
          <div className="h-1 bg-arcade-border mb-5 overflow-hidden">
            <div
              className="h-full bg-neon-yellow"
              style={{
                width: `${(seconds / 30) * 100}%`,
                transition: 'width 1s linear',
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="btn-arcade btn-pink flex-1 text-xs py-4"
              onClick={onDecline}
            >
              ✕ DECLINE
            </button>
            <button
              className="btn-arcade btn-green flex-1 text-xs py-4"
              onClick={onAccept}
            >
              ✓ ACCEPT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

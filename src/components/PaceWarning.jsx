import { useEffect } from 'react'

const MESSAGES = [
  { msg: "YOU'RE GOING FAST 👀", sub: "maybe grab some water?" },
  { msg: "PACE YOURSELF, CHAMP", sub: "4+ drinks this hour" },
  { msg: "SLOW DOWN SPEED RACER", sub: "the night is long" },
  { msg: "HOT STREAK ⚡", sub: "water break recommended" },
]

export default function PaceWarning({ onDismiss }) {
  const { msg, sub } = MESSAGES[Math.floor(Date.now() / 1000) % MESSAGES.length]

  useEffect(() => {
    const t = setTimeout(onDismiss, 8000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className="fixed bottom-20 left-1/2 z-[9995] w-full max-w-xs cursor-pointer animate-slide-up"
      style={{ transform: 'translateX(-50%)' }}
      onClick={onDismiss}
    >
      <div
        className="mx-4 p-4 border-2 border-neon-yellow"
        style={{
          background: '#0a0800',
          boxShadow: '0 0 20px rgba(255,215,0,0.3), 3px 3px 0 #7a6500',
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚡</span>
          <div>
            <div className="font-pixel text-xs neon-yellow mb-1">{msg}</div>
            <div className="font-pixel leading-relaxed" style={{ fontSize: '0.55rem', color: '#888866' }}>
              {sub} · tap to dismiss
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

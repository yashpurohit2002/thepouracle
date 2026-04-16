import { useEffect } from 'react'

export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [achievement?.key, onDismiss])

  if (!achievement) return null

  return (
    <div className="achievement-toast" role="alert" aria-live="polite">
      <div
        className="pixel-border-yellow p-4"
        style={{ background: '#0a0a00' }}
        onClick={onDismiss}
      >
        <div className="flex items-start gap-3">
          <div className="text-4xl flex-shrink-0 animate-bounce-in">{achievement.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-pixel text-xs neon-yellow mb-1">ACHIEVEMENT UNLOCKED!</div>
            <div
              className="font-pixel text-sm mb-1"
              style={{ color: achievement.color || '#ffffff' }}
            >
              {achievement.title}
            </div>
            <div className="font-pixel text-xs leading-relaxed" style={{ color: '#888899' }}>
              {achievement.description}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-arcade-border rounded-none overflow-hidden">
          <div
            className="h-full bg-neon-yellow"
            style={{
              animation: 'shrink 4s linear forwards',
              width: '100%',
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CHALLENGES, CHALLENGE_CATEGORIES } from '../data/challenges'

export default function ChallengePickerModal({ targetPlayer, onClose }) {
  const { sendChallenge } = useApp()
  const [category, setCategory] = useState('drink')
  const [sending, setSending] = useState(false)
  const [sentKey, setSentKey] = useState(null)
  const [sendError, setSendError] = useState(null)

  const filtered = CHALLENGES.filter(c => c.category === category)

  async function handleSelect(challenge) {
    if (sending) return
    setSending(true)
    setSendError(null)
    try {
      await sendChallenge(targetPlayer.id, targetPlayer.display_name, challenge.key)
      setSentKey(challenge.key)
      setTimeout(onClose, 800)
    } catch (e) {
      console.error('sendChallenge failed:', e)
      setSendError(e?.message || 'Failed to send')
      setSending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-end justify-center bg-black/90"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm modal-content">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-arcade-border sticky top-0 bg-arcade-navy z-10">
          <div>
            <div className="font-pixel text-xs neon-pink">CHALLENGE</div>
            <div className="font-pixel text-sm text-white mt-1 truncate max-w-[180px]">
              {targetPlayer.display_name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-pixel text-xs text-gray-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Error banner */}
        {sendError && (
          <div className="px-5 py-2 bg-red-950 border-b border-red-800">
            <span className="font-pixel text-xs text-red-400" style={{ fontSize: '0.5rem' }}>
              ✗ {sendError}
            </span>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex border-b border-arcade-border">
          {CHALLENGE_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className="flex-1 py-3 flex flex-col items-center gap-1"
              onClick={() => setCategory(cat.key)}
            >
              <span className="text-base">{cat.emoji}</span>
              <span
                className="font-pixel"
                style={{
                  fontSize: '0.5rem',
                  color: category === cat.key ? '#ff2d78' : '#444466',
                  textShadow: category === cat.key ? '0 0 8px #ff2d78' : 'none',
                  borderBottom: category === cat.key ? '2px solid #ff2d78' : '2px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Challenge list */}
        <div className="scroll-area" style={{ maxHeight: '55dvh' }}>
          {filtered.map(challenge => {
            const isSent = sentKey === challenge.key
            return (
              <button
                key={challenge.key}
                className="w-full flex items-start gap-3 px-5 py-4 border-b border-arcade-border text-left transition-colors"
                style={isSent ? { background: 'rgba(57,255,20,0.08)' } : {}}
                onClick={() => handleSelect(challenge)}
                disabled={sending}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{challenge.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-pixel text-xs mb-1" style={{ color: isSent ? '#39ff14' : challenge.color }}>
                    {isSent ? '✓ SENT!' : challenge.title}
                  </div>
                  <div
                    className="font-pixel leading-relaxed"
                    style={{ fontSize: '0.5rem', color: '#666688' }}
                  >
                    {challenge.description}
                  </div>
                  {challenge.duration && (
                    <div className="font-pixel mt-1" style={{ fontSize: '0.45rem', color: '#333355' }}>
                      {challenge.duration >= 60
                        ? `${Math.round(challenge.duration / 60)} min to complete`
                        : `${challenge.duration}s to complete`}
                    </div>
                  )}
                </div>
                {!isSent && (
                  <span className="font-pixel text-xs flex-shrink-0" style={{ color: '#333355' }}>
                    ⚔️
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

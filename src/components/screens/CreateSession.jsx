import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { playError } from '../../lib/audio'

export default function CreateSession() {
  const { setScreen, createSession, error, setError } = useApp()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (trimmed.length > 20) {
      setError('Name must be 20 characters or less.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await createSession(trimmed)
    } catch (err) {
      setError(err.message || 'Failed to create session.')
      playError()
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-dvh bg-arcade-dark overflow-y-auto scroll-area">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-5 border-b border-arcade-border">
        <button
          className="font-pixel text-xs text-gray-500 hover:text-gray-300 transition-colors min-w-[44px] min-h-[44px] flex items-center"
          onClick={() => { setError(null); setScreen('home') }}
        >
          ◀ BACK
        </button>
        <span className="font-pixel text-sm neon-green flex-1 text-center">CREATE SESSION</span>
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-sm mx-auto w-full">
        {/* Icon */}
        <div className="text-5xl text-center mb-8">🎮</div>

        <div className="pixel-border-green p-6 mb-6" style={{ background: '#050510' }}>
          <p className="font-pixel text-xs text-gray-400 mb-6 leading-relaxed">
            ENTER YOUR NAME. A ROOM CODE WILL BE GENERATED FOR OTHERS TO JOIN.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="font-pixel text-xs text-gray-500 block mb-2">
                DISPLAY NAME
              </label>
              <input
                className="input-arcade"
                type="text"
                placeholder="e.g. YASH, PARTY KING..."
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={20}
                autoFocus
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                disabled={submitting}
              />
              <div className="font-pixel text-xs mt-1" style={{ color: name.length > 16 ? '#ff2d78' : '#333355' }}>
                {name.length}/20
              </div>
            </div>

            {error && (
              <div className="font-pixel text-xs neon-pink leading-relaxed animate-slide-up">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-arcade btn-green text-sm py-5 w-full mt-2"
              disabled={submitting || !name.trim()}
            >
              {submitting ? (
                <span className="loading-dots">
                  CREATING<span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                '▶ CREATE ROOM'
              )}
            </button>
          </form>
        </div>

        <p className="font-pixel text-xs text-center leading-relaxed" style={{ color: '#333355' }}>
          YOU'LL BE THE HOST. SHARE YOUR ROOM CODE WITH FRIENDS.
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { playError } from '../../lib/audio'

export default function JoinSession() {
  const { setScreen, joinSession, error, setError, prefillJoinCode } = useApp()
  const [code, setCode] = useState(prefillJoinCode || '')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimCode = code.trim().toUpperCase()
    const trimName = name.trim()

    if (!trimCode || !trimName) return
    if (trimCode.length !== 5) {
      setError('Room code must be 5 characters.')
      return
    }
    if (trimName.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (trimName.length > 20) {
      setError('Name must be 20 characters or less.')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await joinSession(trimCode, trimName)
    } catch (err) {
      setError(err.message || 'Failed to join session.')
      playError()
      setSubmitting(false)
    }
  }

  function handleCodeChange(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
    setCode(val)
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
        <span className="font-pixel text-sm neon-cyan flex-1 text-center">JOIN SESSION</span>
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-sm mx-auto w-full">
        {/* Icon */}
        <div className="text-5xl text-center mb-8">🎯</div>

        <div className="pixel-border-cyan p-6 mb-6" style={{ background: '#050510' }}>
          <p className="font-pixel text-xs text-gray-400 mb-6 leading-relaxed">
            ENTER THE ROOM CODE FROM YOUR HOST'S SCREEN.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Room code */}
            <div>
              <label className="font-pixel text-xs text-gray-500 block mb-2">
                ROOM CODE
              </label>
              <input
                className="input-arcade text-center text-xl tracking-[0.4em]"
                type="text"
                placeholder="XXXXX"
                value={code}
                onChange={handleCodeChange}
                autoFocus
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                inputMode="text"
                disabled={submitting}
              />
            </div>

            {/* Name */}
            <div>
              <label className="font-pixel text-xs text-gray-500 block mb-2">
                YOUR NAME
              </label>
              <input
                className="input-arcade"
                type="text"
                placeholder="e.g. ALEX, COCKTAIL QUEEN..."
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={20}
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                disabled={submitting}
              />
            </div>

            {error && (
              <div className="font-pixel text-xs neon-pink leading-relaxed animate-slide-up">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-arcade btn-cyan text-sm py-5 w-full mt-2"
              disabled={submitting || !code.trim() || !name.trim()}
            >
              {submitting ? (
                <span className="loading-dots">
                  JOINING<span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                '▶ JOIN ROOM'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

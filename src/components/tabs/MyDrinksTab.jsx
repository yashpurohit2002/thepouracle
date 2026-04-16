import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { DRINK_MAP, ALCOHOLIC_TYPES, formatTime } from '../../constants/drinks'
import DrinkForm from '../DrinkForm'

export default function MyDrinksTab() {
  const { player, drinks, undoable, undoDrink } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [undoSeconds, setUndoSeconds] = useState(0)
  const [scoreKey, setScoreKey] = useState(0)
  const prevCountRef = useRef(0)

  const myDrinks = drinks
    .filter(d => d.player_id === player?.id)
    .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))

  const alcoholCount = myDrinks.filter(d => ALCOHOLIC_TYPES.includes(d.drink_type)).length
  const waterCount   = myDrinks.filter(d => d.drink_type === 'water').length

  // Animate score on change
  useEffect(() => {
    if (alcoholCount !== prevCountRef.current) {
      prevCountRef.current = alcoholCount
      setScoreKey(k => k + 1)
    }
  }, [alcoholCount])

  // Undo countdown
  useEffect(() => {
    if (!undoable) {
      setUndoSeconds(0)
      return
    }
    const tick = () => {
      const remaining = Math.ceil((undoable.expiresAt - Date.now()) / 1000)
      setUndoSeconds(Math.max(0, remaining))
    }
    tick()
    const interval = setInterval(tick, 500)
    return () => clearInterval(interval)
  }, [undoable])

  return (
    <div className="flex flex-col h-full">
      {/* Score bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-arcade-border bg-arcade-navy">
        <div>
          <div className="font-pixel text-xs text-gray-500 mb-1">YOUR COUNT</div>
          {waterCount > 0 && (
            <div className="font-pixel flex items-center gap-1" style={{ fontSize: '0.5rem', color: '#00e5ff88' }}>
              <span>💧</span>
              <span>{waterCount} WATER</span>
            </div>
          )}
        </div>
        <div
          key={scoreKey}
          className="font-pixel text-3xl neon-green score-display animate-score-tick"
        >
          {String(alcoholCount).padStart(2, '0')}
        </div>
      </div>

      {/* Undo banner */}
      {undoable && undoSeconds > 0 && (
        <div className="flex-shrink-0 bg-black border-b-2 border-neon-yellow px-4 py-3 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-xs neon-yellow">UNDO LAST DRINK?</span>
            <button
              className="btn-arcade btn-yellow text-xs py-2 px-4"
              onClick={undoDrink}
            >
              ↩ UNDO ({undoSeconds}s)
            </button>
          </div>
          <div className="h-1 bg-arcade-border">
            <div
              className="undo-bar"
              style={{ width: `${(undoSeconds / 30) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Log button */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-arcade-border">
        <button
          className="btn-arcade btn-pink text-base py-5 w-full"
          onClick={() => setShowForm(true)}
          style={{ fontSize: '0.8rem' }}
        >
          + LOG A DRINK
        </button>
      </div>

      {/* Drink list */}
      <div className="flex-1 scroll-area">
        {myDrinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
            <div className="text-5xl opacity-30">🥤</div>
            <div className="font-pixel text-xs text-gray-600 leading-relaxed">
              NO DRINKS YET.<br />HIT THAT BUTTON!
            </div>
          </div>
        ) : (
          <div className="divide-y divide-arcade-border">
            {myDrinks.map((drink, idx) => {
              const type = DRINK_MAP[drink.drink_type]
              const isRecent = Date.now() - new Date(drink.logged_at) < 60000
              return (
                <div
                  key={drink.id}
                  className="flex items-start gap-3 px-5 py-4"
                  style={idx === 0 ? { animation: 'slideUp 0.25s ease-out forwards' } : {}}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{type?.emoji || '🍹'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-pixel text-xs"
                        style={{ color: type?.color || '#ffffff' }}
                      >
                        {type?.label || drink.drink_type.toUpperCase()}
                      </span>
                      {isRecent && (
                        <span className="badge-new">NEW</span>
                      )}
                    </div>
                    {drink.brand && (
                      <div className="font-pixel text-xs text-gray-300 mt-1 truncate">
                        {drink.brand}
                      </div>
                    )}
                    {drink.notes && (
                      <div className="font-pixel text-xs mt-1 leading-relaxed" style={{ color: '#555577' }}>
                        "{drink.notes}"
                      </div>
                    )}
                  </div>
                  <div className="font-pixel text-xs text-gray-600 flex-shrink-0 mt-0.5">
                    {formatTime(drink.logged_at)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Drink form modal */}
      {showForm && <DrinkForm onClose={() => setShowForm(false)} />}
    </div>
  )
}

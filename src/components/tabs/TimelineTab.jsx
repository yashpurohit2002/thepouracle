import { useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { DRINK_MAP, PLAYER_COLORS, timeAgo } from '../../constants/drinks'
import { ACHIEVEMENTS } from '../../utils/achievements'
import { CHALLENGE_MAP } from '../../data/challenges'

export default function TimelineTab() {
  const { drinks, achievements, challenges, players, player: me } = useApp()
  const bottomRef = useRef(null)
  const isFirstRender = useRef(true)

  // Completed/forfeited challenges for timeline
  const resolvedChallenges = challenges.filter(c =>
    c.status === 'completed' || c.status === 'forfeited' || c.status === 'declined'
  )

  // Combine drinks + achievements + resolved challenges into a unified timeline
  const timeline = [
    ...drinks.map(d => ({ ...d, _type: 'drink', _time: d.logged_at })),
    ...achievements.map(a => ({ ...a, _type: 'achievement', _time: a.earned_at })),
    ...resolvedChallenges.map(c => ({ ...c, _type: 'challenge', _time: c.completed_at || c.responded_at || c.created_at })),
  ].sort((a, b) => new Date(a._time) - new Date(b._time))

  // Auto-scroll to bottom when new items arrive
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      bottomRef.current?.scrollIntoView()
      return
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [timeline.length])

  function getPlayerColor(playerId) {
    const idx = players.findIndex(p => p.id === playerId)
    return PLAYER_COLORS[Math.max(0, idx) % PLAYER_COLORS.length]
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-arcade-border bg-arcade-navy">
        <span className="font-pixel text-xs neon-cyan">TIMELINE</span>
        <span className="font-pixel text-xs text-gray-600">{drinks.length} DRINK{drinks.length !== 1 ? 'S' : ''} TOTAL</span>
      </div>

      <div className="flex-1 scroll-area">
        {timeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-5xl opacity-30">📜</div>
            <div className="font-pixel text-xs text-gray-600 text-center leading-relaxed">
              THE NIGHT IS YOUNG.<br />LOG SOMETHING!
            </div>
          </div>
        ) : (
          <div className="divide-y divide-arcade-border">
            {timeline.map((item, idx) => {
              const color = getPlayerColor(item.player_id)
              const isMe = item.player_id === me?.id
              const isNew = Date.now() - new Date(item._time) < 60000
              const isLast = idx === timeline.length - 1

              if (item._type === 'achievement') {
                const ach = ACHIEVEMENTS[item.achievement_key]
                return (
                  <div
                    key={`ach-${item.id}`}
                    className="flex items-start gap-3 px-5 py-3"
                    style={{
                      background: 'rgba(255,215,0,0.04)',
                      ...(isLast ? { animation: 'slideUp 0.25s ease-out forwards' } : {}),
                    }}
                  >
                    <span className="text-xl flex-shrink-0">🏅</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="font-pixel text-xs"
                          style={{ color, textShadow: `0 0 6px ${color}` }}
                        >
                          {item.player_name}
                        </span>
                        <span className="font-pixel text-xs neon-yellow">
                          UNLOCKED {ach?.title || item.achievement_key.toUpperCase()}
                        </span>
                      </div>
                      {ach?.description && (
                        <div className="font-pixel text-xs" style={{ color: '#555577' }}>
                          {ach.description}
                        </div>
                      )}
                    </div>
                    <div className="font-pixel text-xs text-gray-600 flex-shrink-0">{timeAgo(item._time)}</div>
                  </div>
                )
              }

              if (item._type === 'challenge') {
                const def = CHALLENGE_MAP[item.challenge_key]
                const fromColor = getPlayerColor(item.from_player_id)
                const toColor = getPlayerColor(item.to_player_id)
                const completed = item.status === 'completed'
                const forfeited = item.status === 'forfeited'
                const declined = item.status === 'declined'
                return (
                  <div
                    key={`challenge-${item.id}`}
                    className="flex items-start gap-3 px-5 py-3"
                    style={{
                      background: completed
                        ? 'rgba(57,255,20,0.03)'
                        : 'rgba(255,45,120,0.03)',
                      ...(isLast ? { animation: 'slideUp 0.25s ease-out forwards' } : {}),
                    }}
                  >
                    <span className="text-xl flex-shrink-0">{def?.emoji || '⚔️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap mb-1">
                        <span className="font-pixel text-xs" style={{ color: fromColor }}>
                          {item.from_player_name}
                        </span>
                        <span className="font-pixel text-xs" style={{ color: '#444466' }}>→</span>
                        <span className="font-pixel text-xs" style={{ color: toColor }}>
                          {item.to_player_name}
                        </span>
                      </div>
                      <div
                        className="font-pixel text-xs"
                        style={{
                          color: completed ? '#39ff14' : declined ? '#444466' : '#ff2d78',
                        }}
                      >
                        {completed ? '✓ COMPLETED' : declined ? '✗ DECLINED' : '✗ FORFEITED'}{' '}
                        <span style={{ color: def?.color || '#888' }}>{def?.title}</span>
                      </div>
                    </div>
                    <div className="font-pixel text-xs text-gray-600 flex-shrink-0">{timeAgo(item._time)}</div>
                  </div>
                )
              }

              // Drink entry
              const type = DRINK_MAP[item.drink_type]
              return (
                <div
                  key={`drink-${item.id}`}
                  className="flex items-start gap-3 px-5 py-3"
                  style={isLast ? { animation: 'slideUp 0.25s ease-out forwards' } : {}}
                >
                  <span className="text-xl flex-shrink-0">{type?.emoji || '🍹'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="font-pixel text-xs"
                        style={{ color, textShadow: `0 0 6px ${color}` }}
                      >
                        {item.player_name}
                      </span>
                      <span className="font-pixel text-xs" style={{ color: type?.color || '#ccc' }}>
                        {type?.label || item.drink_type.toUpperCase()}
                      </span>
                      {isNew && <span className="badge-new">NEW</span>}
                    </div>
                    {item.brand && (
                      <div className="font-pixel text-xs truncate" style={{ color: '#888899' }}>
                        {item.brand}
                      </div>
                    )}
                    {item.notes && (
                      <div className="font-pixel text-xs mt-0.5 leading-relaxed" style={{ color: '#444466' }}>
                        "{item.notes}"
                      </div>
                    )}
                  </div>
                  <div className="font-pixel text-xs text-gray-600 flex-shrink-0">{timeAgo(item._time)}</div>
                </div>
              )
            })}
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  )
}

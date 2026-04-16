import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { PLAYER_COLORS, ALCOHOLIC_TYPES } from '../../constants/drinks'
import ChallengePickerModal from '../ChallengePickerModal'

export default function LeaderboardTab() {
  const { players, drinks, player: me } = useApp()
  const [challengeTarget, setChallengeTarget] = useState(null)

  const leaderboard = useMemo(() => {
    const counts = {}
    const waterCounts = {}
    drinks.forEach(d => {
      if (ALCOHOLIC_TYPES.includes(d.drink_type)) {
        counts[d.player_id] = (counts[d.player_id] || 0) + 1
      } else if (d.drink_type === 'water') {
        waterCounts[d.player_id] = (waterCounts[d.player_id] || 0) + 1
      }
    })
    return players
      .map(p => ({ ...p, count: counts[p.id] || 0, waterCount: waterCounts[p.id] || 0 }))
      .sort((a, b) => b.count - a.count || a.joined_at?.localeCompare(b.joined_at || ''))
  }, [players, drinks])

  const maxCount = leaderboard[0]?.count || 1

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-arcade-border bg-arcade-navy">
        <span className="font-pixel text-xs neon-yellow">LEADERBOARD</span>
        <span className="font-pixel text-xs text-gray-600">{players.length} PLAYER{players.length !== 1 ? 'S' : ''}</span>
      </div>

      <div className="flex-1 scroll-area">
        {leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-5xl opacity-30">🏆</div>
            <div className="font-pixel text-xs text-gray-600 text-center leading-relaxed">
              WAITING FOR PLAYERS...
            </div>
          </div>
        ) : (
          <div className="divide-y divide-arcade-border">
            {leaderboard.map((p, idx) => {
              const color = PLAYER_COLORS[players.findIndex(pl => pl.id === p.id) % PLAYER_COLORS.length]
              const isMe = p.id === me?.id
              const barPct = maxCount > 0 ? (p.count / maxCount) * 100 : 0

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-5 py-4"
                  style={isMe ? { background: 'rgba(57,255,20,0.04)' } : {}}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 text-center">
                    {idx === 0 ? (
                      <span className="text-xl neon-yellow">👑</span>
                    ) : (
                      <span className="font-pixel text-xs" style={{ color: '#444466' }}>
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Color dot */}
                  <div
                    className="player-dot flex-shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />

                  {/* Name + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-pixel text-xs truncate"
                        style={{ color: isMe ? '#39ff14' : '#ccccdd' }}
                      >
                        {p.display_name}
                        {isMe && <span className="ml-1" style={{ color: '#444466' }}>(YOU)</span>}
                        {p.waterCount > 0 && (
                          <span className="ml-1" style={{ color: '#00e5ff66', fontSize: '0.55rem' }}>
                            💧{p.waterCount}
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="h-2 bg-arcade-border w-full overflow-hidden">
                      <div
                        className="bar-fill h-full"
                        style={{
                          width: `${barPct}%`,
                          background: color,
                          boxShadow: `0 0 8px ${color}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Count + challenge button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="font-pixel text-lg score-display"
                      style={{ color, textShadow: `0 0 10px ${color}` }}
                    >
                      {p.count}
                    </div>
                    {!isMe && (
                      <button
                        className="px-2 py-1"
                        style={{
                          border: '1px solid #ff2d7844',
                          fontSize: '1rem',
                          minHeight: '36px',
                          lineHeight: 1,
                        }}
                        onClick={() => setChallengeTarget(p)}
                        title={`Challenge ${p.display_name}`}
                      >
                        ⚔️
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {challengeTarget && (
        <ChallengePickerModal
          targetPlayer={challengeTarget}
          onClose={() => setChallengeTarget(null)}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import BottomNav from '../BottomNav'
import MyDrinksTab from '../tabs/MyDrinksTab'
import LeaderboardTab from '../tabs/LeaderboardTab'
import TimelineTab from '../tabs/TimelineTab'
import StatsTab from '../tabs/StatsTab'
import QRCodeModal from '../QRCodeModal'
import { ALCOHOLIC_TYPES } from '../../constants/drinks'

export default function GameScreen() {
  const { session, player, players, drinks, endSession, leaveSession } = useApp()
  const [activeTab, setActiveTab] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // Only count alcoholic drinks for the header score
  const myCount = drinks.filter(d => d.player_id === player?.id && ALCOHOLIC_TYPES.includes(d.drink_type)).length

  const tabs = [
    <MyDrinksTab key="my" />,
    <LeaderboardTab key="board" />,
    <TimelineTab key="timeline" />,
    <StatsTab key="stats" />,
  ]

  return (
    <div className="game-layout">
      {/* Header */}
      <header className="game-header px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Room code + QR button */}
          <button
            className="flex items-center gap-2 min-h-[44px] px-1"
            onClick={() => setShowQR(true)}
            title="Show QR code"
          >
            <span className="font-pixel text-xs text-gray-500">CODE:</span>
            <span className="font-pixel text-sm neon-cyan tracking-widest">
              {session?.roomCode}
            </span>
            <span className="font-pixel text-xs" style={{ color: '#444466' }}>⬛</span>
          </button>

          {/* Player info + menu */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-pixel text-xs" style={{ color: '#39ff14' }}>
                {player?.name?.slice(0, 12)}
              </span>
              {myCount > 0 && (
                <span
                  className="font-pixel text-xs neon-green ml-1"
                  style={{ fontSize: '0.6rem' }}
                >
                  ({myCount})
                </span>
              )}
            </div>
            <button
              className="font-pixel text-xs text-gray-500 hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setShowMenu(v => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Players online indicator */}
        <div className="flex items-center gap-1 mt-1">
          <span
            className="inline-block w-2 h-2 rounded-none bg-neon-green"
            style={{ boxShadow: '0 0 4px #39ff14' }}
          />
          <span className="font-pixel text-xs text-gray-600">
            {players.length} ONLINE · {drinks.length} DRINKS TOTAL
          </span>
        </div>
      </header>

      {/* Dropdown menu */}
      {showMenu && (
        <div
          className="absolute top-16 right-0 z-50 bg-arcade-navy border border-arcade-border shadow-lg"
          style={{ minWidth: '180px' }}
        >
          {player?.isHost ? (
            <button
              className="font-pixel text-xs text-left w-full px-5 py-4 hover:bg-red-950 text-red-400 border-b border-arcade-border"
              onClick={() => {
                setShowMenu(false)
                if (confirm('End session for everyone?')) endSession()
              }}
            >
              ⏹ END SESSION
            </button>
          ) : null}
          <button
            className="font-pixel text-xs text-left w-full px-5 py-4 hover:bg-arcade-border text-gray-400"
            onClick={() => {
              setShowMenu(false)
              if (confirm('Leave this session?')) leaveSession()
            }}
          >
            ← LEAVE SESSION
          </button>
          <button
            className="font-pixel text-xs text-left w-full px-5 py-4 hover:bg-arcade-border text-gray-600"
            onClick={() => setShowMenu(false)}
          >
            ✕ CLOSE
          </button>
        </div>
      )}

      {/* Tab content */}
      <main className="game-content overflow-hidden">
        <div className="h-full flex flex-col">
          {tabs[activeTab]}
        </div>
      </main>

      {/* Bottom nav */}
      <footer className="game-bottom-nav">
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </footer>

      {/* QR modal */}
      {showQR && (
        <QRCodeModal roomCode={session?.roomCode} onClose={() => setShowQR(false)} />
      )}
    </div>
  )
}

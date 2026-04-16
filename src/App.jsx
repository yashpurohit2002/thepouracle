import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import HomeScreen from './components/screens/HomeScreen'
import CreateSession from './components/screens/CreateSession'
import JoinSession from './components/screens/JoinSession'
import GameScreen from './components/screens/GameScreen'
import AchievementToast from './components/AchievementToast'
import PixelConfetti from './components/PixelConfetti'
import PaceWarning from './components/PaceWarning'

function AppShell() {
  const { screen, setScreen, loading, toastQueue, dismissToast, showConfetti, paceWarning, dismissPaceWarning, prefillJoinCode } = useApp()

  // Auto-navigate to join screen if ?join= param present
  useEffect(() => {
    if (prefillJoinCode && screen === 'home') {
      setScreen('join')
    }
  }, [prefillJoinCode])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-arcade-dark">
        <div className="text-center">
          <div className="neon-green font-pixel text-sm mb-6">THE POURACLE</div>
          <div className="font-pixel text-xs text-gray-500 loading-dots">
            LOADING<span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-arcade-dark">
      {/* CRT overlay */}
      <div className="crt-overlay" />
      <div className="vignette" />

      {/* Screens */}
      {screen === 'home'   && <HomeScreen />}
      {screen === 'create' && <CreateSession />}
      {screen === 'join'   && <JoinSession />}
      {screen === 'game'   && <GameScreen />}

      {/* Global overlays */}
      {toastQueue.length > 0 && (
        <AchievementToast
          achievement={toastQueue[0]}
          onDismiss={dismissToast}
        />
      )}
      {paceWarning && <PaceWarning onDismiss={dismissPaceWarning} />}
      {showConfetti && <PixelConfetti />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

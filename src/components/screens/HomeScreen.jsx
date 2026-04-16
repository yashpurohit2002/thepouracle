import { useApp } from '../../context/AppContext'

const TAGLINES = [
  'ALL-KNOWING. ALL-DRINKING.',
  'THE ORACLE HAS SPOKEN: ONE MORE.',
  'FATE SAYS: KEEP GOING.',
  'YOUR DESTINY IS BOTTOMLESS.',
]

export default function HomeScreen() {
  const { setScreen } = useApp()
  const tagline = TAGLINES[Math.floor(Date.now() / 86400000) % TAGLINES.length]

  return (
    <div className="flex flex-col items-center justify-between h-dvh bg-arcade-dark px-6 py-12 overflow-y-auto scroll-area">
      {/* Top spacer */}
      <div />

      {/* Logo area */}
      <div className="text-center w-full">
        {/* Pixel art cup graphic */}
        <div className="text-6xl mb-8 animate-pulse-glow" aria-hidden="true">
          🔮
        </div>

        {/* Title */}
        <h1 className="font-pixel text-2xl leading-loose mb-3 neon-green animate-pulse-glow">
          THE
        </h1>
        <h1 className="font-pixel text-2xl leading-loose mb-8 neon-pink animate-pulse-glow">
          POURACLE
        </h1>

        {/* Tagline */}
        <p className="font-pixel text-xs text-gray-500 leading-relaxed mb-2">
          {tagline}
        </p>

        {/* Decorative separator */}
        <div className="flex items-center gap-3 my-10 px-4">
          <div className="flex-1 h-px bg-arcade-border" />
          <span className="font-pixel text-xs text-arcade-border">▼</span>
          <div className="flex-1 h-px bg-arcade-border" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-5 w-full max-w-xs mx-auto">
          <button
            className="btn-arcade btn-green text-base py-5 w-full"
            onClick={() => setScreen('create')}
          >
            ▶ CREATE SESSION
          </button>
          <button
            className="btn-arcade btn-cyan text-base py-5 w-full"
            onClick={() => setScreen('join')}
          >
            ▷ JOIN SESSION
          </button>
        </div>
      </div>

      {/* Footer / disclaimer */}
      <div className="text-center px-4">
        <p className="font-pixel text-xs mb-2" style={{ color: '#333355' }}>
          v1.0 · FOR ADULTS 21+ ONLY
        </p>
        <p className="font-pixel leading-relaxed" style={{ color: '#2a2a44', fontSize: '0.45rem' }}>
          DRINK RESPONSIBLY. THIS APP IS FOR ENTERTAINMENT PURPOSES ONLY.
          THE POURACLE AND ITS CREATORS ACCEPT NO LIABILITY FOR ACTIONS
          TAKEN WHILE USING THIS APP. NEVER DRINK AND DRIVE. KNOW YOUR LIMITS.
        </p>
      </div>
    </div>
  )
}

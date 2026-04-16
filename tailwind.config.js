/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'neon-green': '#39ff14',
        'neon-pink': '#ff2d78',
        'neon-cyan': '#00e5ff',
        'neon-yellow': '#ffd700',
        'neon-purple': '#bf5fff',
        'neon-orange': '#ff6600',
        'arcade-dark': '#0a0a0a',
        'arcade-navy': '#0f0f1a',
        'arcade-border': '#2a2a4a',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.25s ease-out forwards',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'score-tick': 'scoreTick 0.15s steps(2) forwards',
        'float-up': 'floatUp 1s ease-out forwards',
        'blink': 'blink 1s steps(1) infinite',
        'shake': 'shake 0.3s steps(3) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scoreTick: {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        floatUp: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(-60px)', opacity: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      boxShadow: {
        'neon-green': '0 0 8px #39ff14, 0 0 24px #39ff14',
        'neon-pink': '0 0 8px #ff2d78, 0 0 24px #ff2d78',
        'neon-cyan': '0 0 8px #00e5ff, 0 0 24px #00e5ff',
        'neon-yellow': '0 0 8px #ffd700, 0 0 24px #ffd700',
        'pixel-green': '4px 4px 0px #1a7a00',
        'pixel-pink': '4px 4px 0px #7a0030',
        'pixel-cyan': '4px 4px 0px #006b7a',
        'pixel-yellow': '4px 4px 0px #7a6500',
      },
    },
  },
  plugins: [],
}

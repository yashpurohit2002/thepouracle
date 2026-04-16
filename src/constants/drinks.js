export const DRINK_TYPES = [
  { key: 'beer',         label: 'BEER',     emoji: '🍺', color: '#ffd700', neonClass: 'neon-yellow' },
  { key: 'wine',         label: 'WINE',     emoji: '🍷', color: '#ff2d78', neonClass: 'neon-pink'   },
  { key: 'cocktail',     label: 'COCKTAIL', emoji: '🍸', color: '#00e5ff', neonClass: 'neon-cyan'   },
  { key: 'shot',         label: 'SHOT',     emoji: '🥃', color: '#39ff14', neonClass: 'neon-green'  },
  { key: 'hard_seltzer', label: 'SELTZER',  emoji: '🫧', color: '#bf5fff', neonClass: 'neon-purple' },
  { key: 'water',        label: 'WATER',    emoji: '💧', color: '#00e5ff', neonClass: 'neon-cyan', isWater: true },
  { key: 'other',        label: 'OTHER',    emoji: '🍹', color: '#ff6600', neonClass: 'neon-orange' },
]

export const ALCOHOLIC_TYPES = ['beer', 'wine', 'cocktail', 'shot', 'hard_seltzer', 'other']

export const DRINK_MAP = Object.fromEntries(DRINK_TYPES.map(d => [d.key, d]))

export const PLAYER_COLORS = [
  '#39ff14', '#ff2d78', '#00e5ff', '#ffd700',
  '#bf5fff', '#ff6600', '#00ff99', '#ff3399',
]

export function getPlayerColor(playerId, players) {
  const idx = players.findIndex(p => p.id === playerId)
  return PLAYER_COLORS[Math.max(0, idx) % PLAYER_COLORS.length]
}

export function formatTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}

export function drinksPerHour(drinks, startTime) {
  if (!drinks.length || !startTime) return 0
  const hours = (Date.now() - new Date(startTime).getTime()) / 3600000
  if (hours < 0.05) return 0
  return (drinks.length / hours).toFixed(1)
}

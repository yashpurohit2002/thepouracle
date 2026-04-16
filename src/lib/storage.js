const SESSION_KEY = 'pouracle_session'
const PLAYER_KEY = 'pouracle_player'
const ACHIEVEMENTS_PREFIX = 'pouracle_achievements_'
const OFFLINE_QUEUE_KEY = 'pouracle_offline_queue'

export function saveSession(session, player) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player))
  } catch (e) {}
}

export function loadSession() {
  try {
    const session = localStorage.getItem(SESSION_KEY)
    const player = localStorage.getItem(PLAYER_KEY)
    if (session && player) {
      return { session: JSON.parse(session), player: JSON.parse(player) }
    }
  } catch (e) {}
  return null
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(PLAYER_KEY)
  } catch (e) {}
}

export function getUnlockedAchievements(sessionId) {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_PREFIX + sessionId)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function addUnlockedAchievement(sessionId, key) {
  try {
    const existing = getUnlockedAchievements(sessionId)
    if (!existing.includes(key)) {
      localStorage.setItem(ACHIEVEMENTS_PREFIX + sessionId, JSON.stringify([...existing, key]))
    }
  } catch (e) {}
}

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveOfflineQueue(queue) {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
  } catch (e) {}
}

export function clearOfflineQueue() {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY)
  } catch (e) {}
}

export function enqueueOfflineDrink(entry) {
  const queue = getOfflineQueue()
  queue.push({ ...entry, _tempId: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}` })
  saveOfflineQueue(queue)
}

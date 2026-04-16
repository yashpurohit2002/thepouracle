import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { saveSession, loadSession, clearSession as storageClear, getUnlockedAchievements, addUnlockedAchievement, getOfflineQueue, clearOfflineQueue, enqueueOfflineDrink } from '../lib/storage'
import { generateRoomCode } from '../utils/roomCode'
import { checkNewAchievements, ACHIEVEMENTS } from '../utils/achievements'
import { playDrinkLog, playAchievement, playUndo, playJoin } from '../lib/audio'
import { CHALLENGE_MAP } from '../data/challenges'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('home') // 'home' | 'create' | 'join' | 'game'
  const [session, setSession] = useState(null)
  const [player, setPlayer] = useState(null)
  const [players, setPlayers] = useState([])
  const [drinks, setDrinks] = useState([])
  const [achievements, setAchievements] = useState([])
  const [toastQueue, setToastQueue] = useState([]) // Achievement objects to show
  const [undoable, setUndoable] = useState(null)   // { id, expiresAt, timeout }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [paceWarning, setPaceWarning] = useState(false) // true when drinking too fast
  const [prefillJoinCode, setPrefillJoinCode] = useState(null) // from ?join= URL param
  const [challenges, setChallenges] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineQueueCount, setOfflineQueueCount] = useState(() => getOfflineQueue().length)
  const [challengeTarget, setChallengeTarget] = useState(null) // player to challenge (for modal)

  const channelsRef = useRef([])
  const undoTimerRef = useRef(null)
  const paceWarningTimerRef = useRef(null)

  // Check for ?join= URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const joinCode = params.get('join')
    if (joinCode) {
      setPrefillJoinCode(joinCode.toUpperCase())
    }
  }, [])

  // Online/offline tracking
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      flushOfflineQueueRef.current?.()
    }
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const flushOfflineQueueRef = useRef(null)

  // Bootstrap: restore session from localStorage
  useEffect(() => {
    const saved = loadSession()
    if (saved) {
      supabase
        .from('sessions')
        .select('id, room_code, created_at, is_active')
        .eq('id', saved.session.id)
        .eq('is_active', true)
        .single()
        .then(({ data }) => {
          if (data) {
            setSession({ ...saved.session, created_at: data.created_at })
            setPlayer(saved.player)
            setScreen('game')
          } else {
            storageClear()
          }
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // Set up real-time subscriptions when session is active
  useEffect(() => {
    if (!session?.id) return
    loadInitialData(session.id)
    const channels = setupSubscriptions(session.id)
    channelsRef.current = channels
    return () => channels.forEach(ch => supabase.removeChannel(ch))
  }, [session?.id])

  async function loadInitialData(sessionId) {
    const [drinksRes, playersRes, achRes, challengesRes] = await Promise.all([
      supabase.from('drinks').select('*').eq('session_id', sessionId).order('logged_at', { ascending: true }),
      supabase.from('session_players').select('*').eq('session_id', sessionId).order('joined_at', { ascending: true }),
      supabase.from('achievements').select('*').eq('session_id', sessionId),
      supabase.from('challenges').select('*').eq('session_id', sessionId).order('created_at', { ascending: false }),
    ])
    if (drinksRes.data) setDrinks(drinksRes.data)
    if (playersRes.data) setPlayers(playersRes.data)
    if (achRes.data) setAchievements(achRes.data)
    if (challengesRes.data) setChallenges(challengesRes.data)
  }

  function setupSubscriptions(sessionId) {
    const drinksChannel = supabase
      .channel(`drinks:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'drinks',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setDrinks(prev => {
          if (prev.find(d => d.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'drinks',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setDrinks(prev => prev.filter(d => d.id !== payload.old.id))
      })
      .subscribe()

    const playersChannel = supabase
      .channel(`players:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'session_players',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setPlayers(prev => {
          if (prev.find(p => p.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
      })
      .subscribe()

    const achChannel = supabase
      .channel(`achievements:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'achievements',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setAchievements(prev => {
          if (prev.find(a => a.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
        // Queue toast only for achievements earned by this player
        // (other players' achievements appear in timeline but no local toast)
      })
      .subscribe()

    const challengesChannel = supabase
      .channel(`challenges:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'challenges',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setChallenges(prev => {
          if (prev.find(c => c.id === payload.new.id)) return prev
          return [payload.new, ...prev]
        })
        // Haptic if this challenge is incoming to the player
        // (player state not accessible here — handled via derived incomingChallenge)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'challenges',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setChallenges(prev => prev.map(c => c.id === payload.new.id ? payload.new : c))
      })
      .subscribe()

    return [drinksChannel, playersChannel, achChannel, challengesChannel]
  }

  const createSessionFn = useCallback(async (playerName) => {
    setError(null)
    let roomCode = generateRoomCode()
    let attempts = 0

    while (attempts < 5) {
      const { data: sessionData, error: sessionErr } = await supabase
        .from('sessions')
        .insert({ room_code: roomCode, host_name: playerName, is_active: true })
        .select()
        .single()

      if (sessionErr) {
        if (sessionErr.code === '23505') {
          // unique violation — regenerate code
          roomCode = generateRoomCode()
          attempts++
          continue
        }
        throw sessionErr
      }

      const { data: playerData, error: playerErr } = await supabase
        .from('session_players')
        .insert({
          session_id: sessionData.id,
          display_name: playerName,
          is_host: true,
        })
        .select()
        .single()

      if (playerErr) throw playerErr

      const sessionInfo = {
        id: sessionData.id,
        roomCode: sessionData.room_code,
        created_at: sessionData.created_at,
      }
      const playerInfo = {
        id: playerData.id,
        name: playerName,
        isHost: true,
      }

      saveSession(sessionInfo, playerInfo)
      setSession(sessionInfo)
      setPlayer(playerInfo)
      setPlayers([playerData])
      setDrinks([])
      setAchievements([])
      setScreen('game')
      playJoin()
      return
    }
    throw new Error('Could not generate unique room code. Try again.')
  }, [])

  const joinSessionFn = useCallback(async (roomCode, playerName) => {
    setError(null)
    const { data: sessionData, error: sessionErr } = await supabase
      .from('sessions')
      .select('id, room_code, created_at, is_active')
      .eq('room_code', roomCode.trim().toUpperCase())
      .eq('is_active', true)
      .single()

    if (sessionErr || !sessionData) {
      throw new Error('Room not found or session has ended.')
    }

    const { data: playerData, error: playerErr } = await supabase
      .from('session_players')
      .insert({
        session_id: sessionData.id,
        display_name: playerName.trim(),
        is_host: false,
      })
      .select()
      .single()

    if (playerErr) throw playerErr

    const sessionInfo = {
      id: sessionData.id,
      roomCode: sessionData.room_code,
      created_at: sessionData.created_at,
    }
    const playerInfo = {
      id: playerData.id,
      name: playerName.trim(),
      isHost: false,
    }

    saveSession(sessionInfo, playerInfo)
    setSession(sessionInfo)
    setPlayer(playerInfo)
    setScreen('game')
    playJoin()
  }, [])

  const logDrink = useCallback(async ({ drinkType, brand, notes, calories }) => {
    if (!session?.id || !player?.id) return

    const drinkEntry = {
      session_id: session.id,
      player_id: player.id,
      player_name: player.name,
      drink_type: drinkType,
      brand: brand?.trim() || null,
      notes: notes?.trim() || null,
      calories: calories ?? null,
      logged_at: new Date().toISOString(),
    }

    // Offline: queue locally and show optimistic entry
    if (!navigator.onLine) {
      const tempEntry = { ...drinkEntry, id: `temp_${Date.now()}` }
      enqueueOfflineDrink(drinkEntry)
      setOfflineQueueCount(getOfflineQueue().length)
      if (navigator.vibrate) navigator.vibrate(50)
      playDrinkLog()
      setDrinks(prev => [...prev, tempEntry])
      return tempEntry
    }

    const { data, error: err } = await supabase
      .from('drinks')
      .insert(drinkEntry)
      .select()
      .single()

    if (err) throw err

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50)
    playDrinkLog()

    // Optimistically add to local state (dedup handled in subscription handler)
    setDrinks(prev => {
      if (prev.find(d => d.id === data.id)) return prev
      return [...prev, data]
    })

    // Set up undo window (30 seconds)
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    const timer = setTimeout(() => setUndoable(null), 30000)
    undoTimerRef.current = timer
    setUndoable({ id: data.id, expiresAt: Date.now() + 30000 })

    // Pace warning — 4+ alcoholic drinks in the last 60 minutes
    if (data.drink_type !== 'water') {
      const oneHourAgo = Date.now() - 60 * 60 * 1000
      const recentAlcohol = [...drinks, data].filter(
        d => d.player_id === player.id && d.drink_type !== 'water' && new Date(d.logged_at) >= oneHourAgo
      )
      if (recentAlcohol.length >= 4) {
        setPaceWarning(true)
        clearTimeout(paceWarningTimerRef.current)
        paceWarningTimerRef.current = setTimeout(() => setPaceWarning(false), 8000)
      }
    }

    // Check achievements
    const myDrinks = [...drinks.filter(d => d.player_id === player.id), data]
      .sort((a, b) => new Date(a.logged_at) - new Date(b.logged_at))
    const alreadyUnlocked = getUnlockedAchievements(session.id)
    const allPlayers = players
    const newKeys = checkNewAchievements(myDrinks, allPlayers, session, alreadyUnlocked)

    for (const key of newKeys) {
      addUnlockedAchievement(session.id, key)
      // Insert to DB (triggers realtime for timeline display)
      await supabase.from('achievements').insert({
        session_id: session.id,
        player_id: player.id,
        player_name: player.name,
        achievement_key: key,
      })
      // Queue local toast
      setToastQueue(prev => [...prev, ACHIEVEMENTS[key]])
      playAchievement()
      // Confetti on big milestones
      if (key === 'double_digits' || key === 'hat_trick') {
        triggerConfetti()
      }
    }

    return data
  }, [session, player, players, drinks])

  const undoDrink = useCallback(async () => {
    if (!undoable) return
    clearTimeout(undoTimerRef.current)
    const id = undoable.id
    setUndoable(null)
    setDrinks(prev => prev.filter(d => d.id !== id))
    await supabase.from('drinks').delete().eq('id', id)
    playUndo()
    if (navigator.vibrate) navigator.vibrate([30, 30, 30])
  }, [undoable])

  const flushOfflineQueue = useCallback(async () => {
    if (!session?.id || !player?.id) return
    const queue = getOfflineQueue()
    if (queue.length === 0) return
    clearOfflineQueue()
    setOfflineQueueCount(0)
    // Remove temp entries from local state
    setDrinks(prev => prev.filter(d => !String(d.id).startsWith('temp_')))
    // Insert all queued drinks
    const inserts = queue.map(entry => ({
      session_id: entry.session_id,
      player_id: entry.player_id,
      player_name: entry.player_name,
      drink_type: entry.drink_type,
      brand: entry.brand,
      notes: entry.notes,
      calories: entry.calories,
      logged_at: entry.logged_at,
    }))
    await supabase.from('drinks').insert(inserts)
    // Reload drinks to replace temp entries with real ones
    const { data } = await supabase
      .from('drinks')
      .select('*')
      .eq('session_id', session.id)
      .order('logged_at', { ascending: true })
    if (data) setDrinks(data)
  }, [session, player])

  // Wire flush to the ref so the online event handler can call it
  useEffect(() => {
    flushOfflineQueueRef.current = flushOfflineQueue
  }, [flushOfflineQueue])

  const sendChallenge = useCallback(async (toPlayerId, toPlayerName, challengeKey) => {
    if (!session?.id || !player?.id) return
    const def = CHALLENGE_MAP[challengeKey]
    if (!def) throw new Error('Unknown challenge')
    const expiresAt = new Date(Date.now() + 30 * 1000).toISOString() // 30s to accept
    const { error: err } = await supabase.from('challenges').insert({
      session_id: session.id,
      from_player_id: player.id,
      from_player_name: player.name,
      to_player_id: toPlayerId,
      to_player_name: toPlayerName,
      challenge_key: challengeKey,
      status: 'pending',
      expires_at: expiresAt,
    })
    if (err) throw err
    if (navigator.vibrate) navigator.vibrate([30, 50, 30])
  }, [session, player])

  const acceptChallenge = useCallback(async (challengeId) => {
    const { error: err } = await supabase
      .from('challenges')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', challengeId)
    if (err) throw err
    if (navigator.vibrate) navigator.vibrate(80)
  }, [])

  const declineChallenge = useCallback(async (challengeId) => {
    const { error: err } = await supabase
      .from('challenges')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', challengeId)
    if (err) throw err
  }, [])

  const completeChallenge = useCallback(async (challengeId) => {
    const { error: err } = await supabase
      .from('challenges')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', challengeId)
    if (err) throw err
    if (navigator.vibrate) navigator.vibrate([50, 30, 80])
  }, [])

  const forfeitChallenge = useCallback(async (challengeId) => {
    const { error: err } = await supabase
      .from('challenges')
      .update({ status: 'forfeited' })
      .eq('id', challengeId)
    if (err) throw err
  }, [])

  const endSession = useCallback(async () => {
    if (!session?.id) return

    // Award The Closer to the last person who logged a drink
    const myDrinks = drinks.filter(d => d.player_id === player.id)
    if (myDrinks.length > 0) {
      const allSorted = [...drinks].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))
      if (allSorted[0]?.player_id === player.id) {
        const alreadyUnlocked = getUnlockedAchievements(session.id)
        if (!alreadyUnlocked.includes('the_closer')) {
          addUnlockedAchievement(session.id, 'the_closer')
          await supabase.from('achievements').insert({
            session_id: session.id,
            player_id: player.id,
            player_name: player.name,
            achievement_key: 'the_closer',
          })
        }
      }
    }

    await supabase
      .from('sessions')
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq('id', session.id)

    leaveSession()
  }, [session, player, drinks])

  const leaveSession = useCallback(() => {
    clearTimeout(undoTimerRef.current)
    clearTimeout(paceWarningTimerRef.current)
    channelsRef.current.forEach(ch => supabase.removeChannel(ch))
    channelsRef.current = []
    storageClear()
    setSession(null)
    setPlayer(null)
    setPlayers([])
    setDrinks([])
    setAchievements([])
    setChallenges([])
    setToastQueue([])
    setUndoable(null)
    setPaceWarning(false)
    setChallengeTarget(null)
    setScreen('home')
  }, [])

  const dismissToast = useCallback(() => {
    setToastQueue(prev => prev.slice(1))
  }, [])

  function triggerConfetti() {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  // Derived challenge states for the current player
  const incomingChallenge = player
    ? challenges.find(c =>
        c.to_player_id === player.id &&
        c.status === 'pending' &&
        new Date(c.expires_at) > new Date()
      ) || null
    : null

  const activeChallenge = player
    ? challenges.find(c =>
        c.to_player_id === player.id &&
        c.status === 'accepted'
      ) || null
    : null

  const value = {
    screen, setScreen,
    session, player, players, drinks, achievements,
    toastQueue, dismissToast,
    undoable,
    loading, error, setError,
    showConfetti,
    paceWarning,
    dismissPaceWarning: () => setPaceWarning(false),
    prefillJoinCode,
    challenges, incomingChallenge, activeChallenge,
    challengeTarget, setChallengeTarget,
    isOnline, offlineQueueCount,
    createSession: createSessionFn,
    joinSession: joinSessionFn,
    logDrink,
    undoDrink,
    endSession,
    leaveSession,
    sendChallenge,
    acceptChallenge,
    declineChallenge,
    completeChallenge,
    forfeitChallenge,
    flushOfflineQueue,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

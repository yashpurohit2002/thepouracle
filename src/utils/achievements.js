export const ACHIEVEMENTS = {
  first_blood: {
    key: 'first_blood',
    title: 'FIRST BLOOD',
    description: 'Logged your first drink',
    emoji: '🩸',
    color: '#ff2d78',
  },
  the_mixer: {
    key: 'the_mixer',
    title: 'THE MIXER',
    description: '3 different drink types',
    emoji: '🔀',
    color: '#00e5ff',
  },
  one_track_mind: {
    key: 'one_track_mind',
    title: 'ONE TRACK MIND',
    description: '5 same type in a row',
    emoji: '🎯',
    color: '#ffd700',
  },
  speed_demon: {
    key: 'speed_demon',
    title: 'SPEED DEMON',
    description: '2 drinks in 15 minutes',
    emoji: '⚡',
    color: '#ffd700',
  },
  the_connoisseur: {
    key: 'the_connoisseur',
    title: 'THE CONNOISSEUR',
    description: 'Named all your drinks',
    emoji: '🎩',
    color: '#39ff14',
  },
  social_butterfly: {
    key: 'social_butterfly',
    title: 'SOCIAL BUTTERFLY',
    description: '5+ players in session',
    emoji: '🦋',
    color: '#ff2d78',
  },
  marathon_runner: {
    key: 'marathon_runner',
    title: 'MARATHON RUNNER',
    description: '4+ hour session',
    emoji: '🏃',
    color: '#39ff14',
  },
  double_digits: {
    key: 'double_digits',
    title: 'DOUBLE DIGITS',
    description: '10 drinks logged',
    emoji: '💯',
    color: '#ff2d78',
  },
  note_taker: {
    key: 'note_taker',
    title: 'NOTE TAKER',
    description: 'Notes on 3+ drinks',
    emoji: '📝',
    color: '#00e5ff',
  },
  hat_trick: {
    key: 'hat_trick',
    title: 'HAT TRICK',
    description: '3 drinks in 1 hour',
    emoji: '🎩',
    color: '#bf5fff',
  },
  night_owl: {
    key: 'night_owl',
    title: 'NIGHT OWL',
    description: 'Drink after midnight',
    emoji: '🦉',
    color: '#bf5fff',
  },
  the_closer: {
    key: 'the_closer',
    title: 'THE CLOSER',
    description: 'Last drink of the night',
    emoji: '🌙',
    color: '#ffd700',
  },
  hydration_hero: {
    key: 'hydration_hero',
    title: 'HYDRATION HERO',
    description: 'Water logged after 3 drinks',
    emoji: '💧',
    color: '#00e5ff',
  },
}

/**
 * Returns achievement keys that are newly earned (not already unlocked).
 * @param {Array} myDrinks - All drinks for this player, sorted by logged_at ascending
 * @param {Array} allPlayers - All players in session
 * @param {Object} session - { created_at }
 * @param {Array} alreadyUnlocked - Already earned achievement keys
 */
export function checkNewAchievements(myDrinks, allPlayers, session, alreadyUnlocked = []) {
  const earned = []
  // Separate alcoholic drinks from water for achievement logic
  const alcoholDrinks = myDrinks.filter(d => d.drink_type !== 'water')
  const waterDrinks = myDrinks.filter(d => d.drink_type === 'water')

  function check(key, condition) {
    if (!alreadyUnlocked.includes(key) && condition()) {
      earned.push(key)
    }
  }

  // First Blood — first alcoholic drink
  check('first_blood', () => alcoholDrinks.length >= 1)

  // The Mixer — 3 different alcoholic types
  check('the_mixer', () => {
    const types = new Set(alcoholDrinks.map(d => d.drink_type))
    return types.size >= 3
  })

  // One Track Mind — 5 same alcoholic type in a row
  check('one_track_mind', () => {
    if (alcoholDrinks.length < 5) return false
    const last5 = alcoholDrinks.slice(-5)
    return last5.every(d => d.drink_type === last5[0].drink_type)
  })

  // Speed Demon — 2 alcoholic drinks within 15 minutes
  check('speed_demon', () => {
    if (alcoholDrinks.length < 2) return false
    const last = alcoholDrinks[alcoholDrinks.length - 1]
    const prev = alcoholDrinks[alcoholDrinks.length - 2]
    return new Date(last.logged_at) - new Date(prev.logged_at) <= 15 * 60 * 1000
  })

  // The Connoisseur — all alcoholic drinks (min 3) have a brand name
  check('the_connoisseur', () => {
    return alcoholDrinks.length >= 3 && alcoholDrinks.every(d => d.brand && d.brand.trim())
  })

  // Social Butterfly — 5+ players
  check('social_butterfly', () => allPlayers.length >= 5)

  // Double Digits — 10 alcoholic drinks
  check('double_digits', () => alcoholDrinks.length >= 10)

  // Note Taker — notes on 3+ drinks
  check('note_taker', () => {
    return myDrinks.filter(d => d.notes && d.notes.trim()).length >= 3
  })

  // Hat Trick — 3 alcoholic drinks in any 60-minute rolling window
  check('hat_trick', () => {
    if (alcoholDrinks.length < 3) return false
    for (let i = 0; i <= alcoholDrinks.length - 3; i++) {
      const window = alcoholDrinks.slice(i, i + 3)
      const span = new Date(window[2].logged_at) - new Date(window[0].logged_at)
      if (span <= 60 * 60 * 1000) return true
    }
    return false
  })

  // Night Owl — drink after midnight local time
  check('night_owl', () => {
    return alcoholDrinks.some(d => {
      const h = new Date(d.logged_at).getHours()
      return h >= 0 && h < 5
    })
  })

  // Marathon Runner — session running for 4+ hours
  check('marathon_runner', () => {
    if (!session?.created_at) return false
    return Date.now() - new Date(session.created_at).getTime() >= 4 * 60 * 60 * 1000
  })

  // Hydration Hero — logged water after every 3 alcoholic drinks
  check('hydration_hero', () => {
    if (alcoholDrinks.length < 3 || waterDrinks.length < 1) return false
    // Check if there's a water log within 30 min of every 3rd alcoholic drink
    const checkpoints = [3, 6, 9].filter(n => alcoholDrinks.length >= n)
    return checkpoints.some(n => {
      const nthDrink = alcoholDrinks[n - 1]
      return waterDrinks.some(w => {
        const gap = Math.abs(new Date(w.logged_at) - new Date(nthDrink.logged_at))
        return gap <= 30 * 60 * 1000
      })
    })
  })

  return earned
}

import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { DRINK_TYPES, DRINK_MAP, PLAYER_COLORS, ALCOHOLIC_TYPES, drinksPerHour } from '../../constants/drinks'

function StatCard({ label, value, sub, color = '#39ff14' }) {
  return (
    <div className="pixel-border-green p-4" style={{ background: '#050510', borderColor: color, boxShadow: `3px 3px 0 ${color}40` }}>
      <div className="font-pixel text-xs mb-2" style={{ color: '#555577' }}>{label}</div>
      <div className="font-pixel text-xl" style={{ color, textShadow: `0 0 10px ${color}` }}>{value}</div>
      {sub && <div className="font-pixel text-xs mt-1" style={{ color: '#444466' }}>{sub}</div>}
    </div>
  )
}

export default function StatsTab() {
  const { drinks, players, player: me, session } = useApp()

  const stats = useMemo(() => {
    const activeDrinks = drinks
    // Calorie totals (only drinks where calories is known)
    const totalCalories = activeDrinks.reduce((sum, d) => sum + (d.calories || 0), 0)
    const myCalories = activeDrinks
      .filter(d => d.player_id === me?.id)
      .reduce((sum, d) => sum + (d.calories || 0), 0)
    const drinksWithCals = activeDrinks.filter(d => d.calories != null).length

    // Group by player (alcoholic only for pace/leaderboard stats)
    const byPlayer = {}
    players.forEach(p => { byPlayer[p.id] = { name: p.display_name, drinks: [], waterDrinks: [] } })
    activeDrinks.forEach(d => {
      if (!byPlayer[d.player_id]) return
      if (d.drink_type === 'water') byPlayer[d.player_id].waterDrinks.push(d)
      else byPlayer[d.player_id].drinks.push(d)
    })

    // Hydration stats
    const totalWater = activeDrinks.filter(d => d.drink_type === 'water').length
    const totalAlcohol = activeDrinks.filter(d => ALCOHOLIC_TYPES.includes(d.drink_type)).length
    const myWater   = activeDrinks.filter(d => d.player_id === me?.id && d.drink_type === 'water').length
    const myAlcohol = activeDrinks.filter(d => d.player_id === me?.id && ALCOHOLIC_TYPES.includes(d.drink_type)).length

    // Type frequency (group, exclude water from top type)
    const typeCounts = {}
    activeDrinks.forEach(d => {
      typeCounts[d.drink_type] = (typeCounts[d.drink_type] || 0) + 1
    })
    const topType = Object.entries(typeCounts)
      .filter(([k]) => k !== 'water')
      .sort((a, b) => b[1] - a[1])[0]

    // Fastest / slowest (by drinks/hr, alcoholic only)
    const paceMap = Object.values(byPlayer)
      .filter(p => p.drinks.length > 0)
      .map(p => ({
        name: p.name,
        pace: parseFloat(drinksPerHour(p.drinks, session?.created_at)),
        count: p.drinks.length,
      }))
      .filter(p => p.pace > 0)

    const fastest = paceMap.sort((a, b) => b.pace - a.pace)[0]
    const slowest = paceMap.length > 1 ? paceMap[paceMap.length - 1] : null

    // Group pace
    const groupPace = drinksPerHour(activeDrinks, session?.created_at)

    // Session duration
    const sessionMins = session?.created_at
      ? Math.floor((Date.now() - new Date(session.created_at)) / 60000)
      : 0

    // My stats
    const myDrinks = byPlayer[me?.id]?.drinks || []
    const myTypeCounts = {}
    myDrinks.forEach(d => { myTypeCounts[d.drink_type] = (myTypeCounts[d.drink_type] || 0) + 1 })
    const myTopType = Object.entries(myTypeCounts).sort((a, b) => b[1] - a[1])[0]
    const myPace = drinksPerHour(myDrinks, session?.created_at)

    // Avg gap between drinks (group)
    const sorted = [...activeDrinks].sort((a, b) => new Date(a.logged_at) - new Date(b.logged_at))
    let avgGapMins = 0
    if (sorted.length >= 2) {
      const gaps = sorted.slice(1).map((d, i) =>
        (new Date(d.logged_at) - new Date(sorted[i].logged_at)) / 60000
      )
      avgGapMins = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
    }

    return {
      totalDrinks: totalAlcohol,
      totalWater,
      totalAlcohol,
      myWater,
      myAlcohol,
      topType,
      fastest,
      slowest,
      groupPace,
      sessionMins,
      myDrinks,
      myTopType,
      myPace,
      avgGapMins,
      typeCounts,
      totalCalories,
      myCalories,
      drinksWithCals,
    }
  }, [drinks, players, me, session])

  const maxTypeCount = Math.max(...Object.values(stats.typeCounts), 1)

  function formatDuration(mins) {
    if (mins < 60) return `${mins}m`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  return (
    <div className="flex-1 scroll-area h-full">
      <div className="px-5 py-4 space-y-6 pb-8">
        {/* Group stats */}
        <div>
          <div className="font-pixel text-xs neon-cyan mb-4 flex items-center gap-2">
            <span>GROUP STATS</span>
            <div className="flex-1 h-px bg-arcade-border" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard
              label="TOTAL DRINKS"
              value={stats.totalDrinks}
              color="#ff2d78"
            />
            <StatCard
              label="SESSION TIME"
              value={formatDuration(stats.sessionMins)}
              color="#00e5ff"
            />
            <StatCard
              label="GROUP PACE"
              value={`${stats.groupPace}/hr`}
              color="#ffd700"
            />
            <StatCard
              label="AVG GAP"
              value={stats.avgGapMins ? `${stats.avgGapMins}m` : 'N/A'}
              sub="between drinks"
              color="#bf5fff"
            />
            {stats.totalCalories > 0 && (
              <StatCard
                label="GROUP CALS"
                value={`~${stats.totalCalories.toLocaleString()}`}
                sub={`${stats.drinksWithCals}/${stats.totalDrinks} tracked`}
                color="#ff6600"
              />
            )}
            {stats.myCalories > 0 && (
              <StatCard
                label="YOUR CALS"
                value={`~${stats.myCalories.toLocaleString()}`}
                sub="est. total"
                color="#ff6600"
              />
            )}
            {stats.totalWater > 0 && (
              <StatCard
                label="WATERS LOGGED"
                value={`${stats.totalWater}`}
                sub="group total 💧"
                color="#00e5ff"
              />
            )}
            {stats.myWater > 0 && stats.myAlcohol > 0 && (
              <StatCard
                label="HYDRATION RATIO"
                value={`1:${Math.round(stats.myAlcohol / stats.myWater)}`}
                sub={stats.myAlcohol / stats.myWater <= 3 ? '✓ staying hydrated' : '⚠ drink some water'}
                color={stats.myAlcohol / stats.myWater <= 3 ? '#00e5ff' : '#ffd700'}
              />
            )}
          </div>

          {stats.fastest && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard
                label="FASTEST DRINKER"
                value={stats.fastest.name.slice(0, 10)}
                sub={`${stats.fastest.pace}/hr`}
                color="#ff2d78"
              />
              {stats.slowest && (
                <StatCard
                  label="SLOWEST DRINKER"
                  value={stats.slowest.name.slice(0, 10)}
                  sub={`${stats.slowest.pace}/hr`}
                  color="#555577"
                />
              )}
            </div>
          )}

          {/* Drink type breakdown */}
          {stats.totalDrinks > 0 && (
            <div className="pixel-border-cyan p-4" style={{ background: '#050510' }}>
              <div className="font-pixel text-xs text-gray-500 mb-3">DRINK TYPES</div>
              <div className="space-y-2">
                {DRINK_TYPES.filter(t => stats.typeCounts[t.key]).map(type => {
                  const count = stats.typeCounts[type.key] || 0
                  const pct = Math.round((count / maxTypeCount) * 100)
                  return (
                    <div key={type.key} className="flex items-center gap-2">
                      <span className="text-sm w-6 flex-shrink-0">{type.emoji}</span>
                      <div className="flex-1 h-4 bg-arcade-border">
                        <div
                          className="h-full bar-fill"
                          style={{ width: `${pct}%`, background: type.color, boxShadow: `0 0 6px ${type.color}` }}
                        />
                      </div>
                      <span className="font-pixel text-xs flex-shrink-0 w-4 text-right" style={{ color: type.color }}>
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
              {stats.topType && (
                <div className="font-pixel text-xs mt-3" style={{ color: '#444466' }}>
                  TOP: {DRINK_MAP[stats.topType[0]]?.emoji} {DRINK_MAP[stats.topType[0]]?.label} ({stats.topType[1]} drinks)
                </div>
              )}
            </div>
          )}
        </div>

        {/* My stats */}
        <div>
          <div className="font-pixel text-xs neon-green mb-4 flex items-center gap-2">
            <span>YOUR STATS</span>
            <div className="flex-1 h-px bg-arcade-border" />
          </div>

          {stats.myDrinks.length === 0 ? (
            <div className="font-pixel text-xs text-gray-600 text-center py-6">
              LOG A DRINK TO SEE YOUR STATS
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="YOUR COUNT"
                value={stats.myDrinks.length}
                color="#39ff14"
              />
              <StatCard
                label="YOUR PACE"
                value={`${stats.myPace}/hr`}
                color="#39ff14"
              />
              {stats.myTopType && (
                <StatCard
                  label="FAVE DRINK"
                  value={`${DRINK_MAP[stats.myTopType[0]]?.emoji || ''} ${DRINK_MAP[stats.myTopType[0]]?.label || ''}`}
                  sub={`${stats.myTopType[1]}x logged`}
                  color="#ffd700"
                />
              )}
              <StatCard
                label="DRINK RANK"
                value={`#${
                  [...players]
                    .map(p => ({ id: p.id, count: drinks.filter(d => d.player_id === p.id).length }))
                    .sort((a, b) => b.count - a.count)
                    .findIndex(p => p.id === me?.id) + 1
                }`}
                sub={`of ${players.length}`}
                color="#00e5ff"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

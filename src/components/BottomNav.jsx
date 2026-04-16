const TABS = [
  { id: 0, label: 'MY DRINKS', emoji: '🥤' },
  { id: 1, label: 'BOARD',     emoji: '🏆' },
  { id: 2, label: 'TIMELINE',  emoji: '📜' },
  { id: 3, label: 'STATS',     emoji: '📊' },
]

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="game-bottom-nav flex" role="tablist">
      {TABS.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="text-xl mb-1" aria-hidden="true">{tab.emoji}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

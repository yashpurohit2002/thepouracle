import { useState, useRef, useEffect } from 'react'
import { DRINK_TYPES } from '../constants/drinks'
import { useApp } from '../context/AppContext'
import { searchCatalog } from '../data/drinkCatalog'

export default function DrinkForm({ onClose }) {
  const { logDrink } = useApp()
  const [selectedType, setSelectedType] = useState(null)
  const [brand, setBrand] = useState('')
  const [notes, setNotes] = useState('')
  const [calories, setCalories] = useState(null)      // from catalog selection
  const [caloriesOverride, setCaloriesOverride] = useState('')  // manual entry
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const brandRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Update suggestions when type or brand changes
  useEffect(() => {
    const results = searchCatalog(brand, selectedType)
    setSuggestions(results)
  }, [brand, selectedType])

  function handleTypeSelect(key) {
    setSelectedType(key)
    // If user has typed something, re-filter suggestions for new type
    if (brand) {
      const results = searchCatalog(brand, key)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    }
    // Clear catalog selection if type changed
    if (selectedCatalogItem && selectedCatalogItem.type !== key) {
      setSelectedCatalogItem(null)
      setCalories(null)
    }
  }

  function handleBrandChange(e) {
    const val = e.target.value
    setBrand(val)
    setSelectedCatalogItem(null)
    setCalories(null)

    if (val.trim()) {
      const results = searchCatalog(val, selectedType)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } else if (selectedType) {
      // Show top drinks for this type when field is cleared
      const results = searchCatalog('', selectedType)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  function handleBrandFocus() {
    const results = searchCatalog(brand, selectedType)
    if (results.length > 0) {
      setSuggestions(results)
      setShowSuggestions(true)
    }
  }

  function selectSuggestion(item) {
    setBrand(item.name)
    setSelectedCatalogItem(item)
    setCalories(item.calories)
    setCaloriesOverride('')
    // Auto-select drink type if not already selected
    if (!selectedType) setSelectedType(item.type)
    setShowSuggestions(false)
    brandRef.current?.blur()
  }

  function handleCaloriesOverride(e) {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setCaloriesOverride(val)
  }

  function effectiveCalories() {
    if (caloriesOverride) return parseInt(caloriesOverride)
    return calories
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedType) {
      setError('SELECT A DRINK TYPE FIRST!')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await logDrink({
        drinkType: selectedType,
        brand,
        notes,
        calories: effectiveCalories(),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to log drink.')
      setSubmitting(false)
    }
  }

  const drinkTypeDef = DRINK_TYPES.find(t => t.key === selectedType)

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-content">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-arcade-border sticky top-0 bg-arcade-navy z-10">
          <span className="font-pixel text-sm neon-green">LOG A DRINK</span>
          <button
            onClick={onClose}
            className="font-pixel text-xs text-gray-500 hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Drink type grid */}
          <div className="mb-5">
            <div className="font-pixel text-xs text-gray-500 mb-3">WHAT ARE YOU DRINKING?</div>
            <div className="grid grid-cols-3 gap-2">
              {DRINK_TYPES.map(type => (
                <button
                  key={type.key}
                  type="button"
                  className={`drink-type-btn ${selectedType === type.key ? 'selected' : ''}`}
                  onClick={() => handleTypeSelect(type.key)}
                  style={selectedType === type.key
                    ? { borderColor: type.color, boxShadow: `0 0 10px ${type.color}40` }
                    : {}}
                >
                  <span className="text-3xl mb-1" aria-hidden="true">{type.emoji}</span>
                  <span
                    className="font-pixel text-xs"
                    style={{ color: selectedType === type.key ? type.color : '#666688' }}
                  >
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand / name with autocomplete */}
          <div className="mb-4 relative">
            <label className="font-pixel text-xs text-gray-500 block mb-2">
              BRAND / NAME <span style={{ color: '#444466' }}>(OPTIONAL)</span>
            </label>
            <input
              ref={brandRef}
              className="input-arcade"
              type="text"
              placeholder={selectedType ? `Search ${drinkTypeDef?.label.toLowerCase()}s...` : 'e.g. Modelo, White Claw...'}
              value={brand}
              onChange={handleBrandChange}
              onFocus={handleBrandFocus}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              maxLength={60}
              autoComplete="off"
              spellCheck={false}
              disabled={submitting}
            />

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 right-0 z-20 border border-neon-green overflow-hidden"
                style={{ top: '100%', background: '#080818', maxHeight: '220px', overflowY: 'auto' }}
              >
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-arcade-navy border-b border-arcade-border last:border-0"
                    onMouseDown={() => selectSuggestion(item)}
                    onTouchStart={() => selectSuggestion(item)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">
                        {DRINK_TYPES.find(t => t.key === item.type)?.emoji}
                      </span>
                      <span className="font-pixel text-xs text-gray-200 truncate">{item.name}</span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="font-pixel text-xs neon-green">{item.calories} cal</span>
                      {item.abv > 0 && (
                        <span className="font-pixel text-xs text-gray-600 ml-2">{item.abv}%</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calorie display / override */}
          {(calories !== null || brand) && (
            <div className="mb-4">
              <label className="font-pixel text-xs text-gray-500 block mb-2">
                CALORIES <span style={{ color: '#444466' }}>(PER DRINK)</span>
              </label>
              {calories !== null && !caloriesOverride ? (
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 flex items-center gap-2 px-4 py-3 border border-arcade-border"
                    style={{ background: '#080818' }}
                  >
                    <span className="font-pixel text-sm neon-green">{calories}</span>
                    <span className="font-pixel text-xs text-gray-600">cal</span>
                    {selectedCatalogItem?.serving && (
                      <span className="font-pixel text-xs text-gray-600 ml-1">
                        · {selectedCatalogItem.serving}
                      </span>
                    )}
                    {selectedCatalogItem?.abv > 0 && (
                      <span className="font-pixel text-xs text-gray-600 ml-1">
                        · {selectedCatalogItem.abv}% ABV
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="font-pixel text-xs text-gray-600 hover:text-gray-400 px-3 py-3 min-h-[44px]"
                    onClick={() => setCaloriesOverride(String(calories))}
                  >
                    EDIT
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    className="input-arcade flex-1"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 150"
                    value={caloriesOverride}
                    onChange={handleCaloriesOverride}
                    min={0}
                    max={9999}
                    disabled={submitting}
                  />
                  <span className="font-pixel text-xs text-gray-500 flex-shrink-0">cal</span>
                  {calories !== null && (
                    <button
                      type="button"
                      className="font-pixel text-xs text-gray-600 hover:text-gray-400 px-2 py-3 flex-shrink-0 min-h-[44px]"
                      onClick={() => setCaloriesOverride('')}
                    >
                      RESET
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="mb-5">
            <label className="font-pixel text-xs text-gray-500 block mb-2">
              NOTES <span style={{ color: '#444466' }}>(OPTIONAL)</span>
            </label>
            <textarea
              className="input-arcade resize-none"
              rows={2}
              placeholder="e.g. this one was strong, found on floor..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              maxLength={120}
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="font-pixel text-xs neon-pink mb-4 animate-bounce-in">
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-arcade btn-green text-sm py-5 w-full"
            disabled={submitting || !selectedType}
          >
            {submitting ? (
              <span className="loading-dots">LOGGING<span>.</span><span>.</span><span>.</span></span>
            ) : (
              <>
                {drinkTypeDef
                  ? `▶ LOG ${drinkTypeDef.emoji} ${drinkTypeDef.label}`
                  : '▶ LOG DRINK'}
                {effectiveCalories() != null && (
                  <span className="ml-2 text-xs" style={{ color: '#39ff1480' }}>
                    ~{effectiveCalories()} cal
                  </span>
                )}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

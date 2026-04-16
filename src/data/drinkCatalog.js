// Comprehensive drink catalog with calorie estimates per standard serving
// calories = per standard serving (beer=12oz, wine=5oz, shot=1.5oz, cocktail=varies, seltzer=12oz)

export const DRINK_CATALOG = [
  // ─── BEERS ────────────────────────────────────────────────────────────────
  { name: 'Modelo Especial',         type: 'beer', calories: 144, abv: 4.4, serving: '12 oz' },
  { name: 'Modelo Negra',            type: 'beer', calories: 172, abv: 5.4, serving: '12 oz' },
  { name: 'Corona Extra',            type: 'beer', calories: 148, abv: 4.6, serving: '12 oz' },
  { name: 'Corona Light',            type: 'beer', calories: 99,  abv: 4.1, serving: '12 oz' },
  { name: 'Pacifico',                type: 'beer', calories: 145, abv: 4.4, serving: '12 oz' },
  { name: 'Tecate',                  type: 'beer', calories: 136, abv: 4.5, serving: '12 oz' },
  { name: 'Dos Equis Lager',         type: 'beer', calories: 130, abv: 4.2, serving: '12 oz' },
  { name: 'Dos Equis Amber',         type: 'beer', calories: 145, abv: 4.7, serving: '12 oz' },
  { name: 'Bud Light',               type: 'beer', calories: 110, abv: 4.2, serving: '12 oz' },
  { name: 'Budweiser',               type: 'beer', calories: 145, abv: 5.0, serving: '12 oz' },
  { name: 'Coors Light',             type: 'beer', calories: 102, abv: 4.2, serving: '12 oz' },
  { name: 'Coors Banquet',           type: 'beer', calories: 149, abv: 5.0, serving: '12 oz' },
  { name: 'Miller Lite',             type: 'beer', calories: 96,  abv: 4.2, serving: '12 oz' },
  { name: 'Miller High Life',        type: 'beer', calories: 141, abv: 4.6, serving: '12 oz' },
  { name: 'Michelob Ultra',          type: 'beer', calories: 95,  abv: 4.2, serving: '12 oz' },
  { name: 'Pabst Blue Ribbon (PBR)', type: 'beer', calories: 144, abv: 4.7, serving: '12 oz' },
  { name: 'Natty Light',             type: 'beer', calories: 95,  abv: 4.2, serving: '12 oz' },
  { name: 'Keystone Light',          type: 'beer', calories: 104, abv: 4.1, serving: '12 oz' },
  { name: 'Heineken',                type: 'beer', calories: 142, abv: 5.0, serving: '12 oz' },
  { name: 'Heineken 0.0',            type: 'beer', calories: 69,  abv: 0.0, serving: '12 oz' },
  { name: 'Stella Artois',           type: 'beer', calories: 153, abv: 5.2, serving: '12 oz' },
  { name: 'Guinness Draught',        type: 'beer', calories: 125, abv: 4.2, serving: '12 oz' },
  { name: 'Yuengling Lager',         type: 'beer', calories: 135, abv: 4.4, serving: '12 oz' },
  { name: 'Blue Moon',               type: 'beer', calories: 168, abv: 5.4, serving: '12 oz' },
  { name: 'Sam Adams Boston Lager',  type: 'beer', calories: 180, abv: 5.0, serving: '12 oz' },
  { name: 'Shiner Bock',             type: 'beer', calories: 149, abv: 4.4, serving: '12 oz' },
  { name: 'Firestone 805',           type: 'beer', calories: 155, abv: 4.7, serving: '12 oz' },
  { name: 'Lagunitas IPA',           type: 'beer', calories: 191, abv: 6.2, serving: '12 oz' },
  { name: 'Dogfish Head 60 Min IPA', type: 'beer', calories: 230, abv: 6.0, serving: '12 oz' },
  { name: 'Stone IPA',               type: 'beer', calories: 235, abv: 6.9, serving: '12 oz' },
  { name: 'Sierra Nevada Pale Ale',  type: 'beer', calories: 175, abv: 5.6, serving: '12 oz' },
  { name: 'Goose Island IPA',        type: 'beer', calories: 195, abv: 5.9, serving: '12 oz' },
  { name: 'New Belgium Fat Tire',    type: 'beer', calories: 165, abv: 5.2, serving: '12 oz' },
  { name: 'Angry Orchard Crisp Apple', type: 'beer', calories: 190, abv: 5.0, serving: '12 oz' },

  // ─── RED WINE (5 oz glass) ────────────────────────────────────────────────
  { name: 'Red Wine',                type: 'wine', calories: 125, abv: 13.5, serving: '5 oz' },
  { name: 'Cabernet Sauvignon',      type: 'wine', calories: 130, abv: 14.0, serving: '5 oz' },
  { name: 'Merlot',                  type: 'wine', calories: 122, abv: 13.5, serving: '5 oz' },
  { name: 'Pinot Noir',              type: 'wine', calories: 120, abv: 13.0, serving: '5 oz' },
  { name: 'Syrah / Shiraz',          type: 'wine', calories: 128, abv: 14.0, serving: '5 oz' },
  { name: 'Malbec',                  type: 'wine', calories: 135, abv: 14.5, serving: '5 oz' },
  { name: 'Zinfandel',               type: 'wine', calories: 135, abv: 15.0, serving: '5 oz' },
  { name: 'Red Blend',               type: 'wine', calories: 125, abv: 13.5, serving: '5 oz' },

  // ─── WHITE WINE (5 oz glass) ─────────────────────────────────────────────
  { name: 'White Wine',              type: 'wine', calories: 120, abv: 12.5, serving: '5 oz' },
  { name: 'Chardonnay',              type: 'wine', calories: 123, abv: 13.5, serving: '5 oz' },
  { name: 'Sauvignon Blanc',         type: 'wine', calories: 118, abv: 12.5, serving: '5 oz' },
  { name: 'Pinot Grigio',            type: 'wine', calories: 115, abv: 12.0, serving: '5 oz' },
  { name: 'Riesling',                type: 'wine', calories: 120, abv: 10.0, serving: '5 oz' },
  { name: 'Moscato',                 type: 'wine', calories: 130, abv: 9.0,  serving: '5 oz' },
  { name: 'Prosecco',                type: 'wine', calories: 98,  abv: 11.0, serving: '5 oz' },
  { name: 'Champagne',               type: 'wine', calories: 95,  abv: 12.0, serving: '5 oz' },
  { name: 'Rosé',                    type: 'wine', calories: 115, abv: 12.5, serving: '5 oz' },
  { name: 'White Zinfandel',         type: 'wine', calories: 120, abv: 9.0,  serving: '5 oz' },

  // ─── SHOTS (1.5 oz) ──────────────────────────────────────────────────────
  { name: 'Vodka',                   type: 'shot', calories: 97,  abv: 40.0, serving: '1.5 oz' },
  { name: 'Tequila',                 type: 'shot', calories: 97,  abv: 40.0, serving: '1.5 oz' },
  { name: 'Patron Silver',           type: 'shot', calories: 97,  abv: 40.0, serving: '1.5 oz' },
  { name: 'Don Julio Blanco',        type: 'shot', calories: 97,  abv: 40.0, serving: '1.5 oz' },
  { name: 'Casamigos Blanco',        type: 'shot', calories: 97,  abv: 40.0, serving: '1.5 oz' },
  { name: 'Whiskey / Bourbon',       type: 'shot', calories: 105, abv: 40.0, serving: '1.5 oz' },
  { name: 'Jack Daniel\'s',          type: 'shot', calories: 105, abv: 40.0, serving: '1.5 oz' },
  { name: 'Jameson Irish Whiskey',   type: 'shot', calories: 104, abv: 40.0, serving: '1.5 oz' },
  { name: 'Maker\'s Mark',           type: 'shot', calories: 110, abv: 45.0, serving: '1.5 oz' },
  { name: 'Bulleit Bourbon',         type: 'shot', calories: 105, abv: 45.0, serving: '1.5 oz' },
  { name: 'Rum',                     type: 'shot', calories: 97,  abv: 40.0, serving: '1.5 oz' },
  { name: 'Gin',                     type: 'shot', calories: 97,  abv: 40.0, serving: '1.5 oz' },
  { name: 'Fireball',                type: 'shot', calories: 108, abv: 33.0, serving: '1.5 oz' },
  { name: 'Jägermeister',            type: 'shot', calories: 103, abv: 35.0, serving: '1.5 oz' },
  { name: 'Malört',                  type: 'shot', calories: 97,  abv: 35.0, serving: '1.5 oz' },
  { name: 'Lemon Drop',              type: 'shot', calories: 125, abv: 30.0, serving: '1.5 oz' },
  { name: 'Kamikaze',                type: 'shot', calories: 120, abv: 30.0, serving: '1.5 oz' },

  // ─── COCKTAILS ────────────────────────────────────────────────────────────
  { name: 'Vodka Soda',              type: 'cocktail', calories: 100, abv: 12.0, serving: '6 oz' },
  { name: 'Vodka Cran',              type: 'cocktail', calories: 175, abv: 10.0, serving: '6 oz' },
  { name: 'Gin & Tonic',             type: 'cocktail', calories: 175, abv: 12.0, serving: '6 oz' },
  { name: 'Rum & Coke',              type: 'cocktail', calories: 185, abv: 10.0, serving: '6 oz' },
  { name: 'Whiskey Sour',            type: 'cocktail', calories: 210, abv: 14.0, serving: '6 oz' },
  { name: 'Old Fashioned',           type: 'cocktail', calories: 160, abv: 32.0, serving: '3 oz' },
  { name: 'Margarita',               type: 'cocktail', calories: 270, abv: 15.0, serving: '8 oz' },
  { name: 'Paloma',                  type: 'cocktail', calories: 170, abv: 12.0, serving: '8 oz' },
  { name: 'Mojito',                  type: 'cocktail', calories: 200, abv: 10.0, serving: '8 oz' },
  { name: 'Moscow Mule',             type: 'cocktail', calories: 180, abv: 10.0, serving: '8 oz' },
  { name: 'Aperol Spritz',           type: 'cocktail', calories: 150, abv: 9.0,  serving: '8 oz' },
  { name: 'Negroni',                 type: 'cocktail', calories: 200, abv: 24.0, serving: '4 oz' },
  { name: 'Cosmopolitan',            type: 'cocktail', calories: 220, abv: 20.0, serving: '5 oz' },
  { name: 'Long Island Iced Tea',    type: 'cocktail', calories: 280, abv: 22.0, serving: '8 oz' },
  { name: 'Mimosa',                  type: 'cocktail', calories: 100, abv: 8.0,  serving: '6 oz' },
  { name: 'Bloody Mary',             type: 'cocktail', calories: 150, abv: 10.0, serving: '8 oz' },
  { name: 'Piña Colada',             type: 'cocktail', calories: 450, abv: 12.0, serving: '8 oz' },
  { name: 'Sex on the Beach',        type: 'cocktail', calories: 250, abv: 10.0, serving: '8 oz' },
  { name: 'Sangria',                 type: 'cocktail', calories: 165, abv: 10.0, serving: '8 oz' },
  { name: 'Jungle Juice',            type: 'cocktail', calories: 220, abv: 12.0, serving: '8 oz' },
  { name: 'Hard Lemonade (homemade)',type: 'cocktail', calories: 190, abv: 8.0,  serving: '8 oz' },

  // ─── HARD SELTZERS ───────────────────────────────────────────────────────
  { name: 'White Claw (any)',        type: 'hard_seltzer', calories: 100, abv: 5.0, serving: '12 oz' },
  { name: 'White Claw Black Cherry', type: 'hard_seltzer', calories: 100, abv: 5.0, serving: '12 oz' },
  { name: 'White Claw Mango',        type: 'hard_seltzer', calories: 100, abv: 5.0, serving: '12 oz' },
  { name: 'White Claw Watermelon',   type: 'hard_seltzer', calories: 100, abv: 5.0, serving: '12 oz' },
  { name: 'Truly Hard Seltzer',      type: 'hard_seltzer', calories: 100, abv: 5.0, serving: '12 oz' },
  { name: 'Truly Lemonade',          type: 'hard_seltzer', calories: 110, abv: 5.0, serving: '12 oz' },
  { name: 'Surfside Iced Tea + Vodka',   type: 'hard_seltzer', calories: 99,  abv: 4.6, serving: '12 oz' },
  { name: 'Surfside Lemonade + Vodka',   type: 'hard_seltzer', calories: 99,  abv: 4.6, serving: '12 oz' },
  { name: 'Surfside Peach Tea + Vodka',  type: 'hard_seltzer', calories: 99,  abv: 4.6, serving: '12 oz' },
  { name: 'High Noon Sun Sips',      type: 'hard_seltzer', calories: 100, abv: 4.5, serving: '12 oz' },
  { name: 'High Noon Peach',         type: 'hard_seltzer', calories: 100, abv: 4.5, serving: '12 oz' },
  { name: 'High Noon Watermelon',    type: 'hard_seltzer', calories: 100, abv: 4.5, serving: '12 oz' },
  { name: 'Vizzy Hard Seltzer',      type: 'hard_seltzer', calories: 100, abv: 5.0, serving: '12 oz' },
  { name: 'Bud Light Seltzer',       type: 'hard_seltzer', calories: 100, abv: 5.0, serving: '12 oz' },
  { name: 'Corona Hard Seltzer',     type: 'hard_seltzer', calories: 90,  abv: 4.5, serving: '12 oz' },
  { name: 'Twisted Tea',             type: 'hard_seltzer', calories: 194, abv: 5.0, serving: '12 oz' },
  { name: 'Twisted Tea Light',       type: 'hard_seltzer', calories: 109, abv: 4.0, serving: '12 oz' },
  { name: 'Mike\'s Hard Lemonade',   type: 'hard_seltzer', calories: 220, abv: 5.0, serving: '12 oz' },
  { name: 'Smirnoff Ice',            type: 'hard_seltzer', calories: 228, abv: 5.0, serving: '12 oz' },
  { name: 'Cutwater Margarita',      type: 'hard_seltzer', calories: 160, abv: 7.0, serving: '12 oz' },
  { name: 'Cutwater Vodka Soda',     type: 'hard_seltzer', calories: 100, abv: 5.9, serving: '12 oz' },
  { name: 'Liquid Death (water)',    type: 'hard_seltzer', calories: 0,   abv: 0.0, serving: '16 oz' },
]

/**
 * Search the catalog by query string, optionally filtered by drink type.
 * Returns top 8 matches.
 */
export function searchCatalog(query, drinkType = null) {
  const q = query.trim().toLowerCase()
  if (!q) {
    // No query — show all for the selected type (or nothing)
    if (!drinkType) return []
    return DRINK_CATALOG.filter(d => d.type === drinkType).slice(0, 8)
  }

  return DRINK_CATALOG
    .filter(d => {
      const matchesType = !drinkType || d.type === drinkType
      const matchesQuery = d.name.toLowerCase().includes(q)
      return matchesType && matchesQuery
    })
    .slice(0, 8)
}

/**
 * Exact lookup by name (case-insensitive).
 */
export function lookupDrink(name) {
  const n = name.trim().toLowerCase()
  return DRINK_CATALOG.find(d => d.name.toLowerCase() === n) || null
}

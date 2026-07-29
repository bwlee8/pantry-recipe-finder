const DAY_MS = 24 * 60 * 60 * 1000

// Rolling windows rather than calendar-aligned periods — simpler and avoids
// timezone/month-length edge cases for what's just a personal cooking log.
export const statsPeriods = [
  { id: 'week', label: 'This week', days: 7 },
  { id: 'month', label: 'This month', days: 30 },
  { id: 'year', label: 'This year', days: 365 },
  { id: 'all', label: 'All time', days: null },
]

export function filterByPeriod(cookLog, days) {
  if (days == null) return cookLog
  const cutoff = Date.now() - days * DAY_MS
  return cookLog.filter((entry) => new Date(entry.cookedAt).getTime() >= cutoff)
}

export function getTopRecipe(entries) {
  const counts = new Map()
  entries.forEach((entry) => {
    counts.set(entry.recipeName, (counts.get(entry.recipeName) ?? 0) + 1)
  })
  let top = null
  counts.forEach((count, name) => {
    if (!top || count > top.count) top = { name, count }
  })
  return top
}

export function getTopIngredient(entries, formatIngredientLabel) {
  const counts = new Map()
  entries.forEach((entry) => {
    entry.ingredientKeys.forEach((key) => {
      counts.set(key, (counts.get(key) ?? 0) + 1)
    })
  })
  let top = null
  counts.forEach((count, key) => {
    if (!top || count > top.count) top = { key, count }
  })
  return top ? { label: formatIngredientLabel(top.key), count: top.count } : null
}

export function getRecipeLeaderboard(cookLog) {
  const counts = new Map()
  cookLog.forEach((entry) => {
    counts.set(entry.recipeName, (counts.get(entry.recipeName) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

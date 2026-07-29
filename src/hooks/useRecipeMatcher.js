import { useMemo } from 'react'

// Scores each recipe by how many of its ingredients are in `selectedIngredients`.
// Returns only recipes with at least one match, sorted best-match first.
// Pass onlyFullMatches: true to keep just the recipes you can make right now.
export function useRecipeMatcher(recipes, selectedIngredients, { onlyFullMatches = false } = {}) {
  return useMemo(() => {
    if (selectedIngredients.size === 0) return []

    const scored = recipes
      .map((recipe) => {
        const matched = recipe.ingredients.filter((ingredient) => selectedIngredients.has(ingredient.key))
        const missing = recipe.ingredients.filter((ingredient) => !selectedIngredients.has(ingredient.key))
        return {
          recipe,
          matchedCount: matched.length,
          totalCount: recipe.ingredients.length,
          missing,
          matchPercent: matched.length / recipe.ingredients.length,
        }
      })
      .filter((entry) => entry.matchedCount > 0)
      .filter((entry) => !onlyFullMatches || entry.missing.length === 0)

    scored.sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent
      if (b.matchedCount !== a.matchedCount) return b.matchedCount - a.matchedCount
      return a.recipe.name.localeCompare(b.recipe.name)
    })

    return scored
  }, [recipes, selectedIngredients, onlyFullMatches])
}

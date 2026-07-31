import { useMemo } from 'react'

// Scores each recipe by how many of its ingredients are in `selectedIngredients`.
// With nothing selected, every recipe is returned (score 0) so the box lists
// the whole library; once ingredients are picked, only recipes with at least
// one match remain, sorted best-match first. Full-match-only and other
// display filters are applied downstream so the underlying list (and the
// filter controls themselves) stay available even when a filter zeroes out
// what's shown.
export function useRecipeMatcher(recipes, selectedIngredients) {
  return useMemo(() => {
    const hasSelection = selectedIngredients.size > 0

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
      .filter((entry) => !hasSelection || entry.matchedCount > 0)

    scored.sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent
      if (b.matchedCount !== a.matchedCount) return b.matchedCount - a.matchedCount
      return a.recipe.name.localeCompare(b.recipe.name)
    })

    return scored
  }, [recipes, selectedIngredients])
}

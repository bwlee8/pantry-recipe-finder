import RecipeCard from './RecipeCard.jsx'

export default function RecipeBox({
  matches,
  selectedCount,
  onlyFullMatches,
  onToggleOnlyFullMatches,
  selectedMatchId,
  onSelectMatch,
  onToggleIngredient,
  cookLog,
  onMarkCooked,
}) {
  const orderedMatches = selectedMatchId
    ? [...matches].sort((a, b) => {
        if (a.recipe.id === selectedMatchId) return -1
        if (b.recipe.id === selectedMatchId) return 1
        return 0
      })
    : matches

  return (
    <section className="recipe-box" aria-label="Matching recipes">
      <div className="recipe-box__header">
        <div>
          <p className="eyebrow">The Recipe Box</p>
          <h2>What can you make?</h2>
        </div>
        <label className="only-full-matches">
          <input
            type="checkbox"
            checked={onlyFullMatches}
            onChange={(event) => onToggleOnlyFullMatches(event.target.checked)}
          />
          Only show what I can fully make
        </label>
      </div>

      {selectedCount === 0 && (
        <p className="empty-state">Select a few ingredients from your pantry to see what you can cook.</p>
      )}

      {selectedCount > 0 && matches.length === 0 && (
        <p className="empty-state">
          No recipes match yet — try adding a few more common ingredients, like onion or garlic.
        </p>
      )}

      {matches.length > 0 && (
        <div className="recipe-grid">
          {orderedMatches.map(({ recipe, matchedCount, totalCount, missing }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              matchedCount={matchedCount}
              totalCount={totalCount}
              missing={missing}
              isSelected={recipe.id === selectedMatchId}
              onSelect={onSelectMatch}
              onToggleIngredient={onToggleIngredient}
              cookCount={cookLog.filter((entry) => entry.recipeId === recipe.id).length}
              onMarkCooked={onMarkCooked}
            />
          ))}
        </div>
      )}
    </section>
  )
}

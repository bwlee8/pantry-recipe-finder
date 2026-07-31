import RecipeCard from './RecipeCard.jsx'
import RecipeModal from './RecipeModal.jsx'

export default function RecipeBox({
  matches,
  filteredMatches,
  selectedCount,
  onlyFullMatches,
  selectedMatchId,
  onSelectMatch,
  onToggleIngredient,
  cookLog,
  onMarkCooked,
  favoriteIds,
  onToggleFavorite,
}) {
  const selectedMatch = matches.find(({ recipe }) => recipe.id === selectedMatchId) ?? null

  return (
    <>
      <div className="recipe-box__header">
        <div>
          <p className="eyebrow">The Recipe Box</p>
          <h2>What can you make?</h2>
        </div>
      </div>

      <section className="recipe-box" aria-label="Matching recipes">
        {filteredMatches.length === 0 && (
          <p className="empty-state">
            {onlyFullMatches
              ? 'Nothing you can fully make yet — uncheck the box above or select a few more ingredients.'
              : matches.length > 0
                ? 'No recipes match your filters — try widening them.'
                : selectedCount === 0
                  ? 'No recipes in the box yet — add one from the Recipes tab.'
                  : 'No recipes match yet — try adding a few more common ingredients, like onion or garlic.'}
          </p>
        )}

        {filteredMatches.length > 0 && (
          <div className="recipe-grid">
            {filteredMatches.map(({ recipe, matchedCount, totalCount, missing }) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                matchedCount={matchedCount}
                totalCount={totalCount}
                missing={missing}
                isSelected={recipe.id === selectedMatchId}
                onSelect={onSelectMatch}
                onToggleIngredient={onToggleIngredient}
                isFavorited={favoriteIds.has(recipe.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {selectedMatch && (
          <RecipeModal
            recipe={selectedMatch.recipe}
            matchedCount={selectedMatch.matchedCount}
            totalCount={selectedMatch.totalCount}
            missing={selectedMatch.missing}
            cookCount={cookLog.filter((entry) => entry.recipeId === selectedMatch.recipe.id).length}
            onClose={() => onSelectMatch(selectedMatch.recipe.id)}
            onToggleIngredient={onToggleIngredient}
            onMarkCooked={onMarkCooked}
            isFavorited={favoriteIds.has(selectedMatch.recipe.id)}
            onToggleFavorite={() => onToggleFavorite(selectedMatch.recipe.id)}
          />
        )}
      </section>
    </>
  )
}

import { formatIngredientLabel } from '../data/recipes.js'
import FavoriteButton from './FavoriteButton.jsx'

export default function RecipeCard({
  recipe,
  matchedCount,
  totalCount,
  missing,
  isSelected,
  onSelect,
  onToggleIngredient,
  isFavorited,
  onToggleFavorite,
}) {
  const isFullMatch = missing.length === 0
  const missingSet = new Set(missing.map((ingredient) => ingredient.key))

  function handleIngredientClick(event, key) {
    event.stopPropagation()
    onToggleIngredient(key)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(recipe.id)
    }
  }

  return (
    <article
      className="recipe-card"
      data-selected={isSelected ? 'true' : 'false'}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(recipe.id)}
      onKeyDown={handleKeyDown}
    >
      {recipe.image ? (
        <img className="recipe-card__image" src={recipe.image} alt="" loading="lazy" />
      ) : (
        <span className="recipe-card__image-placeholder">No photo yet</span>
      )}

      <div className="recipe-card__body">
        <div className="recipe-card__name-row">
          <h3 className="recipe-card__name">{recipe.name}</h3>
          <FavoriteButton isFavorited={isFavorited} onToggle={() => onToggleFavorite(recipe.id)} label={recipe.name} />
        </div>
        <p className="recipe-card__submeta">
          {recipe.time} min &middot; serves {recipe.servings}
        </p>

        <p className="recipe-card__meta">
          {matchedCount}/{totalCount} matched &middot; {isFullMatch ? 'Ready to cook' : `Needs ${missing.length} more`}
        </p>

        <div className="recipe-card__ingredients">
          {recipe.ingredients.map((ingredient) => (
            <button
              key={ingredient.key}
              type="button"
              className="recipe-card__ingredient"
              data-matched={missingSet.has(ingredient.key) ? 'false' : 'true'}
              onClick={(event) => handleIngredientClick(event, ingredient.key)}
            >
              {formatIngredientLabel(ingredient.key)}
              {ingredient.amount && <span className="recipe-card__amount"> · {ingredient.amount}</span>}
            </button>
          ))}
        </div>

        <details className="recipe-card__steps" onClick={(event) => event.stopPropagation()}>
          <summary>Steps</summary>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </details>
      </div>
    </article>
  )
}

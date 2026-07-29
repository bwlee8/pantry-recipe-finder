import { formatIngredientLabel } from '../data/recipes.js'

export default function RecipeCard({
  recipe,
  matchedCount,
  totalCount,
  missing,
  isSelected,
  onSelect,
  onToggleIngredient,
  cookCount,
  onMarkCooked,
}) {
  const isFullMatch = missing.length === 0
  const missingSet = new Set(missing.map((ingredient) => ingredient.key))

  function handleIngredientClick(event, key) {
    event.stopPropagation()
    onToggleIngredient(key)
  }

  function handleMarkCooked(event) {
    event.stopPropagation()
    onMarkCooked(recipe)
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
        <h3 className="recipe-card__name">{recipe.name}</h3>
        <p className="recipe-card__submeta">
          {recipe.time} min &middot; serves {recipe.servings}
        </p>

        <p className="recipe-card__meta">
          {matchedCount}/{totalCount} matched &middot; {isFullMatch ? 'Ready to cook' : `Needs ${missing.length} more`}
        </p>

        {isSelected && (
          <div className="recipe-card__cook-row">
            <button type="button" className="recipe-card__mark-cooked" onClick={handleMarkCooked}>
              I just cooked this
            </button>
            <span className="recipe-card__cook-count">
              {cookCount === 0 ? 'Not cooked yet' : `Cooked ${cookCount} time${cookCount === 1 ? '' : 's'}`}
            </span>
          </div>
        )}

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

        {isSelected ? (
          <div className="recipe-card__steps">
            <p className="recipe-card__steps-title">Steps</p>
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        ) : (
          <details className="recipe-card__steps" onClick={(event) => event.stopPropagation()}>
            <summary>Steps</summary>
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </details>
        )}

        {isSelected && (
          <p className="recipe-card__source">
            {recipe.link ? (
              <a
                className="recipe-source-link"
                href={recipe.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                View original recipe
              </a>
            ) : (
              <span className="recipe-source-link recipe-source-link--none">View original recipe</span>
            )}
          </p>
        )}
      </div>
    </article>
  )
}

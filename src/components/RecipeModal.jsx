import { createPortal } from 'react-dom'
import { formatIngredientLabel } from '../data/recipes.js'
import FavoriteButton from './FavoriteButton.jsx'

export default function RecipeModal({
  recipe,
  matchedCount,
  totalCount,
  missing,
  cookCount,
  onClose,
  onToggleIngredient,
  onMarkCooked,
  isFavorited,
  onToggleFavorite,
}) {
  const missingSet = new Set(missing.map((ingredient) => ingredient.key))
  const isFullMatch = missing.length === 0

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--recipe"
        role="dialog"
        aria-modal="true"
        aria-label={recipe.name}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div className="modal__header-title">
            <h3>{recipe.name}</h3>
            <FavoriteButton isFavorited={isFavorited} onToggle={onToggleFavorite} label={recipe.name} />
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {recipe.image ? (
          <img className="recipe-detail__image" src={recipe.image} alt="" />
        ) : (
          <span className="recipe-detail__image-placeholder">No photo yet</span>
        )}

        <p className="recipe-detail__meta">
          {recipe.time} min &middot; serves {recipe.servings} &middot; {matchedCount}/{totalCount} matched &middot;{' '}
          {isFullMatch ? 'Ready to cook' : `Needs ${missing.length} more`}
        </p>

        <div className="recipe-detail__cook-row">
          <button type="button" className="recipe-detail__mark-cooked" onClick={() => onMarkCooked(recipe)}>
            I just cooked this
          </button>
          <span className="recipe-detail__cook-count">
            {cookCount === 0 ? 'Not cooked yet' : `Cooked ${cookCount} time${cookCount === 1 ? '' : 's'}`}
          </span>
        </div>

        <p className="recipe-detail__section-title">Ingredients</p>
        <div className="recipe-card__ingredients">
          {recipe.ingredients.map((ingredient) => (
            <button
              key={ingredient.key}
              type="button"
              className="recipe-card__ingredient"
              data-matched={missingSet.has(ingredient.key) ? 'false' : 'true'}
              onClick={() => onToggleIngredient(ingredient.key)}
            >
              {formatIngredientLabel(ingredient.key)}
              {ingredient.amount && <span className="recipe-card__amount"> · {ingredient.amount}</span>}
            </button>
          ))}
        </div>

        <p className="recipe-detail__section-title">Steps</p>
        <ol className="recipe-detail__steps">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <p className="recipe-detail__source">
          {recipe.link ? (
            <a className="recipe-source-link" href={recipe.link} target="_blank" rel="noopener noreferrer">
              View original recipe
            </a>
          ) : (
            <span className="recipe-source-link recipe-source-link--none">View original recipe</span>
          )}
        </p>
      </div>
    </div>,
    document.body,
  )
}

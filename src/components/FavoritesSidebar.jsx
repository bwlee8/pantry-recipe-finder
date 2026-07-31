import FavoriteButton from './FavoriteButton.jsx'

export default function FavoritesSidebar({ recipes, selectedRecipeId, onSelectRecipe, onToggleFavorite }) {
  return (
    <div className="pantry-panel__content">
      <div className="pantry-panel__header">
        <p className="eyebrow">The Recipe Library</p>
        <h2>Favorites</h2>
      </div>

      <p className="recipe-library__subtitle">
        {recipes.length === 0 ? 'No favorites yet' : `${recipes.length} favorite${recipes.length === 1 ? '' : 's'}`}
      </p>

      {recipes.length === 0 ? (
        <p className="ingredient-list__empty">Tap the heart on any recipe to save it here.</p>
      ) : (
        <ul className="recipe-name-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-name-list__item">
              <button
                type="button"
                className="recipe-name-list__button"
                data-active={selectedRecipeId === recipe.id ? 'true' : 'false'}
                onClick={() => onSelectRecipe(recipe.id)}
              >
                {recipe.name}
              </button>
              <FavoriteButton
                variant="sidebar"
                isFavorited
                onToggle={() => onToggleFavorite(recipe.id)}
                label={recipe.name}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

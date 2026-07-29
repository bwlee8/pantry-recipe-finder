import { formatIngredientLabel } from '../data/recipes.js'

export default function RecipeDetail({ recipe, cookCount, onMarkCooked }) {
  return (
    <section className="recipe-box" aria-label="Recipe detail">
      <div className="recipe-box__header">
        <div>
          <p className="eyebrow">The Recipe Library</p>
          <h2>Recipe details</h2>
        </div>
      </div>

      {!recipe && (
        <p className="empty-state">Pick a recipe from the list on the left to see it here.</p>
      )}

      {recipe && (
        <article className="recipe-detail">
          {recipe.image ? (
            <img className="recipe-detail__image" src={recipe.image} alt="" />
          ) : (
            <span className="recipe-detail__image-placeholder">No photo yet</span>
          )}
          <div className="recipe-detail__body">
            <h3 className="recipe-detail__name">{recipe.name}</h3>
            <p className="recipe-detail__meta">
              {recipe.category} &middot; {recipe.time} min &middot; serves {recipe.servings}
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
            <ul className="recipe-detail__ingredients">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.key}>
                  {formatIngredientLabel(ingredient.key)}
                  {ingredient.amount && <span className="recipe-detail__amount"> · {ingredient.amount}</span>}
                </li>
              ))}
            </ul>

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
        </article>
      )}
    </section>
  )
}

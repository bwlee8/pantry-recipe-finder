import { useState } from 'react'
import AddRecipeForm from './AddRecipeForm.jsx'
import RestoreModal from './RestoreModal.jsx'
import { recipeCategoryOrder } from '../data/recipes.js'

export default function RecipeLibrary({
  recipes,
  selectedRecipeId,
  onSelectRecipe,
  removedCount,
  hiddenRecipes,
  onRemoveRecipe,
  onRestoreHidden,
  onRestoreOneRecipe,
  onAddRecipe,
}) {
  const [openCategories, setOpenCategories] = useState(() => new Set(['Snacks & Sides', 'Coffee']))
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)

  function toggleCategory(category) {
    setOpenCategories((current) => {
      const next = new Set(current)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  function removeRecipe(id) {
    if (id === selectedRecipeId) {
      onSelectRecipe(null)
    }
    onRemoveRecipe(id)
  }

  function addRecipe(recipe) {
    onAddRecipe(recipe)
    setIsAdding(false)
  }

  const categorized = recipeCategoryOrder
    .map((category) => ({
      category,
      items: recipes.filter((recipe) => recipe.category === category),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="pantry-panel__content">
      <div className="pantry-panel__header">
        <p className="eyebrow">The Recipe Library</p>
        <h2>Browse recipes</h2>
        <div className="pantry-panel__actions">
          {removedCount > 0 && (
            <button type="button" className="text-button" onClick={() => setIsRestoreOpen(true)}>
              Restore hidden ({removedCount})
            </button>
          )}
        </div>
      </div>

      {isRestoreOpen && (
        <RestoreModal
          title="Hidden recipes"
          items={hiddenRecipes.map((recipe) => ({ id: recipe.id, label: recipe.name }))}
          onRestoreOne={onRestoreOneRecipe}
          onRestoreAll={() => {
            onRestoreHidden()
            setIsRestoreOpen(false)
          }}
          onClose={() => setIsRestoreOpen(false)}
        />
      )}

      <p className="recipe-library__subtitle">{recipes.length} recipes, grouped by category</p>

      <div className="ingredient-categories">
        {categorized.length === 0 && (
          <p className="ingredient-list__empty">No recipes in the library yet.</p>
        )}
        {categorized.map(({ category, items }) => {
          const isOpen = openCategories.has(category)
          return (
            <div className="ingredient-category" key={category}>
              <button
                type="button"
                className="ingredient-category__header"
                aria-expanded={isOpen}
                onClick={() => toggleCategory(category)}
              >
                <span className="ingredient-category__chevron" data-open={isOpen ? 'true' : 'false'}>
                  ▸
                </span>
                <span className="ingredient-category__name">{category}</span>
                <span className="ingredient-category__count">{items.length}</span>
              </button>
              <div className="collapsible" data-open={isOpen ? 'true' : 'false'}>
                <div className="collapsible__inner">
                  <ul className="recipe-name-list">
                    {items.map((recipe) => (
                      <li key={recipe.id} className="recipe-name-list__item">
                        <button
                          type="button"
                          className="recipe-name-list__button"
                          data-active={selectedRecipeId === recipe.id ? 'true' : 'false'}
                          onClick={() => onSelectRecipe(recipe.id)}
                        >
                          {recipe.name}
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            className="recipe-name-list__remove"
                            onClick={() => removeRecipe(recipe.id)}
                            aria-label={`Remove ${recipe.name} from the recipe library`}
                            title={`Remove ${recipe.name}`}
                          >
                            ×
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {isAdding ? (
        <AddRecipeForm onAdd={addRecipe} onCancel={() => setIsAdding(false)} />
      ) : (
        <div className="pantry-panel__footer-row">
          <button
            type="button"
            className="text-button pantry-panel__edit-toggle"
            onClick={() => setIsAdding(true)}
          >
            <span className="pantry-panel__add-toggle-plus">+</span> Add a recipe
          </button>
          <button type="button" className="text-button pantry-panel__edit-toggle" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? 'Done editing' : 'Edit'}
          </button>
        </div>
      )}
    </div>
  )
}

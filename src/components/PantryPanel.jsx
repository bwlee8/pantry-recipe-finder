import { useState } from 'react'
import IngredientTag from './IngredientTag.jsx'
import AddIngredientForm from './AddIngredientForm.jsx'
import RestoreModal from './RestoreModal.jsx'
import { ingredientCategoryOrder } from '../data/recipes.js'

export default function PantryPanel({
  ingredients,
  selectedIngredients,
  searchTerm,
  onSearchTermChange,
  onToggleIngredient,
  onRemoveIngredient,
  onAddIngredient,
  onClearSelected,
  removedCount,
  hiddenIngredients,
  onRestoreHidden,
  onRestoreOneIngredient,
}) {
  const [openCategories, setOpenCategories] = useState(() => new Set(ingredientCategoryOrder))
  const [isEditing, setIsEditing] = useState(false)
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

  const isSearching = searchTerm.trim() !== ''
  const visibleIngredients = ingredients.filter((ingredient) =>
    ingredient.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const existingKeys = new Set(ingredients.map((ingredient) => ingredient.key))

  const categorized = ingredientCategoryOrder
    .map((category) => ({
      category,
      items: visibleIngredients.filter((ingredient) => ingredient.category === category),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="pantry-panel__content">
      <div className="pantry-panel__header">
        <p className="eyebrow">The Pantry</p>
        <h2>What do you have?</h2>
        <div className="pantry-panel__actions">
          {selectedIngredients.size > 0 && (
            <button type="button" className="text-button" onClick={onClearSelected}>
              Clear selected ({selectedIngredients.size})
            </button>
          )}
          {removedCount > 0 && (
            <button type="button" className="text-button" onClick={() => setIsRestoreOpen(true)}>
              Restore hidden ({removedCount})
            </button>
          )}
        </div>
      </div>

      {isRestoreOpen && (
        <RestoreModal
          title="Hidden ingredients"
          items={hiddenIngredients.map((ingredient) => ({ id: ingredient.key, label: ingredient.label }))}
          onRestoreOne={onRestoreOneIngredient}
          onRestoreAll={() => {
            onRestoreHidden()
            setIsRestoreOpen(false)
          }}
          onClose={() => setIsRestoreOpen(false)}
        />
      )}

      <input
        type="search"
        className="pantry-panel__search"
        placeholder="Search ingredients…"
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
        aria-label="Search ingredients"
      />

      <div className="ingredient-categories">
        {categorized.length === 0 && (
          <p className="ingredient-list__empty">No ingredients match "{searchTerm}".</p>
        )}
        {categorized.map(({ category, items }) => {
          const isOpen = isSearching || openCategories.has(category)
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
              {isOpen && (
                <div className="ingredient-list">
                  {items.map((ingredient) => (
                    <IngredientTag
                      key={ingredient.key}
                      label={ingredient.label}
                      selected={selectedIngredients.has(ingredient.key)}
                      editable={isEditing}
                      onToggle={() => onToggleIngredient(ingredient.key)}
                      onRemove={() => onRemoveIngredient(ingredient.key)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button type="button" className="text-button pantry-panel__edit-toggle" onClick={() => setIsEditing((current) => !current)}>
        {isEditing ? 'Done editing' : 'Edit'}
      </button>

      <AddIngredientForm existingKeys={existingKeys} onAdd={onAddIngredient} />
    </div>
  )
}

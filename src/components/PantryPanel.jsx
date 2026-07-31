import { useState } from 'react'
import IngredientTag from './IngredientTag.jsx'
import AddIngredientForm from './AddIngredientForm.jsx'
import RestoreModal from './RestoreModal.jsx'
import RecipeFilters from './RecipeFilters.jsx'
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
  showFilters,
  filtersProps,
}) {
  const [openCategories, setOpenCategories] = useState(() => new Set(['Protein']))
  const [isEditing, setIsEditing] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)

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

  function addIngredient(key) {
    onAddIngredient(key)
    setIsAdding(false)
  }

  return (
    <div className="pantry-panel__content">
      <div className="pantry-panel__header">
        <p className="eyebrow">The Pantry</p>
        <h2>What do you have?</h2>
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

      {showFilters && (
        <div className="pantry-panel__filters-section">
          <button
            type="button"
            className="ingredient-category__header"
            aria-expanded={isFiltersOpen}
            onClick={() => setIsFiltersOpen((current) => !current)}
          >
            <span className="ingredient-category__chevron" data-open={isFiltersOpen ? 'true' : 'false'}>
              ▸
            </span>
            <span className="ingredient-category__name">Filters</span>
          </button>
          <div className="collapsible" data-open={isFiltersOpen ? 'true' : 'false'}>
            <div className="collapsible__inner">
              <RecipeFilters {...filtersProps} />
            </div>
          </div>
        </div>
      )}

      <input
        type="search"
        className="pantry-panel__search"
        placeholder="Search ingredients…"
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
        aria-label="Search ingredients"
      />

      {selectedIngredients.size > 0 && (
        <button type="button" className="text-button pantry-panel__edit-toggle" onClick={onClearSelected}>
          Clear selected ingredients ({selectedIngredients.size})
        </button>
      )}

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
              <div className="collapsible" data-open={isOpen ? 'true' : 'false'}>
                <div className="collapsible__inner">
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
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {isAdding ? (
        <AddIngredientForm existingKeys={existingKeys} onAdd={addIngredient} onCancel={() => setIsAdding(false)} />
      ) : (
        <div className="pantry-panel__footer-row">
          <button
            type="button"
            className="text-button pantry-panel__edit-toggle"
            onClick={() => setIsAdding(true)}
          >
            <span className="pantry-panel__add-toggle-plus">+</span> Add an ingredient
          </button>
          <button
            type="button"
            className="text-button pantry-panel__edit-toggle"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? 'Done editing' : 'Edit'}
          </button>
        </div>
      )}
    </div>
  )
}

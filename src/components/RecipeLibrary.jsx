import { useMemo, useState } from 'react'
import AddRecipeForm from './AddRecipeForm.jsx'
import RestoreModal from './RestoreModal.jsx'
import RecipeFilters from './RecipeFilters.jsx'
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
  cookLog,
}) {
  const [openCategories, setOpenCategories] = useState(() => new Set(recipeCategoryOrder))
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)

  const timeBounds = useMemo(() => {
    if (recipes.length === 0) return { min: 0, max: 0 }
    const times = recipes.map((recipe) => recipe.time)
    return { min: Math.min(...times), max: Math.max(...times) }
  }, [recipes])

  const [selectedCategories, setSelectedCategories] = useState(() => new Set())
  const [selectedServingSizes, setSelectedServingSizes] = useState(() => new Set())
  const [timeLimit, setTimeLimit] = useState(() => timeBounds.max)
  const [sortBy, setSortBy] = useState('default')

  const cookCounts = useMemo(() => {
    const counts = new Map()
    cookLog.forEach((entry) => {
      counts.set(entry.recipeId, (counts.get(entry.recipeId) ?? 0) + 1)
    })
    return counts
  }, [cookLog])

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

  function toggleCategoryFilter(category) {
    setSelectedCategories((current) => {
      const next = new Set(current)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  function toggleServingSizeFilter(size) {
    setSelectedServingSizes((current) => {
      const next = new Set(current)
      if (next.has(size)) {
        next.delete(size)
      } else {
        next.add(size)
      }
      return next
    })
  }

  function clearFilters() {
    setSelectedCategories(new Set())
    setSelectedServingSizes(new Set())
    setTimeLimit(timeBounds.max)
    setSortBy('default')
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

  function sortItems(items) {
    if (sortBy === 'default') return items
    const sorted = [...items]
    if (sortBy === 'mostCooked') {
      sorted.sort((a, b) => (cookCounts.get(b.id) ?? 0) - (cookCounts.get(a.id) ?? 0))
    } else if (sortBy === 'leastCooked') {
      sorted.sort((a, b) => (cookCounts.get(a.id) ?? 0) - (cookCounts.get(b.id) ?? 0))
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
    }
    return sorted
  }

  const availableCategories = recipeCategoryOrder.filter((category) =>
    recipes.some((recipe) => recipe.category === category),
  )
  const availableServingSizes = useMemo(
    () => Array.from(new Set(recipes.map((recipe) => recipe.servings))).sort((a, b) => a - b),
    [recipes],
  )

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(recipe.category)) return false
      if (selectedServingSizes.size > 0 && !selectedServingSizes.has(recipe.servings)) return false
      if (recipe.time > timeLimit) return false
      return true
    })
  }, [recipes, selectedCategories, selectedServingSizes, timeLimit])

  const hasActiveFilters =
    selectedCategories.size > 0 ||
    selectedServingSizes.size > 0 ||
    timeLimit < timeBounds.max ||
    sortBy !== 'default'

  const categorized = recipeCategoryOrder
    .map((category) => ({
      category,
      items: sortItems(filteredRecipes.filter((recipe) => recipe.category === category)),
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

      <p className="recipe-library__subtitle">
        {filteredRecipes.length === recipes.length
          ? `${recipes.length} recipes, grouped by category`
          : `${filteredRecipes.length} of ${recipes.length} recipes match your filters`}
      </p>

      <RecipeFilters
        categories={availableCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategoryFilter}
        servingSizes={availableServingSizes}
        selectedServingSizes={selectedServingSizes}
        onToggleServingSize={toggleServingSizeFilter}
        timeBounds={timeBounds}
        timeLimit={timeLimit}
        onTimeLimitChange={setTimeLimit}
        sortBy={sortBy}
        onSortChange={setSortBy}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <div className="ingredient-categories">
        {categorized.length === 0 && (
          <p className="ingredient-list__empty">No recipes match your filters.</p>
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
              {isOpen && (
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
              )}
            </div>
          )
        })}
      </div>

      <button type="button" className="text-button pantry-panel__edit-toggle" onClick={() => setIsEditing((current) => !current)}>
        {isEditing ? 'Done editing' : 'Edit'}
      </button>

      {isAdding ? (
        <AddRecipeForm onAdd={addRecipe} onCancel={() => setIsAdding(false)} />
      ) : (
        <button type="button" className="text-button pantry-panel__edit-toggle" onClick={() => setIsAdding(true)}>
          + Add a recipe
        </button>
      )}
    </div>
  )
}

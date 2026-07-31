import { useMemo, useState } from 'react'
import {
  recipes as builtInRecipes,
  getAllIngredientKeys,
  formatIngredientLabel,
  getIngredientCategory,
  recipeCategoryOrder,
  cuisineOrder,
} from './data/recipes.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useRecipeMatcher } from './hooks/useRecipeMatcher.js'
import SidebarTabs from './components/SidebarTabs.jsx'
import RecipeBox from './components/RecipeBox.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import StatsDashboard from './components/StatsDashboard.jsx'

export default function App() {
  const [customIngredientKeys, setCustomIngredientKeys] = useLocalStorage('pantry:customIngredients', [])
  const [selectedKeys, setSelectedKeys] = useLocalStorage('pantry:selected', [])
  const [removedKeys, setRemovedKeys] = useLocalStorage('pantry:removed', [])
  const [customRecipes, setCustomRecipes] = useLocalStorage('pantry:customRecipes', [])
  const [removedRecipeIds, setRemovedRecipeIds] = useLocalStorage('pantry:removedRecipes', [])
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useLocalStorage('pantry:favorites', [])
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyFullMatches, setOnlyFullMatches] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('ingredients')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [selectedMatchId, setSelectedMatchId] = useState(null)
  const [cookLog, setCookLog] = useLocalStorage('pantry:cookLog', [])
  const [section, setSection] = useLocalStorage('pantry:section', 'food')

  const allRecipes = useMemo(() => [...builtInRecipes, ...customRecipes], [customRecipes])
  const recipes = useMemo(
    () => allRecipes.filter((recipe) => !removedRecipeIds.includes(recipe.id) && recipe.type === section),
    [allRecipes, removedRecipeIds, section],
  )
  const hiddenRecipes = useMemo(
    () => allRecipes.filter((recipe) => removedRecipeIds.includes(recipe.id) && recipe.type === section),
    [allRecipes, removedRecipeIds, section],
  )

  const allIngredientEntries = useMemo(() => {
    const baseIngredientKeys = getAllIngredientKeys(recipes)
    const allKeys = Array.from(new Set([...baseIngredientKeys, ...customIngredientKeys])).sort()
    return allKeys.map((key) => ({ key, label: formatIngredientLabel(key), category: getIngredientCategory(key) }))
  }, [recipes, customIngredientKeys])

  const ingredients = useMemo(
    () => allIngredientEntries.filter((ingredient) => !removedKeys.includes(ingredient.key)),
    [allIngredientEntries, removedKeys],
  )
  const hiddenIngredients = useMemo(
    () => allIngredientEntries.filter((ingredient) => removedKeys.includes(ingredient.key)),
    [allIngredientEntries, removedKeys],
  )

  const selectedIngredients = useMemo(() => new Set(selectedKeys), [selectedKeys])
  const favoriteIds = useMemo(() => new Set(favoriteRecipeIds), [favoriteRecipeIds])
  const favoriteRecipes = useMemo(
    () => recipes.filter((recipe) => favoriteIds.has(recipe.id)),
    [recipes, favoriteIds],
  )

  const matches = useRecipeMatcher(recipes, selectedIngredients)

  const [selectedCategories, setSelectedCategories] = useState(() => new Set())
  const [selectedServingSizes, setSelectedServingSizes] = useState(() => new Set())
  const [selectedCuisines, setSelectedCuisines] = useState(() => new Set())
  const [sortBy, setSortBy] = useState('default')

  const timeBounds = useMemo(() => {
    if (matches.length === 0) return { min: 0, max: 0 }
    const times = matches.map(({ recipe }) => recipe.time)
    return { min: Math.min(...times), max: Math.max(...times) }
  }, [matches])

  // `null` means "no limit set" — it tracks timeBounds.max automatically,
  // including right after switching sections, without needing to know the
  // new section's max synchronously at the moment of the switch.
  const [timeLimitOverride, setTimeLimitOverride] = useState(null)
  const timeLimit = timeLimitOverride ?? timeBounds.max

  const cookCounts = useMemo(() => {
    const counts = new Map()
    cookLog.forEach((entry) => {
      counts.set(entry.recipeId, (counts.get(entry.recipeId) ?? 0) + 1)
    })
    return counts
  }, [cookLog])

  // Each facet's options are computed from the OTHER active facets (not itself),
  // so picking a category narrows which serving sizes are still reachable and
  // vice versa, without a facet's own selection making its chip disappear.
  const reachableByOtherFilters = useMemo(() => {
    return matches.filter(({ recipe, missing }) => {
      if (onlyFullMatches && missing.length > 0) return false
      if (recipe.time > timeLimit) return false
      return true
    })
  }, [matches, onlyFullMatches, timeLimit])

  const availableCategories = useMemo(() => {
    const reachable = new Set(
      reachableByOtherFilters
        .filter(({ recipe }) => selectedServingSizes.size === 0 || selectedServingSizes.has(recipe.servings))
        .filter(({ recipe }) => selectedCuisines.size === 0 || selectedCuisines.has(recipe.cuisine))
        .map(({ recipe }) => recipe.category),
    )
    selectedCategories.forEach((category) => reachable.add(category))
    return recipeCategoryOrder.filter((category) => reachable.has(category))
  }, [reachableByOtherFilters, selectedServingSizes, selectedCuisines, selectedCategories])

  const availableServingSizes = useMemo(() => {
    const reachable = new Set(
      reachableByOtherFilters
        .filter(({ recipe }) => selectedCategories.size === 0 || selectedCategories.has(recipe.category))
        .filter(({ recipe }) => selectedCuisines.size === 0 || selectedCuisines.has(recipe.cuisine))
        .map(({ recipe }) => recipe.servings),
    )
    selectedServingSizes.forEach((size) => reachable.add(size))
    return Array.from(reachable).sort((a, b) => a - b)
  }, [reachableByOtherFilters, selectedCategories, selectedCuisines, selectedServingSizes])

  const availableCuisines = useMemo(() => {
    const reachable = new Set(
      reachableByOtherFilters
        .filter(({ recipe }) => selectedCategories.size === 0 || selectedCategories.has(recipe.category))
        .filter(({ recipe }) => selectedServingSizes.size === 0 || selectedServingSizes.has(recipe.servings))
        .map(({ recipe }) => recipe.cuisine)
        .filter(Boolean),
    )
    selectedCuisines.forEach((cuisine) => reachable.add(cuisine))
    return cuisineOrder.filter((cuisine) => reachable.has(cuisine))
  }, [reachableByOtherFilters, selectedCategories, selectedServingSizes, selectedCuisines])

  const filteredMatches = useMemo(() => {
    const filtered = matches.filter(({ recipe, missing }) => {
      if (onlyFullMatches && missing.length > 0) return false
      if (selectedCategories.size > 0 && !selectedCategories.has(recipe.category)) return false
      if (selectedServingSizes.size > 0 && !selectedServingSizes.has(recipe.servings)) return false
      if (selectedCuisines.size > 0 && !selectedCuisines.has(recipe.cuisine)) return false
      if (recipe.time > timeLimit) return false
      return true
    })
    if (sortBy === 'default') return filtered
    const sorted = [...filtered]
    if (sortBy === 'mostCooked') {
      sorted.sort((a, b) => (cookCounts.get(b.recipe.id) ?? 0) - (cookCounts.get(a.recipe.id) ?? 0))
    } else if (sortBy === 'leastCooked') {
      sorted.sort((a, b) => (cookCounts.get(a.recipe.id) ?? 0) - (cookCounts.get(b.recipe.id) ?? 0))
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.recipe.createdAt ?? 0) - new Date(a.recipe.createdAt ?? 0))
    }
    return sorted
  }, [matches, onlyFullMatches, selectedCategories, selectedServingSizes, selectedCuisines, timeLimit, sortBy, cookCounts])

  const hasActiveFilters =
    selectedCategories.size > 0 ||
    selectedServingSizes.size > 0 ||
    selectedCuisines.size > 0 ||
    timeLimitOverride !== null ||
    sortBy !== 'default'

  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) ?? null

  const selectedRecipeCookCount = selectedRecipe
    ? cookLog.filter((entry) => entry.recipeId === selectedRecipe.id).length
    : 0

  function toggleIngredient(key) {
    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    )
  }

  function addIngredient(key) {
    setCustomIngredientKeys((current) => (current.includes(key) ? current : [...current, key]))
    // Adding an ingredient un-hides it too, in case it was previously removed.
    setRemovedKeys((current) => current.filter((k) => k !== key))
    // Assume you're adding it because you have it — select it right away.
    setSelectedKeys((current) => (current.includes(key) ? current : [...current, key]))
  }

  function removeIngredient(key) {
    setRemovedKeys((current) => (current.includes(key) ? current : [...current, key]))
    setSelectedKeys((current) => current.filter((k) => k !== key))
  }

  function restoreHiddenIngredients() {
    setRemovedKeys([])
  }

  function restoreOneIngredient(key) {
    setRemovedKeys((current) => current.filter((k) => k !== key))
  }

  function clearSelected() {
    setSelectedKeys([])
  }

  function addRecipe(recipe) {
    setCustomRecipes((current) => [...current, recipe])
  }

  function removeRecipe(id) {
    setRemovedRecipeIds((current) => (current.includes(id) ? current : [...current, id]))
  }

  function restoreHiddenRecipes() {
    setRemovedRecipeIds([])
  }

  function restoreOneRecipe(id) {
    setRemovedRecipeIds((current) => current.filter((rid) => rid !== id))
  }

  function toggleFavorite(id) {
    setFavoriteRecipeIds((current) =>
      current.includes(id) ? current.filter((rid) => rid !== id) : [...current, id],
    )
  }

  function selectMatch(id) {
    setSelectedMatchId((current) => (current === id ? null : id))
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

  function toggleCuisineFilter(cuisine) {
    setSelectedCuisines((current) => {
      const next = new Set(current)
      if (next.has(cuisine)) {
        next.delete(cuisine)
      } else {
        next.add(cuisine)
      }
      return next
    })
  }

  function clearFilters() {
    setSelectedCategories(new Set())
    setSelectedServingSizes(new Set())
    setSelectedCuisines(new Set())
    setTimeLimitOverride(null)
    setSortBy('default')
  }

  function changeSection(nextSection) {
    if (nextSection === section) return
    setSection(nextSection)
    // Food and drinks are different enough that carrying selections across
    // the switch would just be confusing — start the new section clean.
    setSelectedKeys([])
    setSelectedRecipeId(null)
    setSelectedMatchId(null)
    setSearchTerm('')
    setOnlyFullMatches(false)
    clearFilters()
  }

  function markCooked(recipe) {
    setCookLog((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        recipeId: recipe.id,
        recipeName: recipe.name,
        ingredientKeys: recipe.ingredients.map((ingredient) => ingredient.key),
        cookedAt: new Date().toISOString(),
      },
    ])
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>The Pantry</h1>
        <p className="app-header__subtitle">
          {section === 'food'
            ? `${recipes.length} recipes on the shelf · select ingredients to see what's ready to cook`
            : `${recipes.length} drinks on the menu · select ingredients to see what's ready to make`}
        </p>
      </header>

      <main className="layout">
        <SidebarTabs
          activeTab={sidebarTab}
          section={section}
          onSectionChange={changeSection}
          onTabChange={setSidebarTab}
          recipeLibraryProps={{
            recipes,
            selectedRecipeId,
            onSelectRecipe: setSelectedRecipeId,
            removedCount: removedRecipeIds.length,
            hiddenRecipes,
            onRemoveRecipe: removeRecipe,
            onRestoreHidden: restoreHiddenRecipes,
            onRestoreOneRecipe: restoreOneRecipe,
            onAddRecipe: addRecipe,
          }}
          favoritesSidebarProps={{
            recipes: favoriteRecipes,
            selectedRecipeId,
            onSelectRecipe: setSelectedRecipeId,
            onToggleFavorite: toggleFavorite,
          }}
          pantryPanelProps={{
            ingredients,
            selectedIngredients,
            searchTerm,
            onSearchTermChange: setSearchTerm,
            onToggleIngredient: toggleIngredient,
            onRemoveIngredient: removeIngredient,
            onAddIngredient: addIngredient,
            onClearSelected: clearSelected,
            removedCount: removedKeys.length,
            hiddenIngredients,
            onRestoreHidden: restoreHiddenIngredients,
            onRestoreOneIngredient: restoreOneIngredient,
            showFilters: matches.length > 0,
            filtersProps: {
              cuisines: availableCuisines,
              selectedCuisines,
              onToggleCuisine: toggleCuisineFilter,
              categories: availableCategories,
              selectedCategories,
              onToggleCategory: toggleCategoryFilter,
              servingSizes: availableServingSizes,
              selectedServingSizes,
              onToggleServingSize: toggleServingSizeFilter,
              timeBounds,
              timeLimit,
              onTimeLimitChange: setTimeLimitOverride,
              sortBy,
              onSortChange: setSortBy,
              hasActiveFilters,
              onClearFilters: clearFilters,
              onlyFullMatches,
              onToggleOnlyFullMatches: setOnlyFullMatches,
            },
          }}
          statsProps={{ cookLog }}
        />
        {(sidebarTab === 'recipes' || sidebarTab === 'favorites') && (
          <RecipeDetail
            recipe={selectedRecipe}
            cookCount={selectedRecipeCookCount}
            onMarkCooked={markCooked}
            isFavorited={selectedRecipe ? favoriteIds.has(selectedRecipe.id) : false}
            onToggleFavorite={() => selectedRecipe && toggleFavorite(selectedRecipe.id)}
          />
        )}
        {sidebarTab === 'stats' && <StatsDashboard cookLog={cookLog} />}
        {sidebarTab === 'ingredients' && (
          <RecipeBox
            matches={matches}
            filteredMatches={filteredMatches}
            selectedCount={selectedIngredients.size}
            onlyFullMatches={onlyFullMatches}
            selectedMatchId={selectedMatchId}
            onSelectMatch={selectMatch}
            onToggleIngredient={toggleIngredient}
            cookLog={cookLog}
            onMarkCooked={markCooked}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
  )
}

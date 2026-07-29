import { useMemo, useState } from 'react'
import {
  recipes as builtInRecipes,
  getAllIngredientKeys,
  formatIngredientLabel,
  getIngredientCategory,
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
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyFullMatches, setOnlyFullMatches] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('ingredients')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [selectedMatchId, setSelectedMatchId] = useState(null)
  const [cookLog, setCookLog] = useLocalStorage('pantry:cookLog', [])

  const allRecipes = useMemo(() => [...builtInRecipes, ...customRecipes], [customRecipes])
  const recipes = useMemo(
    () => allRecipes.filter((recipe) => !removedRecipeIds.includes(recipe.id)),
    [allRecipes, removedRecipeIds],
  )
  const hiddenRecipes = useMemo(
    () => allRecipes.filter((recipe) => removedRecipeIds.includes(recipe.id)),
    [allRecipes, removedRecipeIds],
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

  const matches = useRecipeMatcher(recipes, selectedIngredients, { onlyFullMatches })

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

  function selectMatch(id) {
    setSelectedMatchId((current) => (current === id ? null : id))
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
        <p className="eyebrow">Cook with what you've got</p>
        <h1>The Pantry</h1>
        <p className="app-header__subtitle">
          {recipes.length} recipes on the shelf &middot; select ingredients to see what's ready to cook
        </p>
      </header>

      <main className="layout">
        <SidebarTabs
          activeTab={sidebarTab}
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
            cookLog,
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
          }}
          statsProps={{ cookLog }}
        />
        {sidebarTab === 'recipes' && (
          <RecipeDetail
            recipe={selectedRecipe}
            cookCount={selectedRecipeCookCount}
            onMarkCooked={markCooked}
          />
        )}
        {sidebarTab === 'stats' && <StatsDashboard cookLog={cookLog} />}
        {sidebarTab === 'ingredients' && (
          <RecipeBox
            matches={matches}
            selectedCount={selectedIngredients.size}
            onlyFullMatches={onlyFullMatches}
            onToggleOnlyFullMatches={setOnlyFullMatches}
            selectedMatchId={selectedMatchId}
            onSelectMatch={selectMatch}
            onToggleIngredient={toggleIngredient}
            cookLog={cookLog}
            onMarkCooked={markCooked}
          />
        )}
      </main>
    </div>
  )
}

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server (usually http://localhost:5173)
npm run build   # production build
npm run preview # preview the production build locally
```

There is no test suite, linter, or type checker configured in this project.

## Architecture

React + Vite single-page app. All state lives in `App.jsx`; everything else is a pure function or presentational component fed by props — there's no context, router, or backend.

- **`src/data/recipes.js`** — the recipe dataset and the source of truth for what ingredients exist. Each recipe has `id`, `name`, `time`, `servings`, an `ingredients` array, and a `steps` array. Ingredient keys are lowercase strings (e.g. `"bell pepper"`); two ingredients match only when their keys are identical, so adding a new ingredient only matters once some recipe's `ingredients` array actually lists that key. Also exports `getAllIngredientKeys` and `formatIngredientLabel`, used to build the master ingredient list and display labels.
- **`src/hooks/useRecipeMatcher.js`** — given the recipe list and the set of selected ingredient keys, scores each recipe by `matchedCount`/`matchPercent`, drops recipes with zero overlap, optionally filters to only recipes with no missing ingredients (`onlyFullMatches`), and sorts best-match first (percent, then count, then name).
- **`src/hooks/useLocalStorage.js`** — generic `useState`-like hook that persists to `localStorage`, with try/catch fallbacks for private-browsing or storage-full cases. `App.jsx` uses it for three separate keys: `pantry:customIngredients`, `pantry:selected`, `pantry:removed`.
- **`src/App.jsx`** — owns all state (selected ingredients, custom/added ingredients, hidden/removed ingredients, search term, "only full matches" toggle) and derives the visible ingredient list and recipe matches with `useMemo`. Ingredients typed into the "add" form are added to `customIngredientKeys` *and* auto-selected *and* un-hidden if previously removed.
- **`src/components/`** — `PantryPanel` (ingredient list, search, add form) and `RecipeBox` (matched recipe grid) are the two halves of the layout; `IngredientTag` and `RecipeCard` are their building blocks. Components are presentational — all mutation happens via callbacks passed down from `App.jsx`.

To grow the app, the main lever is `src/data/recipes.js`: add a recipe, and any new ingredient it introduces automatically becomes selectable.

# The Pantry — recipe finder

A small React + Vite app: pick the ingredients you have, and it shows you which
recipes you can make (or almost make) right now.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## How it works

- **`src/data/recipes.js`** — the recipe dataset. Each recipe is just a name,
  time, servings, an `ingredients` array (lowercase strings), and a `steps`
  array. **Add your own recipes here** — that's the main way to grow the app.
- **`src/hooks/useRecipeMatcher.js`** — scores every recipe by how many of its
  ingredients you've selected, filters out recipes with zero overlap, and
  sorts best-match first.
- **`src/hooks/useLocalStorage.js`** — a tiny generic hook so your selected
  ingredients and any custom ones you add survive a page refresh.
- **`src/components/`** — `PantryPanel` (ingredient list + search + add form)
  and `RecipeBox` (the matched recipe grid) are the two halves of the layout;
  `IngredientTag` and `RecipeCard` are their building blocks.

Ingredients typed into "Add an ingredient" get added to your pantry and
auto-selected, but they'll only start matching recipes once some recipe in
`recipes.js` actually lists that ingredient — so pairing a new ingredient with
a new recipe that uses it is the natural next step.

## Ideas for extending it

- Swap `recipes.js` for a fetch from a real API or your own backend.
- Add categories/tags (breakfast, vegetarian, etc.) and a filter row.
- Add a "shopping list" view: recipes you're close to, and what's missing.
- Persist recipes you've cooked or starred, using the same localStorage hook.

// Ingredient keys are always lowercase singular-ish strings, e.g. "bell pepper".
// This keeps matching simple: two ingredients are "the same" when their keys match.
// Each ingredient is { key, amount } — `amount` is a free-text portion (e.g. "2 cloves")
// shown alongside the name and never used for matching.

// Display order for the "Recipes" tab, which groups recipes by this category.
export const recipeCategoryOrder = ['Breakfast', 'Soups', 'Mains', 'Snacks & Sides']

export const recipes = [
  {
    id: 'garlic-butter-pasta',
    name: 'Garlic Butter Pasta',
    category: 'Mains',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Aglio_e_olio.jpg/500px-Aglio_e_olio.jpg',
    time: 20,
    servings: 2,
    ingredients: [
      { key: 'spaghetti', amount: '8 oz' },
      { key: 'butter', amount: '3 tbsp' },
      { key: 'garlic', amount: '3 cloves' },
      { key: 'parmesan', amount: '1/3 cup, grated' },
      { key: 'black pepper', amount: 'to taste' },
      { key: 'parsley', amount: '2 tbsp, chopped' },
    ],
    steps: [
      'Boil the spaghetti in salted water until al dente.',
      'Melt butter in a pan and cook garlic until fragrant, about 1 minute.',
      'Toss the drained pasta in the garlic butter.',
      'Finish with parmesan, black pepper, and chopped parsley.',
    ],
  },
  {
    id: 'veggie-omelette',
    name: 'Veggie Omelette',
    category: 'Breakfast',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Gorgonzola_%2B_Bacon_Omelette_%40_Omelegg_%40_Amsterdam_%2816600947041%29.jpg/500px-Gorgonzola_%2B_Bacon_Omelette_%40_Omelegg_%40_Amsterdam_%2816600947041%29.jpg',
    time: 10,
    servings: 1,
    ingredients: [
      { key: 'egg', amount: '3 large' },
      { key: 'milk', amount: '2 tbsp' },
      { key: 'bell pepper', amount: '1/4 cup, diced' },
      { key: 'onion', amount: '2 tbsp, diced' },
      { key: 'cheddar', amount: '1/4 cup, shredded' },
      { key: 'butter', amount: '1 tbsp' },
    ],
    steps: [
      'Whisk eggs with a splash of milk.',
      'Melt butter in a pan and soften diced onion and bell pepper.',
      'Pour in the eggs and let set on medium-low heat.',
      'Scatter cheddar over half, fold, and slide onto a plate.',
    ],
  },
  {
    id: 'grilled-cheese',
    name: 'Classic Grilled Cheese',
    category: 'Snacks & Sides',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Classic_Grilled_Cheese_Sandwich_%2825791331763%29_%28cropped%29.jpg/500px-Classic_Grilled_Cheese_Sandwich_%2825791331763%29_%28cropped%29.jpg',
    time: 10,
    servings: 1,
    ingredients: [
      { key: 'bread', amount: '2 slices' },
      { key: 'cheddar', amount: '2 slices' },
      { key: 'butter', amount: '1 tbsp' },
    ],
    steps: [
      'Butter one side of each slice of bread.',
      'Layer cheddar between the unbuttered sides.',
      'Cook in a skillet over medium heat until golden, flipping once.',
    ],
  },
  {
    id: 'tomato-basil-soup',
    name: 'Tomato Basil Soup',
    category: 'Soups',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Tomato_soup%2C_plant-based_%2844040252791%29.jpg/500px-Tomato_soup%2C_plant-based_%2844040252791%29.jpg',
    time: 30,
    servings: 4,
    ingredients: [
      { key: 'tomato', amount: '2 lbs' },
      { key: 'onion', amount: '1 medium, diced' },
      { key: 'garlic', amount: '2 cloves' },
      { key: 'vegetable broth', amount: '3 cups' },
      { key: 'basil', amount: '1/4 cup, fresh' },
      { key: 'cream', amount: '1/2 cup' },
    ],
    steps: [
      'Sauté onion and garlic until soft.',
      'Add tomato and vegetable broth, simmer 15 minutes.',
      'Blend until smooth, then stir in cream and torn basil.',
    ],
  },
  {
    id: 'chicken-stir-fry',
    name: 'Chicken Stir Fry',
    category: 'Mains',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Making_Stir-Fry_%283286445383%29.jpg/500px-Making_Stir-Fry_%283286445383%29.jpg',
    time: 25,
    servings: 3,
    ingredients: [
      { key: 'chicken breast', amount: '1 lb' },
      { key: 'soy sauce', amount: '3 tbsp' },
      { key: 'garlic', amount: '2 cloves' },
      { key: 'ginger', amount: '1 tbsp, grated' },
      { key: 'bell pepper', amount: '1, sliced' },
      { key: 'broccoli', amount: '2 cups, florets' },
      { key: 'rice', amount: '1 1/2 cups' },
    ],
    steps: [
      'Cook rice according to package directions.',
      'Slice chicken and stir-fry until browned.',
      'Add garlic, ginger, bell pepper, and broccoli, stir-fry until crisp-tender.',
      'Splash in soy sauce and serve over rice.',
    ],
  },
  {
    id: 'guacamole',
    name: 'Guacamole',
    category: 'Snacks & Sides',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Guacamole_IMGP1271.jpg/500px-Guacamole_IMGP1271.jpg',
    time: 10,
    servings: 4,
    ingredients: [
      { key: 'avocado', amount: '3 ripe' },
      { key: 'lime', amount: '1, juiced' },
      { key: 'onion', amount: '1/4 cup, diced' },
      { key: 'cilantro', amount: '2 tbsp, chopped' },
      { key: 'tomato', amount: '1, diced' },
      { key: 'salt', amount: '1/2 tsp' },
    ],
    steps: [
      'Mash avocado in a bowl.',
      'Fold in diced onion, tomato, and cilantro.',
      'Season with lime juice and salt to taste.',
    ],
  },
  {
    id: 'banana-pancakes',
    name: 'Banana Pancakes',
    category: 'Breakfast',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Foodiesfeed.com_pouring-honey-on-pancakes-with-walnuts.jpg/500px-Foodiesfeed.com_pouring-honey-on-pancakes-with-walnuts.jpg',
    time: 20,
    servings: 2,
    ingredients: [
      { key: 'flour', amount: '1 cup' },
      { key: 'egg', amount: '1 large' },
      { key: 'milk', amount: '3/4 cup' },
      { key: 'banana', amount: '1, mashed' },
      { key: 'baking powder', amount: '1 tsp' },
      { key: 'butter', amount: '2 tbsp' },
    ],
    steps: [
      'Mash the banana, then whisk in egg and milk.',
      'Fold in flour and baking powder until just combined.',
      'Cook spoonfuls of batter in buttered pan until bubbles form, then flip.',
    ],
  },
  {
    id: 'caprese-salad',
    name: 'Caprese Salad',
    category: 'Snacks & Sides',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Caprese-1_%28tigher_crop%29.jpg/500px-Caprese-1_%28tigher_crop%29.jpg',
    time: 10,
    servings: 2,
    ingredients: [
      { key: 'tomato', amount: '2 large' },
      { key: 'mozzarella', amount: '8 oz' },
      { key: 'basil', amount: '1/4 cup, leaves' },
      { key: 'olive oil', amount: '2 tbsp' },
      { key: 'balsamic vinegar', amount: '1 tbsp' },
    ],
    steps: [
      'Slice tomato and mozzarella into rounds.',
      'Layer alternately on a plate with basil leaves.',
      'Drizzle with olive oil and balsamic vinegar.',
    ],
  },
  {
    id: 'black-bean-tacos',
    name: 'Black Bean Tacos',
    category: 'Mains',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Breakfast_tacos.jpg/500px-Breakfast_tacos.jpg',
    time: 15,
    servings: 3,
    ingredients: [
      { key: 'black beans', amount: '1 can (15 oz)' },
      { key: 'tortilla', amount: '6 small' },
      { key: 'onion', amount: '1/4 cup, diced' },
      { key: 'cilantro', amount: '2 tbsp, chopped' },
      { key: 'lime', amount: '1, in wedges' },
      { key: 'cheddar', amount: '1/2 cup, shredded' },
    ],
    steps: [
      'Warm the black beans with diced onion until heated through.',
      'Spoon into tortillas with cheddar.',
      'Top with cilantro and a squeeze of lime.',
    ],
  },
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    category: 'Mains',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg/500px-Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg',
    time: 20,
    servings: 3,
    ingredients: [
      { key: 'rice', amount: '3 cups, cooked' },
      { key: 'egg', amount: '2 large' },
      { key: 'soy sauce', amount: '2 tbsp' },
      { key: 'onion', amount: '1/2, diced' },
      { key: 'garlic', amount: '2 cloves' },
      { key: 'frozen peas', amount: '1/2 cup' },
      { key: 'carrot', amount: '1, diced' },
    ],
    steps: [
      'Scramble the egg in a hot wok or pan and set aside.',
      'Stir-fry onion, garlic, and carrot until softened.',
      'Add cold rice, peas, and soy sauce, tossing until heated through.',
      'Fold the egg back in and serve.',
    ],
  },
  {
    id: 'lentil-soup',
    name: 'Lentil Soup',
    category: 'Soups',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/EgFoodLentilSoup.jpg/500px-EgFoodLentilSoup.jpg',
    time: 35,
    servings: 4,
    ingredients: [
      { key: 'lentils', amount: '1 cup' },
      { key: 'onion', amount: '1, diced' },
      { key: 'carrot', amount: '2, diced' },
      { key: 'garlic', amount: '2 cloves' },
      { key: 'vegetable broth', amount: '4 cups' },
      { key: 'cumin', amount: '1 tsp' },
    ],
    steps: [
      'Sauté onion, carrot, and garlic until softened.',
      'Stir in cumin, then add lentils and vegetable broth.',
      'Simmer until lentils are tender, about 25 minutes.',
    ],
  },
  {
    id: 'margherita-toast',
    name: 'Margherita Toast',
    category: 'Snacks & Sides',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Bruschetta.jpg/500px-Bruschetta.jpg',
    time: 10,
    servings: 2,
    ingredients: [
      { key: 'bread', amount: '2 slices' },
      { key: 'tomato', amount: '1, sliced' },
      { key: 'mozzarella', amount: '4 oz' },
      { key: 'basil', amount: 'a handful' },
      { key: 'olive oil', amount: '1 tbsp' },
    ],
    steps: [
      'Toast the bread and drizzle with olive oil.',
      'Top with sliced tomato and mozzarella.',
      'Finish with torn basil leaves.',
    ],
  },
  {
    id: 'pb-banana-smoothie',
    name: 'Peanut Butter Banana Smoothie',
    category: 'Breakfast',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kiwi_Smoothie.jpg/500px-Kiwi_Smoothie.jpg',
    time: 5,
    servings: 1,
    ingredients: [
      { key: 'banana', amount: '1' },
      { key: 'peanut butter', amount: '2 tbsp' },
      { key: 'milk', amount: '1 cup' },
      { key: 'honey', amount: '1 tsp' },
    ],
    steps: [
      'Add all ingredients to a blender.',
      'Blend until smooth, adding more milk to loosen if needed.',
    ],
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    category: 'Breakfast',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Shakshuka_by_Calliopejen1.jpg/500px-Shakshuka_by_Calliopejen1.jpg',
    time: 30,
    servings: 3,
    ingredients: [
      { key: 'egg', amount: '4 large' },
      { key: 'tomato', amount: '1 can (28 oz)' },
      { key: 'onion', amount: '1, diced' },
      { key: 'garlic', amount: '2 cloves' },
      { key: 'bell pepper', amount: '1, diced' },
      { key: 'cumin', amount: '1 tsp' },
      { key: 'paprika', amount: '1 tsp' },
    ],
    steps: [
      'Sauté onion and bell pepper until soft, then add garlic, cumin, and paprika.',
      'Add tomato and simmer 10 minutes into a thick sauce.',
      'Make wells in the sauce, crack in eggs, and cover until whites set.',
    ],
  },
  {
    id: 'pork-belly-soba-soup',
    name: 'Pork Belly Soba Soup',
    category: 'Soups',
    image: 'https://cdn.shopify.com/s/files/1/0604/4457/3830/files/IMG_0366.jpg?v=1780338568&width=1280',
    link: 'https://cabagges.world/recipes/15-minute-soba',
    time: 20,
    servings: 1,
    ingredients: [
      { key: 'soba noodles', amount: '1 portion' },
      { key: 'dashi powder', amount: '1/2 tsp' },
      { key: 'soy sauce', amount: '1 tbsp' },
      { key: 'mirin', amount: '1 1/2 tbsp' },
      { key: 'sake', amount: '1 tbsp' },
      { key: 'lemon', amount: 'a squeeze' },
      { key: 'pork belly', amount: '3-5 thin slices' },
      { key: 'watercress', amount: 'a handful' },
      { key: 'enoki mushrooms', amount: 'a handful' },
      { key: 'ponzu', amount: '1/2 tbsp' },
      { key: 'shichimi togarashi', amount: 'a pinch' },
    ],
    steps: [
      'In a small saucepan, bring 3 cups of water to a boil. Add dashi powder, soy sauce, mirin, and sake.',
      'Add pork belly and cook until no longer pink and the soup returns to a simmer.',
      'Chop watercress into 2" sections and add, along with enoki mushrooms.',
      'In a separate saucepan, boil 1 portion of soba noodles according to package instructions and drain.',
      'Add noodles to a bowl, then cover with the cooked vegetables, pork, and soup.',
      'Finish with a drizzle of ponzu, a squeeze of lemon, and a sprinkle of togarashi if you like spice.',
    ],
  },
]

// Every unique ingredient key used across the recipe list, sorted alphabetically.
export function getAllIngredientKeys(recipeList) {
  const keys = new Set()
  recipeList.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => keys.add(ingredient.key))
  })
  return Array.from(keys).sort()
}

// "bell pepper" -> "Bell Pepper"
export function formatIngredientLabel(key) {
  return key
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Display order for the accordion in PantryPanel. "Other" always goes last and
// catches any ingredient (usually a custom one someone typed in) with no entry below.
export const ingredientCategoryOrder = [
  'Produce',
  'Protein',
  'Dairy',
  'Grains & Baking',
  'Condiments & Sauces',
  'Spices & Seasonings',
  'Other',
]

const categoryByIngredient = {
  avocado: 'Produce',
  banana: 'Produce',
  basil: 'Produce',
  'bell pepper': 'Produce',
  broccoli: 'Produce',
  carrot: 'Produce',
  cilantro: 'Produce',
  'enoki mushrooms': 'Produce',
  'frozen peas': 'Produce',
  garlic: 'Produce',
  ginger: 'Produce',
  lemon: 'Produce',
  lime: 'Produce',
  onion: 'Produce',
  parsley: 'Produce',
  tomato: 'Produce',
  watercress: 'Produce',

  'black beans': 'Protein',
  'chicken breast': 'Protein',
  egg: 'Protein',
  lentils: 'Protein',
  'pork belly': 'Protein',

  butter: 'Dairy',
  cheddar: 'Dairy',
  cream: 'Dairy',
  milk: 'Dairy',
  mozzarella: 'Dairy',
  parmesan: 'Dairy',

  'baking powder': 'Grains & Baking',
  bread: 'Grains & Baking',
  flour: 'Grains & Baking',
  rice: 'Grains & Baking',
  'soba noodles': 'Grains & Baking',
  spaghetti: 'Grains & Baking',
  tortilla: 'Grains & Baking',

  'balsamic vinegar': 'Condiments & Sauces',
  'dashi powder': 'Condiments & Sauces',
  honey: 'Condiments & Sauces',
  mirin: 'Condiments & Sauces',
  'olive oil': 'Condiments & Sauces',
  'peanut butter': 'Condiments & Sauces',
  ponzu: 'Condiments & Sauces',
  sake: 'Condiments & Sauces',
  'soy sauce': 'Condiments & Sauces',
  'vegetable broth': 'Condiments & Sauces',

  'black pepper': 'Spices & Seasonings',
  cumin: 'Spices & Seasonings',
  paprika: 'Spices & Seasonings',
  salt: 'Spices & Seasonings',
  'shichimi togarashi': 'Spices & Seasonings',
}

export function getIngredientCategory(key) {
  return categoryByIngredient[key] ?? 'Other'
}

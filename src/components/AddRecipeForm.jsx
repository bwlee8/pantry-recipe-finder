import { useState } from 'react'
import { recipeCategoryOrder } from '../data/recipes.js'

export default function AddRecipeForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(recipeCategoryOrder[0])
  const [time, setTime] = useState('')
  const [servings, setServings] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [stepsText, setStepsText] = useState('')
  const [image, setImage] = useState(null)
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  function handleImageChange(event) {
    const file = event.target.files[0]
    if (!file) {
      setImage(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Name the recipe first.')
      return
    }

    const timeMinutes = Number(time)
    if (!timeMinutes || timeMinutes <= 0) {
      setError('Enter a cook time in minutes.')
      return
    }

    const servingsCount = Number(servings)
    if (!servingsCount || servingsCount <= 0) {
      setError('Enter how many servings.')
      return
    }

    const ingredients = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const commaIndex = line.indexOf(',')
        if (commaIndex === -1) {
          return { key: line.toLowerCase(), amount: '' }
        }
        return {
          amount: line.slice(0, commaIndex).trim(),
          key: line.slice(commaIndex + 1).trim().toLowerCase(),
        }
      })
      .filter((ingredient) => ingredient.key)
    if (ingredients.length === 0) {
      setError('List at least one ingredient, one per line.')
      return
    }

    const steps = stepsText
      .split('\n')
      .map((step) => step.trim())
      .filter(Boolean)
    if (steps.length === 0) {
      setError('Add at least one step, one per line.')
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      name: trimmedName,
      category,
      time: timeMinutes,
      servings: servingsCount,
      ingredients,
      steps,
      image,
      link: link.trim() || null,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <form className="add-recipe-form" onSubmit={handleSubmit}>
      <label className="add-ingredient-form__label" htmlFor="new-recipe-name">
        Recipe name
      </label>
      <input id="new-recipe-name" type="text" placeholder="e.g. Weeknight Fried Rice" value={name} onChange={(event) => setName(event.target.value)} />

      <label className="add-ingredient-form__label" htmlFor="new-recipe-image">
        Photo
      </label>
      <div className="add-recipe-form__image-row">
        {image && <img className="add-recipe-form__image-preview" src={image} alt="" />}
        <input id="new-recipe-image" type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <label className="add-ingredient-form__label" htmlFor="new-recipe-link">
        Source link (optional)
      </label>
      <input
        id="new-recipe-link"
        type="url"
        placeholder="https://…"
        value={link}
        onChange={(event) => setLink(event.target.value)}
      />

      <div className="add-recipe-form__row">
        <div className="add-recipe-form__field">
          <label className="add-ingredient-form__label" htmlFor="new-recipe-category">
            Category
          </label>
          <select id="new-recipe-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            {recipeCategoryOrder.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="add-recipe-form__field">
          <label className="add-ingredient-form__label" htmlFor="new-recipe-time">
            Time (min)
          </label>
          <input id="new-recipe-time" type="number" min="1" value={time} onChange={(event) => setTime(event.target.value)} />
        </div>
      </div>

      <label className="add-ingredient-form__label" htmlFor="new-recipe-servings">
        Servings
      </label>
      <textarea
        id="new-recipe-servings"
        rows={1}
        placeholder="e.g. 4"
        value={servings}
        onChange={(event) => setServings(event.target.value)}
      />

      <label className="add-ingredient-form__label" htmlFor="new-recipe-ingredients">
        Ingredients (one per line: amount, ingredient)
      </label>
      <textarea
        id="new-recipe-ingredients"
        rows={4}
        placeholder={'2 cups, rice\n2 large, egg\n2 tbsp, soy sauce\ngarlic'}
        value={ingredientsText}
        onChange={(event) => setIngredientsText(event.target.value)}
      />

      <label className="add-ingredient-form__label" htmlFor="new-recipe-steps">
        Steps (one per line)
      </label>
      <textarea
        id="new-recipe-steps"
        rows={4}
        placeholder={'Cook the rice.\nScramble the egg.\nToss everything together.'}
        value={stepsText}
        onChange={(event) => setStepsText(event.target.value)}
      />

      {error && <p className="add-ingredient-form__error">{error}</p>}

      <div className="add-recipe-form__actions">
        <button type="button" className="text-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Add recipe</button>
      </div>
    </form>
  )
}

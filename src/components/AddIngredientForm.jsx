import { useState } from 'react'

export default function AddIngredientForm({ existingKeys, onAdd, onCancel }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = value.trim()

    if (!trimmed) {
      setError('Type an ingredient first.')
      return
    }

    const key = trimmed.toLowerCase()
    if (existingKeys.has(key)) {
      setError('Already in your pantry.')
      return
    }

    onAdd(key)
    setValue('')
    setError('')
  }

  return (
    <form className="add-recipe-form" onSubmit={handleSubmit}>
      <label htmlFor="new-ingredient" className="add-ingredient-form__label">
        Ingredient name
      </label>
      <input
        id="new-ingredient"
        type="text"
        placeholder="e.g. smoked paprika"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          if (error) setError('')
        }}
      />

      {error && <p className="add-ingredient-form__error">{error}</p>}

      <div className="add-recipe-form__actions">
        <button type="button" className="text-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Add ingredient</button>
      </div>
    </form>
  )
}

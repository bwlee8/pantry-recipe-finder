import { useState } from 'react'

export default function AddIngredientForm({ existingKeys, onAdd }) {
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
    <form className="add-ingredient-form" onSubmit={handleSubmit}>
      <label htmlFor="new-ingredient" className="add-ingredient-form__label">
        Add an ingredient
      </label>
      <div className="add-ingredient-form__row">
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
        <button type="submit">Add</button>
      </div>
      {error && <p className="add-ingredient-form__error">{error}</p>}
    </form>
  )
}

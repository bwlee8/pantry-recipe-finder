export default function IngredientTag({ label, selected, editable, onToggle, onRemove }) {
  return (
    <span className="ingredient-tag" data-selected={selected ? 'true' : 'false'}>
      <button
        type="button"
        className="ingredient-tag__toggle"
        aria-pressed={selected}
        onClick={onToggle}
      >
        {label}
      </button>
      {editable && (
        <button
          type="button"
          className="ingredient-tag__remove"
          onClick={onRemove}
          aria-label={`Remove ${label} from your pantry list`}
          title={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

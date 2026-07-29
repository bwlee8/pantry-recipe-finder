export default function RecipeFilters({
  categories,
  selectedCategories,
  onToggleCategory,
  servingSizes,
  selectedServingSizes,
  onToggleServingSize,
  timeBounds,
  timeLimit,
  onTimeLimitChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}) {
  return (
    <div className="recipe-filters">
      {categories.length > 0 && (
        <div className="recipe-filters__row">
          <p className="recipe-filters__label">Category</p>
          <div className="recipe-filters__chips">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="recipe-filters__chip"
                data-active={selectedCategories.has(category) ? 'true' : 'false'}
                onClick={() => onToggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {servingSizes.length > 0 && (
        <div className="recipe-filters__row">
          <p className="recipe-filters__label">Servings</p>
          <div className="recipe-filters__chips">
            {servingSizes.map((size) => (
              <button
                key={size}
                type="button"
                className="recipe-filters__chip"
                data-active={selectedServingSizes.has(size) ? 'true' : 'false'}
                onClick={() => onToggleServingSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {timeBounds.max > timeBounds.min && (
        <div className="recipe-filters__row">
          <label className="recipe-filters__label" htmlFor="recipe-time-filter">
            Time: up to {timeLimit} min
          </label>
          <input
            id="recipe-time-filter"
            type="range"
            className="recipe-filters__slider"
            min={timeBounds.min}
            max={timeBounds.max}
            step={5}
            value={timeLimit}
            onChange={(event) => onTimeLimitChange(Number(event.target.value))}
          />
        </div>
      )}

      <div className="recipe-filters__row">
        <label className="recipe-filters__label" htmlFor="recipe-sort">
          Sort by
        </label>
        <select id="recipe-sort" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
          <option value="default">Category order</option>
          <option value="mostCooked">Most cooked</option>
          <option value="leastCooked">Least cooked</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button type="button" className="text-button" onClick={onClearFilters}>
          Clear filters
        </button>
      )}
    </div>
  )
}

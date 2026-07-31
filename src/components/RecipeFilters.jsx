import { useState } from 'react'

const SORT_OPTIONS = [
  { value: 'default', label: 'Best match' },
  { value: 'mostCooked', label: 'Most cooked' },
  { value: 'leastCooked', label: 'Least cooked' },
  { value: 'newest', label: 'Newest' },
]

export default function RecipeFilters({
  cuisines,
  selectedCuisines,
  onToggleCuisine,
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
  onlyFullMatches,
  onToggleOnlyFullMatches,
}) {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const currentSortLabel = SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? 'Best match'

  return (
    <div className="recipe-filters">
      {cuisines.length > 0 && (
        <div className="recipe-filters__row">
          <p className="recipe-filters__label">Cuisine</p>
          <div className="recipe-filters__chips">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                type="button"
                className="recipe-filters__chip"
                data-active={selectedCuisines.has(cuisine) ? 'true' : 'false'}
                onClick={() => onToggleCuisine(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      )}

      {(categories.length > 0 || servingSizes.length > 0) && (
        <div className="recipe-filters__row recipe-filters__row--split">
          {categories.length > 0 && (
            <div className="recipe-filters__group">
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
            <div className="recipe-filters__group">
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
        </div>
      )}

      <div className="recipe-filters__row recipe-filters__row--split">
        <div className="recipe-filters__group">
          <p className="recipe-filters__label" id="recipe-sort-label">
            Sort by
          </p>
          <div className="sort-dropdown">
            <button
              type="button"
              className="recipe-filters__chip sort-dropdown__trigger"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
              aria-labelledby="recipe-sort-label"
              onClick={() => setIsSortOpen((current) => !current)}
            >
              {currentSortLabel}
              <span className="sort-dropdown__caret" data-open={isSortOpen ? 'true' : 'false'}>
                ▾
              </span>
            </button>
            <div className="collapsible" data-open={isSortOpen ? 'true' : 'false'}>
              <div className="collapsible__inner">
                <div className="sort-dropdown__menu" role="listbox" aria-labelledby="recipe-sort-label">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={sortBy === option.value}
                      className="recipe-filters__chip"
                      data-active={sortBy === option.value ? 'true' : 'false'}
                      onClick={() => {
                        onSortChange(option.value)
                        setIsSortOpen(false)
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {timeBounds.max > timeBounds.min && (
          <div className="recipe-filters__group">
            <label className="recipe-filters__label" htmlFor="recipe-time-filter">
              Time: up to {timeLimit} min
            </label>
            <input
              id="recipe-time-filter"
              type="range"
              className="recipe-filters__slider"
              min={timeBounds.min}
              max={timeBounds.max}
              step={1}
              value={timeLimit}
              onChange={(event) => onTimeLimitChange(Number(event.target.value))}
            />
          </div>
        )}
      </div>

      <label className="only-full-matches">
        <input
          type="checkbox"
          checked={onlyFullMatches}
          onChange={(event) => onToggleOnlyFullMatches(event.target.checked)}
        />
        Only show what I can fully make
      </label>

      {hasActiveFilters && (
        <button type="button" className="text-button" onClick={onClearFilters}>
          Clear filters
        </button>
      )}
    </div>
  )
}

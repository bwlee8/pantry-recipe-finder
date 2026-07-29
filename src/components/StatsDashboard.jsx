import { statsPeriods, filterByPeriod, getTopRecipe, getTopIngredient } from '../utils/stats.js'
import { formatIngredientLabel } from '../data/recipes.js'

export default function StatsDashboard({ cookLog }) {
  return (
    <section className="recipe-box" aria-label="Cooking stats">
      <div className="recipe-box__header">
        <div>
          <p className="eyebrow">The Data</p>
          <h2>Your cooking stats</h2>
        </div>
      </div>

      {cookLog.length === 0 ? (
        <p className="empty-state">
          Mark a recipe as cooked from its detail page to start tracking your stats.
        </p>
      ) : (
        <div className="stats-grid">
          {statsPeriods.map(({ id, label, days }) => {
            const entries = filterByPeriod(cookLog, days)
            const topRecipe = getTopRecipe(entries)
            const topIngredient = getTopIngredient(entries, formatIngredientLabel)
            return (
              <div className="stats-card" key={id}>
                <p className="stats-card__label">{label}</p>
                <p className="stats-card__count">{entries.length}</p>
                <p className="stats-card__count-label">recipes cooked</p>
                <dl className="stats-card__facts">
                  <div>
                    <dt>Most cooked</dt>
                    <dd>{topRecipe ? `${topRecipe.name} (${topRecipe.count})` : '—'}</dd>
                  </div>
                  <div>
                    <dt>Most used ingredient</dt>
                    <dd>{topIngredient ? `${topIngredient.label} (${topIngredient.count})` : '—'}</dd>
                  </div>
                </dl>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

import { useMemo } from 'react'
import { getRecipeLeaderboard } from '../utils/stats.js'

export default function StatsSidebar({ cookLog }) {
  const leaderboard = useMemo(() => getRecipeLeaderboard(cookLog), [cookLog])

  return (
    <div className="pantry-panel__content">
      <div className="pantry-panel__header">
        <p className="eyebrow">The Data</p>
        <h2>Cook log</h2>
      </div>
      <p className="recipe-library__subtitle">
        {cookLog.length} {cookLog.length === 1 ? 'time' : 'times'} cooked, all-time
      </p>

      {leaderboard.length === 0 ? (
        <p className="ingredient-list__empty">Nothing cooked yet.</p>
      ) : (
        <ul className="stats-leaderboard">
          {leaderboard.map(({ name, count }) => (
            <li className="stats-leaderboard__row" key={name}>
              <span className="stats-leaderboard__name">{name}</span>
              <span className="stats-leaderboard__count">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

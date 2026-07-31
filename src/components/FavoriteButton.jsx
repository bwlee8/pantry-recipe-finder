export default function FavoriteButton({ isFavorited, onToggle, label, variant = 'default' }) {
  function handleClick(event) {
    event.stopPropagation()
    onToggle()
  }

  return (
    <button
      type="button"
      className={`favorite-toggle favorite-toggle--${variant}`}
      data-favorited={isFavorited ? 'true' : 'false'}
      onClick={handleClick}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg className="favorite-toggle__icon" viewBox="0 0 32 29" aria-hidden="true">
        <path d="M23.6 0c-3.4 0-6.4 2-7.6 4.9C14.7 2 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.4 10.5 14.6 16 19.6 5.5-5 16-10.2 16-19.6C32 3.8 28.2 0 23.6 0z" />
      </svg>
    </button>
  )
}

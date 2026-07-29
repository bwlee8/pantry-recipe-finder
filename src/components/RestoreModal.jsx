import { createPortal } from 'react-dom'

export default function RestoreModal({ title, items, onRestoreOne, onRestoreAll, onClose }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="modal__empty">Nothing hidden.</p>
        ) : (
          <>
            <ul className="modal__list">
              {items.map((item) => (
                <li className="modal__item" key={item.id}>
                  <span className="modal__item-label">{item.label}</span>
                  <button type="button" className="text-button" onClick={() => onRestoreOne(item.id)}>
                    Restore
                  </button>
                </li>
              ))}
            </ul>
            <div className="modal__footer">
              <button type="button" className="text-button" onClick={onRestoreAll}>
                Restore all
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

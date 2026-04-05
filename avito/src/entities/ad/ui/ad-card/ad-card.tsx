import { checkNeedsRevision, formatCardPrice, getCardCategoryLabel } from './model/helpers'
import type { AdCardProps } from './model/types'

import './ad-card.css'

export { checkNeedsRevision } from './model/helpers'

export function AdCard({ item, onClick, variant = 'grid' }: AdCardProps) {
  const formattedPrice = formatCardPrice(item.price)
  const needsRevision = checkNeedsRevision(item)

  return (
    <div onClick={() => onClick(String(item.id))} className={`ad-card ad-card--${variant}`}>
      <div className="ad-card__image-placeholder">
        <img src="/placeholder.png" alt="" />
      </div>

      <div className="ad-card__content">
        <div>
          <span className="ad-card__category">{getCardCategoryLabel(item.category)}</span>
        </div>

        <h3 className="ad-card__title" title={item.title}>
          {item.title}
        </h3>

        <p className="ad-card__price">{formattedPrice}</p>

        {needsRevision ? (
          <div className="ad-card__badge">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="4" />
            </svg>
            <span className="ad-card__badge-text">Требует доработок</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

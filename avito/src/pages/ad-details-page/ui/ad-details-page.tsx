import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAdDetails } from '../../../entities/ad'
import {EditIcon, WarningIcon} from '../../../shared/ui'
import { formatDate, formatParamLabel, formatParamValue, formatPrice, getMissingFields, getVisibleParams } from '../model/helpers'

import './ad-details-page.css'

export function AdDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: item, isLoading, isError, error } = useAdDetails(id)

  if (isLoading) {
    return <div className="ad-details-page ad-details-page--center">Загрузка объявления...</div>
  }

  if (isError || !item) {
    return (
      <div className="ad-details-page ad-details-page--center">
        <p className="ad-details-page__error">{error instanceof Error ? error.message : 'Что-то пошло не так'}</p>
        <button className="ad-details-page__edit-button" onClick={() => navigate('/ads')}>
          Вернуться к списку
        </button>
      </div>
    )
  }

  const missingFields = getMissingFields(item)
  const visibleParams = getVisibleParams(item)

  return (
    <section className="ad-details-page">
      <div className="ad-details-page__top">
        <div className="ad-details-page__top-main">
          <h1 className="ad-details-page__title">{item.title}</h1>
          <Link className="ad-details-page__edit-button" to={`/ads/${item.id}/edit`}>
            <span className="ad-details-page__edit-icon">Редактировать </span><EditIcon/>
          </Link>
        </div>

        <div className="ad-details-page__top-side">
          <div className="ad-details-page__price">{formatPrice(item.price)}</div>
          <div className="ad-details-page__dates">
            <span>Опубликовано: {formatDate(item.createdAt)}</span>
            <span>Отредактировано: {formatDate(item.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="ad-details-page__divider" />

      <div className="ad-details-page__hero">
        <div className="ad-details-page__image">
          <img src="/placeholder.png" alt="" />
        </div>

        <div className="ad-details-page__content">
          {item.needsRevision ? (
            <div className="ad-details-page__warning">
              <WarningIcon />
              <div className="ad-details-page__warning-main-container">
                <div className="ad-details-page__warning-head">
                  <strong>Требуются доработки</strong>
                </div>
                <p className="ad-details-page__warning-text">У объявления не заполнены поля:</p>
                <ul className="ad-details-page__warning-list">
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="ad-details-page__specs">
            <h2 className="ad-details-page__section-title">Характеристики</h2>
            <dl className="ad-details-page__specs-list">
              {visibleParams.map(([key, value]) => (
                <div key={key} className="ad-details-page__spec-row">
                  <dt>{formatParamLabel(key)}</dt>
                  <dd>{formatParamValue(value as string | number)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="ad-details-page__description">
        <h2 className="ad-details-page__section-title">Описание</h2>
        <p>{item.description?.trim() || 'Описание отсутствует.'}</p>
      </div>
    </section>
  )
}

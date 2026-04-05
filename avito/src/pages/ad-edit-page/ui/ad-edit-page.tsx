import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { createAd, requestEstimatedPrice, requestGeneratedDescription, updateAd, useAdDetails } from '../../../entities/ad'
import { AiPopover, useNotifications } from '../../../shared/ui'
import { categoryOptions, conditionOptions, typeOptions } from '../model/constants'
import {
  buildAiPayload,
  buildSavePayload,
  clearDraftFromStorage,
  loadDraftFromStorage,
  normalizeAiText,
  normalizeFormParams,
  saveDraftToStorage,
} from '../model/helpers'
import type { AdEditFormState } from '../model/types'
import { AiTriggerButton } from './ai-trigger-button'
import { SelectField, TextField } from './form-fields'

import './ad-edit-page.css'

type FormErrorKey = 'category' | 'title' | 'price'

const initialFormState: AdEditFormState = {
  category: 'electronics',
  title: '',
  price: '',
  description: '',
  params: {},
}

export function AdEditPage() {
  const { id = 'unknown' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { notify } = useNotifications()
  const { data: item, isLoading, isError } = useAdDetails(id)
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState<Partial<Record<FormErrorKey, string>>>({})
  const hasInitializedFormRef = useRef(false)

  useEffect(() => {
    hasInitializedFormRef.current = false
  }, [id])

  useEffect(() => {
    if (!item || hasInitializedFormRef.current) {
      return
    }

    const draft = loadDraftFromStorage(id)
    const baseForm: AdEditFormState = {
      category: item.category,
      title: item.title,
      price: String(item.price),
      description: item.description || '',
      params: normalizeFormParams(item.category, item.params),
    }

    setForm({
      ...baseForm,
      ...(draft ?? {}),
      params: normalizeFormParams(draft?.category ?? baseForm.category, {
        ...baseForm.params,
        ...(draft?.params ?? {}),
      }),
    })
    hasInitializedFormRef.current = true
  }, [id, item])

  useEffect(() => {
    if (!hasInitializedFormRef.current) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      saveDraftToStorage(id, form)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [form, id])

  const clearFieldError = (field: FormErrorKey) => {
    setErrors((current) => {
      if (!current[field]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const updateField = (field: keyof AdEditFormState, value: string) => {
    if (field === 'category' || field === 'title' || field === 'price') {
      clearFieldError(field)
    }

    if (field === 'category') {
      setForm((current) => ({
        ...current,
        category: value as AdEditFormState['category'],
        params: normalizeFormParams(value as AdEditFormState['category'], current.params),
      }))
      return
    }

    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateParam = (paramField: string, value: string) => {
    setForm((current) => ({
      ...current,
      params: { ...current.params, [paramField]: value },
    }))
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<FormErrorKey, string>> = {}

    if (!form.category.trim()) {
      nextErrors.category = 'Категория должна быть заполнена'
    }

    if (!form.title.trim()) {
      nextErrors.title = 'Название должно быть заполнено'
    }

    if (!form.price.trim()) {
      nextErrors.price = 'Цена должна быть заполнена'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const aiPayload = buildAiPayload(id, form)
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = buildSavePayload(form)

      if (id === 'unknown') {
        return createAd(payload)
      }

      return updateAd(id, payload)
    },
    onSuccess: async (savedItem) => {
      const targetId = savedItem?.id != null ? String(savedItem.id) : id

      clearDraftFromStorage(id)
      clearDraftFromStorage(targetId)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['ad-details', id] }),
        queryClient.invalidateQueries({ queryKey: ['ad-details', targetId] }),
      ])

      notify('Объявление успешно сохранено')
      navigate(`/ads/${targetId}`)
    },
    onError: (error) => {
      notify(error instanceof Error ? error.message : 'Не удалось сохранить объявление', 'error')
    },
  })

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    saveMutation.mutate()
  }

  if (isLoading) {
    return <div className="ad-edit-page ad-edit-page__state">Загрузка формы...</div>
  }

  if (isError || !item) {
    return <div className="ad-edit-page ad-edit-page__state">Ошибка при загрузке объявления</div>
  }

  return (
    <section className="ad-edit-page" data-ad-id={id}>
      <form className="ad-edit-page__form" onSubmit={(event) => event.preventDefault()}>
        <h1 className="ad-edit-page__title">Редактирование объявления</h1>

        <div className="ad-edit-page__main-grid">
          <div className="ad-edit-page__form-column">
            <div className="ad-edit-page__section">
              <SelectField
                label="Категория"
                required
                value={form.category}
                onChange={(value) => updateField('category', value)}
                options={categoryOptions}
                error={errors.category}
              />
            </div>

            <div className="ad-edit-page__divider" />

            <div className="ad-edit-page__section">
              <TextField label="Название" required value={form.title} onChange={(value) => updateField('title', value)} error={errors.title} />
            </div>

            <div className="ad-edit-page__divider" />

            <div className="ad-edit-page__price-row">
              <TextField
                label="Цена"
                required
                value={form.price}
                onChange={(value) => updateField('price', value)}
                className="ad-edit-page__price-field"
                error={errors.price}
              />

              <div className="ad-edit-page__price-action">
                <AiPopover
                  title="Ответ от AI:"
                  fetchData={() => requestEstimatedPrice(aiPayload)}
                  onApply={(result) => {
                    if (result.price) {
                      updateField('price', String(result.price))
                    }
                  }}
                  renderValue={(result) => (
                    <>
                      <p>{`Рекомендуемая цена: ${result.price ?? '—'} ₽`}</p>
                      {result.reasoning ? <p>{normalizeAiText(result.reasoning)}</p> : null}
                    </>
                  )}
                >
                  {({ onTriggerClick, status }) => (
                    <AiTriggerButton status={status} onClick={onTriggerClick} defaultText="Узнать рыночную цену" />
                  )}
                </AiPopover>
              </div>
            </div>

            <div className="ad-edit-page__divider" />

            <div className="ad-edit-page__section">
              <h2 className="ad-edit-page__subtitle">Характеристики</h2>

              <div className="ad-edit-page__fields-grid">
                <SelectField label="Тип" value={String(form.params.type || 'laptop')} onChange={(value) => updateParam('type', value)} options={typeOptions} />
                <TextField label="Бренд" value={String(form.params.brand || '')} onChange={(value) => updateParam('brand', value)} />
                <TextField label="Модель" value={String(form.params.model || '')} onChange={(value) => updateParam('model', value)} />
                <TextField label="Цвет" value={String(form.params.color || '')} onChange={(value) => updateParam('color', value)} />
                <SelectField
                  label="Состояние"
                  value={String(form.params.condition || 'used')}
                  onChange={(value) => updateParam('condition', value)}
                  options={conditionOptions}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="ad-edit-page__divider" />

        <div className="ad-edit-page__section">
          <label className="ad-edit-page__description">
            <span className="ad-edit-page__label">Описание</span>
            <textarea
              maxLength={1000}
              className="ad-edit-page__textarea"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
            />

            <div className="ad-edit-page__description-footer">
              <AiPopover
                title="Ответ от AI:"
                fetchData={() => requestGeneratedDescription(aiPayload)}
                onApply={(value) => updateField('description', normalizeAiText(value))}
                renderValue={(value) => <p>{normalizeAiText(value)}</p>}
              >
                {({ onTriggerClick, status }) => (
                  <AiTriggerButton status={status} onClick={onTriggerClick} defaultText="Придумать описание" />
                )}
              </AiPopover>

              <span className="ad-edit-page__counter">{form.description.length} / 1000</span>
            </div>
          </label>
        </div>

        <div className="ad-edit-page__actions">
          <button className="ad-edit-page__primary-button" type="button" onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button className="ad-edit-page__secondary-button" type="button" onClick={() => navigate(`/ads/${id}`)}>
            Отменить
          </button>
        </div>
      </form>
    </section>
  )
}

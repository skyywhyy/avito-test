import { useEffect, useRef, useState } from 'react'

import type { AiPopoverProps, AiPopoverStatus } from './model/types'
import './ai-popover.css'

export function AiPopover<TValue>({
  applyText = 'Применить',
  children,
  emptyStateText = 'Не удалось получить ответ. Попробуйте еще раз.',
  fetchData,
  onApply,
  renderValue,
  title = 'Ответ от AI',
}: AiPopoverProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<AiPopoverStatus>('idle')
  const [value, setValue] = useState<TValue | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const closePopover = () => {
    setIsOpen(false)
    setStatus('idle')
  }

  const handleTriggerClick = async () => {
    if (status === 'loading') {
      return
    }

    setStatus('loading')
    setValue(null)
    setIsOpen(false)

    try {
      setValue(await fetchData())
      setStatus('success')
    } catch {
      setValue(null)
      setStatus('error')
    } finally {
      setIsOpen(true)
    }
  }

  const handleApply = () => {
    if (value === null) {
      return
    }

    onApply(value)
    closePopover()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        closePopover()
      }
    }

    if (!isOpen) {
      return
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="ai-popover" ref={popoverRef}>
      {typeof children === 'function' ? children({ onTriggerClick: handleTriggerClick, status }) : children}

      {isOpen ? (
        <div className={`ai-popover__panel ${status === 'error' ? 'ai-popover__panel--error' : ''}`}>
          <div className="ai-popover__header">
            <strong>{status === 'error' ? 'Произошла ошибка при запросе к AI' : title}</strong>
          </div>

          <div className="ai-popover__body">
            {status === 'error' ? <p>Попробуйте повторить запрос или закройте уведомление</p> : value === null ? <p>{emptyStateText}</p> : renderValue(value)}
          </div>

          <div className="ai-popover__footer">
            {status === 'error' ? (
              <button className="ai-popover__button ai-popover__button--error-close" type="button" onClick={closePopover}>
                Закрыть
              </button>
            ) : (
              <>
                <button className="ai-popover__button ai-popover__button--primary" type="button" onClick={handleApply} disabled={value === null}>
                  {applyText}
                </button>
                <button className="ai-popover__button ai-popover__button--secondary" type="button" onClick={closePopover}>
                  Закрыть
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

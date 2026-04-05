import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import './notifications.css'

type NotificationTone = 'success' | 'error'

type Notification = {
  id: number
  message: string
  tone: NotificationTone
}

type NotificationsContextValue = {
  notify: (message: string, tone?: NotificationTone) => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null)

  const notify = useCallback((message: string, tone: NotificationTone = 'success') => {
    setNotification({
      id: Date.now(),
      message,
      tone,
    })
  }, [])

  useEffect(() => {
    if (!notification) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setNotification((current) => (current?.id === notification.id ? null : current))
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [notification])

  const contextValue = useMemo(() => ({ notify }), [notify])

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
      {notification ? (
        <div className={`notifications__toast notifications__toast--${notification.tone}`} role="status" aria-live="polite">
          <span>{notification.message}</span>
          <button className="notifications__close" type="button" onClick={() => setNotification(null)} aria-label="Закрыть уведомление">
            ×
          </button>
        </div>
      ) : null}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)

  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }

  return context
}

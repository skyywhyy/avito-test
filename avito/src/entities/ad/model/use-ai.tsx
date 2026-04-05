
import { useState } from 'react'

export type AiStatus = 'idle' | 'loading' | 'success'

export function useAiFeature<T>(fetchData: () => Promise<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<AiStatus>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  const triggerFetch = async () => {
    if (status === 'loading') return

    setStatus('loading')
    setError(null)
    setData(null)

    try {
      const result = await fetchData()
      setData(result)
    } catch (err) {
      setError('Не удалось получить ответ. Попробуйте еще раз.')
    } finally {
      setStatus('success')
      setIsOpen(true)
    }
  }

  const close = () => {
    setIsOpen(false)
    setStatus('idle')
  }

  return { isOpen, status, data, error, triggerFetch, close }
}
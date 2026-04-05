import type { ReactNode } from 'react'

export type AiPopoverStatus = 'idle' | 'loading' | 'success' | 'error'

export type AiPopoverRenderProps = {
  onTriggerClick: () => void
  status: AiPopoverStatus
}

export type AiPopoverProps<TValue> = {
  applyText?: string
  children: ReactNode | ((props: AiPopoverRenderProps) => ReactNode)
  emptyStateText?: string
  fetchData: () => Promise<TValue>
  onApply: (value: TValue) => void
  renderValue: (value: TValue) => ReactNode
  title?: string
}

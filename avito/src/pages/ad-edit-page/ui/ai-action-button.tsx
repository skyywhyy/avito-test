import { useState } from 'react'

import { AiIcon, EndedStatusIcon, LoadingStatusIcon } from '../../../shared/ui'

type AiActionButtonProps = {
  className?: string
  label: string
  onAction: () => Promise<void>
}

type AiActionState = 'idle' | 'loading' | 'success'

export function AiActionButton({ className = '', label, onAction }: AiActionButtonProps) {
  const [state, setState] = useState<AiActionState>('idle')

  const handleClick = async () => {
    if (state === 'loading') {
      return
    }

    setState('loading')

    try {
      await onAction()
      setState('success')
    } catch {
      setState('idle')
    }
  }

  return (
    <button className={`ad-edit-page__ghost-button ${className}`.trim()} type="button" onClick={handleClick} disabled={state === 'loading'}>
      {state === 'idle' ? <AiIcon className="ad-edit-page__ai-icon" /> : null}
      {state === 'loading' ? <LoadingStatusIcon /> : null}
      {state === 'success' ? <EndedStatusIcon /> : null}
      {label}
    </button>
  )
}

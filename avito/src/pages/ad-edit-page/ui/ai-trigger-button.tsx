import { AiIcon, EndedStatusIcon, LoadingStatusIcon } from '../../../shared/ui'
import { getAiButtonText } from '../model/helpers'
import type { AiButtonStatus } from '../model/types'

type AiTriggerButtonProps = {
  defaultText: string
  onClick: () => void
  status: AiButtonStatus
}

export function AiTriggerButton({ defaultText, onClick, status }: AiTriggerButtonProps) {
  return (
    <button className="ad-edit-page__ghost-button" type="button" onClick={onClick} disabled={status === 'loading'}>
      {status === 'idle' || status === 'error' ? <AiIcon className="ad-edit-page__ai-icon" /> : null}
      {status === 'loading' ? <LoadingStatusIcon /> : null}
      {status === 'success' ? <EndedStatusIcon /> : null}
      {getAiButtonText(status, defaultText)}
    </button>
  )
}

import type { AdCategory, ItemParams } from '../../../entities/ad'
import type { AiPopoverStatus } from '../../../shared/ui/ai-popover/model/types'

export type SelectOption = {
  value: string
  label: string
}

export type FieldProps = {
  label: string
  required?: boolean
  value: string
  className?: string
  error?: string
  onChange: (value: string) => void
}

export type SelectFieldProps = FieldProps & {
  options: SelectOption[]
}

export type AdEditFormState = {
  category: AdCategory
  title: string
  price: string
  description: string
  params: ItemParams
}

export type AiButtonStatus = AiPopoverStatus

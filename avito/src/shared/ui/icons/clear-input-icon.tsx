import type { SVGProps } from 'react'

export const ClearInputIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" {...props}>
    <circle cx="7" cy="7" r="6" fill="currentColor" fillOpacity="0.16" />
    <path
      d="M4.667 4.667L9.333 9.333M9.333 4.667L4.667 9.333"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
)

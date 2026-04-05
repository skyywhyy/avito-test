import { RouterProvider } from 'react-router-dom'

import { router } from '../../../routing/router'
import { NotificationsProvider } from '../../../../shared/ui'

export function AppRouter() {
  return (
    <NotificationsProvider>
      <RouterProvider router={router} />
    </NotificationsProvider>
  )
}

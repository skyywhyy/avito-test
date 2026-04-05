import { Navigate, createBrowserRouter } from 'react-router-dom'

import { ROUTE_PATHS } from './config/route-paths'
import { AdDetailsPage } from '../../pages/ad-details-page'
import { AdEditPage } from '../../pages/ad-edit-page'
import { AdsListPage } from '../../pages/ads-list-page'
import { NotFoundPage } from '../../pages/not-found-page'

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.root,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTE_PATHS.ads} replace />,
      },
      {
        path: ROUTE_PATHS.ads,
        element: <AdsListPage />,
      },
      {
        path: ROUTE_PATHS.adDetails,
        element: <AdDetailsPage />,
      },
      {
        path: ROUTE_PATHS.adEdit,
        element: <AdEditPage />,
      },
      {
        path: ROUTE_PATHS.notFound,
        element: <NotFoundPage />,
      },
    ],
  },
])

export const ROUTE_PATHS = {
  root: '/',
  ads: '/ads',
  adDetails: '/ads/:id',
  adEdit: '/ads/:id/edit',
  notFound: '*',
} as const

export const buildRoutePath = {
  ads: () => ROUTE_PATHS.ads,
  adDetails: (id: string) => `/ads/${id}`,
  adEdit: (id: string) => `/ads/${id}/edit`,
}

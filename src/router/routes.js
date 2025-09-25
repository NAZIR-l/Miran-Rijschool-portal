
const routes = [

  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Dashboard', component: () => import('pages/IndexPage.vue') },
      { path: 'downloads', name: 'Downloads', component: () => import('pages/DownloadsPage.vue') },
      { path: 'account', name: 'Account', component: () => import('pages/AccountPage.vue') },
      { path: 'orders', name: 'Orders', component: () => import('pages/OrdersPage.vue') },
      { path: 'packages', name: 'Packages', component: () => import('pages/Packages.vue') },
      { path: 'signals', name: 'Signals', component: () => import('pages/TrafficSignsPage.vue') },
      // { path: '/contenfsdfst'sd, component: () => import('pages/content.vue') }

    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ErrorNotFound.vue') }
    ]
  }
]

export default routes

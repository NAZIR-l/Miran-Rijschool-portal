
const routes = [

  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Dashboard', component: () => import('pages/IndexPage.vue') },
      { path: 'account', name: 'Account', component: () => import('pages/AccountPage.vue') },
      { path: 'orders', name: 'Orders', component: () => import('pages/OrdersPage.vue') },
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

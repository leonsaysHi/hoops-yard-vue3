const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/su-reserva/:id',
    name: 'record-view',
    component: () => import('@/views/RecordView.vue')
  },
  {
    path: '/estimation-print',
    name: 'EstimationPrint',
    component: () => import('@/views/estimates/Print.vue')
  },
  {
    path: '/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/LoginView.vue')
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminView.vue'),
    meta: {
      authRequired: ['team', 'admin']
    },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('@/views/admin/RegisterView.vue')
      },
      {
        path: 'products',
        name: 'AdminProducts',
        meta: {
          authRequired: ['admin']
        },
        component: () => import('@/views/admin/products/ProductsView.vue')
      },

      {
        path: 'history',
        name: 'AdminHistory',
        meta: {
          authRequired: ['admin']
        },
        component: () => import('@/views/admin/history/HistoryView.vue')
      }
    ]
  }
]

export default routes

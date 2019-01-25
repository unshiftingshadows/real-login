
const routes = [
  {
    path: '/',
    component: () => import('layouts/default.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'invite', component: () => import('pages/Invite.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/default.vue'),
    children: [
      { path: ':app', component: () => import('pages/Login.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

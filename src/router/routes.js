const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: 'chat' },
      { path: 'chat', name: 'chat', component: () => import('pages/Chat.vue') },
      { path: 'notifications', name: 'notifications', component: () => import('pages/Notifications.vue') },
      { path: 'settings', name: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'signin', name: 'signin', component: () => import('pages/SignIn.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;

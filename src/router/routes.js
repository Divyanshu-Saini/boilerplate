import { IPC_MESSAGES } from 'app/constant';
import {Auth} from 'aws-amplify';
import { LocalStorage, Platform } from 'quasar';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', redirect: 'chat' },
      { path: 'chat', name: 'chat', component: () => import('pages/Chat.vue') , beforeEnter:sessionResolver},
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

async function sessionResolver (to,from,next){
        if(Platform.is.ios ||  Platform.is.android){
          LocalStorage.set('botSession', { id_token : 'somerandomIdtoken'});
          next();
        }
        let session =  LocalStorage.getItem('botSession');
        console.info('Get Session :',session);
        if(!session){
          const session = await Auth.currentSession();
          console.info('Adding Session :', session)
          LocalStorage.set('botSession', session);
        }
        next();
 };

export default routes;

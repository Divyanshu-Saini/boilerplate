<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-avatar size="32px">
          <img :src="this.$store.state.global.bot.avatarUrl" />
        </q-avatar>
        <q-toolbar-title v-html="this.$store.state.global.bot.name"> </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-white-1">
      <q-scroll-area style="height: calc(100% - 164px); margin-top: 164px; border-right: 1px solid #ddd">
        <q-list>
          <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        </q-list>
        <q-list style="height: calc(100% - 50px); margin-top: 260px;">
          <q-btn flat dense round icon="power_settings_new" aria-label="power_settings_new" color="accent" @click="signOut()" />
          <label>Version: {{appVersion}}</label>
        </q-list>
      </q-scroll-area>
      <q-list class="absolute-top" style="border-bottom: 1px solid #ddd">
        <q-item v-ripple style="padding: 0 0 20px 0; border-right: 1px solid #ddd">
          <q-img contain position="0 0" height="60px" src="images/wv_top_small.png"> </q-img>
        </q-item>
        <q-item v-ripple style="padding: 0 0 20px 18px; border-right: 1px solid #ddd">
          <q-item-section side>
            <q-avatar size="38px" color="warning">
              <img :src="this.$store.state.global.user.photoUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="this.$store.state.global.user.name"></q-item-label>
            <q-item-label caption lines="1">
              <q-btn
                key="Personalize"
                align="left"
                color="warning"
                outline
                no-caps
                size="sm"
                label="Personalize"
                @click="personalise()"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';
import { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import { Loading } from 'quasar';
import { mapActions } from "vuex";
import { version } from '../../package';
import { LocalStorage } from 'quasar';

import * as subscriptions from '../graphql/subscriptions';
import { IPC_MESSAGES } from 'app/constant';

//import { remote } from 'electron';
//import axios from 'axios';
LocalStorage.set('appVersion', version);

const linksData = [
  {
    title: 'Chat',
    caption: 'Get assistance on your routine tasks',
    icon: 'question_answer',
    link: 'chat',
    color: 'primary'
  },
  {
    title: 'Notifications',
    caption: 'Take a look at and act on your notifications',
    icon: 'notifications',
    link: 'notifications',
    color: 'accent'
  },
  {
    title: 'Settings',
    caption: 'Personalize my behaviour',
    icon: 'settings',
    link: 'settings',
    color: 'secondary'
  },
  {
    title: 'Feedback',
    caption: 'Feel free to write your review',
    icon: 'feedback',
    link: 'feedback',
    color: 'warning'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      notificationUSubscription: undefined,
      notificationCSubscription:undefined,
      personaliseCSubscription:undefined,
      personaliseUSubscription:undefined,
      appVersion:version
    };
  },
  created() {
    console.log(this.$store.state.global.bot.avatarUrl);
    console.log(this.$store.state.global.user.photoUrl);
    this.setNotification();
    this.subscribeToNotifications();
    this.subscribeToPersonalise();
    Hub.listen('auth', this.handleAuthEvents);
  },
  methods: {
    ...mapActions('notification', ['setNotification', 'pushNotification']),

    showNotif(position, args={}) {
      const notifyArgs ={
        message :args.message,
        position,
        multiLine:true,
        timeout: Math.random() * 10000 + 10000
      };
      if( args.type === 'Cowin-Status'){
        notifyArgs.actions = args.actions
      }
      this.$q.notify(notifyArgs);
    },

    personalise() {
      const message = {
        type: 'human',
        text: 'Personalise'
      };
      this.$store.dispatch('postTextMessage', message);
    },

    handleAuthEvents(data) {
      switch (data.payload.event) {
        case 'signIn':
          this.fillUserInfo(data.payload.event, true);
          //this.subscribeToNotifications();
          console.log('user signed in');
          break;
        case 'signOut':
        case 'oAuthSignOut':
          //this.unsubscribeToNotifications();
          this.clearUserInfo(data.payload.event, true);
          console.log('user signed out');
          break;
        case 'signIn_failure':
          //this.unsubscribeToNotifications();
          this.clearUserInfo(data.payload.event, true);
          console.log('user sign in failed');
          break;
        case 'tokenRefresh':
          this.fillUserInfo(data.payload.event, false);
          //this.subscribeToNotifications();
          console.log('token refresh succeeded');
          break;
        case 'tokenRefresh_failure':
          //this.unsubscribeToNotifications();
          this.clearUserInfo(data.payload.event, true);
          console.log('token refresh failed');
          break;
        case 'configured':
          console.log('the Auth module is configured');
          break;
      }
    },

    async signIn() {
      Loading.show({
        message: 'I\'m signing you in.<br/><span class="text-orange text-weight-bold">Hang on...</span>'
      });
      Auth.federatedSignIn();
    },

    fillUserInfo(eventType, shouldRedirectToHome) {
      Auth.currentAuthenticatedUser({ bypassCache: true })
        .then(async (userInfo) => {
          let credential = await Auth.currentCredentials();
          this.$store.commit('global/setUser', {
            isSignedIn: true,
            lastSignedInState: eventType,
            id: userInfo.attributes == undefined ? userInfo['username'] : userInfo.username,
            firstName: userInfo.attributes == undefined ? userInfo['given_name'] : userInfo.attributes['given_name'],
            lastName: userInfo.attributes == undefined ? userInfo['family_name'] : userInfo.attributes['family_name'],
            name: userInfo.attributes == undefined ? userInfo['name'] : userInfo.attributes['name'],
            email: userInfo.attributes == undefined ? userInfo['email'] : userInfo.attributes['email'],
            upn:
              userInfo.attributes == undefined
                ? JSON.parse(userInfo['identities'])[0].userId
                : JSON.parse(userInfo.attributes['identities'])[0].userId,
            chatUserId:
              userInfo.attributes == undefined
                ? userInfo['custom:ldsobjectGUID']
                : userInfo.attributes['custom:ldsobjectGUID'],
            photoUrl: 'images/person_48.png',
            identityId: credential.identityId
          });
          if (shouldRedirectToHome) {
            if (this.$q.platform.is.electron) {
              this.$router.push({ name: 'home' });
            } else {
              this.$router.go('/');
            }
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          if (this.$q.platform.is.electron) {
            const vuex = JSON.parse(this.$q.localStorage.getItem('vuex'));
            this.$q.electron.ipcRenderer.invoke(IPC_MESSAGES.STORE_USER, vuex.global.user);
          }
          Loading.hide();
        });
    },

    signOut() {
      Loading.show({
        message: 'I\'m signing you out.<br/><span class="text-orange text-weight-bold">Hang on...</span>'
      });
      Auth.signOut({ global: true });
      this.$q.localStorage.clear();
      if (this.$q.platform.is.electron) {
        this.$q.electron.ipcRenderer.send(IPC_MESSAGES.CLEAR_STORAGE);
      }
    },

    clearUserInfo(eventType, shouldRedirectToSignIn) {
      this.$store.commit('global/setUser', {
        isSignedIn: false,
        lastSignedInState: eventType,
        id: '',
        firstName: '',
        lastName: '',
        name: 'Not signed in',
        email: '',
        upn: '',
        chatUserId: '',
        photoUrl: 'images/person_48.png'
      });
      Loading.hide();
      if (shouldRedirectToSignIn) {
        if (this.$q.platform.is.electron) {
          this.$router.push({ name: 'signin' });
        } else {
          this.$router.go('/signin');
        }
      }
    },

    subscribeToNotifications() {
      this.notificationUSubscription = API.graphql(graphqlOperation(subscriptions.onUpdateNotifications)).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          let target = JSON.parse(value.data.onUpdateNotifications.Targets);
          let actions = value.data.onUpdateNotifications.Actions ? JSON.parse(value.data.onUpdateNotifications.Actions) :null;
          for (const t of target)
            if (t.id == this.$store.state.global.user.email) {
              const args = {message:value.data.onUpdateNotifications.Message};
              if(value.data.onUpdateNotifications.Subject === 'Cowin-Status'){
                args.type = 'Cowin-Status';
                args.multiLine=true;
                if(actions && actions.length > 0){
                  console.log(actions);
                  args.actions= [ ];
                  for(const a of actions){
                    const action = {
                      label:a.label, 
                      color: 'blue', 
                      handler: () => { 
                      const message = {type: 'human',text: a.message};
                      this.$store.dispatch('postTextMessage', message);
                      }
                    };
                     args.actions.push(action)
                  }
                }
              }
              this.showNotif('top', args);
            }
        },
        error: (error) => console.warn(error)
      });
      this.notificationCSubscription = API.graphql(graphqlOperation(subscriptions.onCreateNotifications)).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          let target = JSON.parse(value.data.onCreateNotifications.Targets);
          let actions = value.data.onCreateNotifications.Actions ? JSON.parse(value.data.onCreateNotifications.Actions) :null;
          for (const t of target)
            if (t.id == this.$store.state.global.user.email) {
              const args = {message:value.data.onCreateNotifications.Message};
              if(value.data.onCreateNotifications.Subject === 'Cowin-Status'){
                args.type = 'Cowin-Status';
                args.multiLine=true;
                if(actions && actions.length > 0){
                  console.log(actions);
                  args.actions= [ ];
                  for(const a of actions){
                    const action = {
                      label:a.label, 
                      color: 'blue', 
                      handler: () => { 
                      const message = {type: 'human',text: a.message};
                      this.$store.dispatch('postTextMessage', message);
                      }
                    };
                     args.actions.push(action)
                  }
                }
              }
              this.showNotif('top', args);
            }
        },
        error: (error) => console.warn(error)
      });
    },
    
    subscribeToPersonalise() {
      this.personaliseUSubscription = API.graphql(graphqlOperation(subscriptions.onUpdatePersonalize)).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          if (value.data.onUpdatePersonalize.userId == this.$store.state.global.user.email) {
            let perObj = {
              name: value.data.onUpdatePersonalize.botName,
              avatarUrl: value.data.onUpdatePersonalize.avatarUrl
            };
            this.$store.commit('global/setBot', perObj);
          }
        },
        error: (error) => console.warn(error)
      });
      this.personaliseCSubscription = API.graphql(graphqlOperation(subscriptions.onCreatePersonalize)).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          if (value.data.onCreatePersonalize.userId == this.$store.state.global.user.email) {
            let perObj = {
              name: value.data.onCreatePersonalize.botName,
              avatarUrl: value.data.onCreatePersonalize.avatarUrl
            };
            this.$store.commit('global/setBot', perObj);
          }
        },
        error: (error) => console.warn(error)
      });
    }
  }
};
</script>

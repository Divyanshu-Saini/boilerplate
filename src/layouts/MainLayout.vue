<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-avatar size="32px">
          <img :src="this.$store.state.global.bot.avatarUrl" />
        </q-avatar>
        <q-toolbar-title v-html="this.$store.state.global.bot.name"> </q-toolbar-title>

        <q-chip clickable square color="white" outline>
          <q-avatar size="24px" color="warning">
            <img :src="this.$store.state.global.user.photoUrl" />
          </q-avatar>
          <span v-html="this.$store.state.global.user.name"></span>
          <q-menu auto-close fit transition-show="scale" transition-hide="scale">
            <q-list>
              <q-item clickable v-if="!this.$store.state.global.user.isSignedIn" v-close-popup @click="signIn()">
                <q-item-section>Sign In</q-item-section>
              </q-item>
              <q-item clickable v-if="this.$store.state.global.user.isSignedIn" v-close-popup @click="personalise()">
                <q-item-section>Personalize</q-item-section>
              </q-item>
              <q-item clickable v-if="this.$store.state.global.user.isSignedIn" v-close-popup @click="signOut()">
                <q-item-section>Sign Out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-white-1">
      <q-scroll-area style="height: calc(100% - 164px); margin-top: 164px; border-right: 1px solid #ddd">
        <q-list>
          <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
      <q-list class="absolute-top" style="border-bottom: 1px solid #ddd">
        <q-item v-ripple style="padding: 0 0 20px 0; border-right: 1px solid #ddd">
          <q-img contain position="0 0" height="60px" src="images/wv_top_small.png"> </q-img>
        </q-item>
        <q-item v-ripple style="padding: 0 0 20px 0; border-right: 1px solid #ddd">
          <q-item-section side>
            <q-avatar rounded size="48px">
              <img :src="this.$store.state.global.bot.avatarUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="this.$store.state.global.bot.name"></q-item-label>
            <q-item-label overline>Your Digital Buddy!</q-item-label>
            <q-item-label caption lines="1">
              <q-btn key="Personalize" align="left" color="warning" outline no-caps size="sm" label="Personalize"  @click="personalise()"/>
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

import * as subscriptions from '../graphql/subscriptions';

//import { remote } from 'electron';
//import axios from 'axios';

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
      ...mapActions("notification", ["setNotification","pushNotification"]),
    showNotif (position,message) {
      this.$q.notify({
        message,
        position,
        actions:  [
            { label: 'Dismiss', color: 'yellow', handler: () => { /* console.log('wooow') */ } }
          ],
        timeout: Math.random() * 5000 + 3000
      })
    },
    personalise() {
      const message = {
        type: "human",
        text: "Personalise",
      };
      this.$store.dispatch("postTextMessage", message);
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
            photoUrl: 'https://dev.d17tn2tjvjpqrl.amplifyapp.com/images/person_48.png',
            identityId:credential.identityId        
          });
          if (shouldRedirectToHome) {
            if (this.$q.platform.is.electron) {
              this.$router.push({name:'home'});
            } else {
              this.$router.go('/');
            }
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          Loading.hide();
        });
    },
    signOut() {
      Loading.show({
        message: 'I\'m signing you out.<br/><span class="text-orange text-weight-bold">Hang on...</span>'
      });
      Auth.signOut({ global: true });
      this.$q.localStorage.clear();
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
        photoUrl: 'https://dev.d17tn2tjvjpqrl.amplifyapp.com/images/person_48.png'
      });
      Loading.hide();
      if (shouldRedirectToSignIn) {
        if (this.$q.platform.is.electron) {
          this.$router.push({ name: 'signin'});
        } else {
          this.$router.go('/signin');
        }
      }
    },
     subscribeToNotifications() {
      this.notificationUSubscription = API.graphql(
        graphqlOperation(subscriptions.onUpdateNotifications)
      ).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          let target = JSON.parse(value.data.onUpdateNotifications.Targets);
          for(const t of target)
          if(t.id == this.$store.state.global.user.email){
             this.showNotif('top',value.data.onUpdateNotifications.Message);
          }
        },
        error: (error) => console.warn(error),
      });
      this.notificationCSubscription = API.graphql(
        graphqlOperation(subscriptions.onCreateNotifications)
      ).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          let target = JSON.parse(value.data.onCreateNotifications.Targets);
          for(const t of target)
          if(t.id == this.$store.state.global.user.email){
             this.showNotif('top',value.data.onCreateNotifications.Message);
          }
        },
        error: (error) => console.warn(error),
      });
    },
    subscribeToPersonalise() {
      this.personaliseUSubscription = API.graphql(
        graphqlOperation(subscriptions.onUpdatePersonalize)
      ).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          if(value.data.onUpdatePersonalize.userId == this.$store.state.global.user.email){
            let perObj= {
                name:value.data.onUpdatePersonalize.botName,
                avatarUrl:value.data.onUpdatePersonalize.avatarUrl
             }
             this.$store.commit('global/setBot', perObj);
          }
        },
        error: (error) => console.warn(error),
      });
      this.personaliseCSubscription = API.graphql(
        graphqlOperation(subscriptions.onCreatePersonalize)
      ).subscribe({
        next: ({ provider, value }) => {
          console.log({ provider, value });
          if(value.data.onCreatePersonalize.userId == this.$store.state.global.user.email){
             let perObj= {
                name:value.data.onCreatePersonalize.botName,
                avatarUrl:value.data.onCreatePersonalize.avatarUrl
             }
             this.$store.commit('global/setBot', perObj);
          }
        },
        error: (error) => console.warn(error),
      });
    }
  }
};
</script>

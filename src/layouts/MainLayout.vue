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
              <q-item clickable v-if="this.$store.state.global.user.isSignedIn" v-close-popup>
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
              <q-btn key="Personalize" align="left" color="warning" outline no-caps size="sm" label="Personalize" />
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
import { Auth, Hub, Amplify } from 'aws-amplify';
import { Loading } from 'quasar';

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
      essentialLinks: linksData
    };
  },
  created() {
    console.log(this.$store.state.global.bot.avatarUrl);
    console.log(this.$store.state.global.user.photoUrl);
    Hub.listen('auth', this.handleAuthEvents);
  },
  methods: {
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
            id: userInfo.username,
            firstName: userInfo.attributes['given_name'],
            lastName: userInfo.attributes['family_name'],
            name: userInfo.attributes['name'],
            email: userInfo.attributes['email'],
            upn: JSON.parse(userInfo.attributes['identities'])[0].userId,
            chatUserId: userInfo.attributes['custom:ldsobjectGUID'],
            photoUrl: '/images/person_48.png',
            identityId:credential.identityId
          });
          if (shouldRedirectToHome) {
            this.$router.push({name:'home'});
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
        photoUrl: '/images/person_48.png'
      });
      Loading.hide();
      if (shouldRedirectToSignIn) this.$router.go('/signin');
    }
  }
};
</script>

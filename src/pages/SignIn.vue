<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <q-chip size="24px">
        <q-avatar size="32px">
          <q-img src="/images/logo_64.png"></q-img>
        </q-avatar>
        For Better Virtual Assistant
      </q-chip>

      <div class="text-h5" style="opacity:.9">
        Sign in required
      </div>

      <div class="text-h6" style="opacity:.9">
        Either you haven't signed in or your session may have expired. I will need you to sign in before we can proceed
        further...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Sign In"
        no-caps
        @click="signIn()"
      />
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';
import { Loading } from 'quasar';

//import { remote } from 'electron';
//import axios from 'axios';
//import qs from 'qs';
//import { parse } from 'url';

export default {
  name: 'SignIn',
  methods: {
    async signIn() {
      Loading.show({
        message: 'I\'m signing you in.<br/><span class="text-orange text-weight-bold">Hang on...</span>'
      });
      Auth.federatedSignIn();
      return;
      /*const code = await this.signInWithPopup();
      const tokens = await this.fetchAccessTokens(code);
      const userInfo = await this.fetchProfile(tokens.access_token);
      //Auth.federatedSignIn()
      console.log(userInfo);

      //const { idToken, accessTokenExpirationDate } = {userInfo.idToken, ;
      //const userData = {
      //  name: userInfo.name,
      //  email: userInfo.email
      //};

      const credentials = await Auth.federatedSignIn(
        'ForBetterVirtualAssistant-Dev',
        { token: userInfo.idToken, expires_at: userInfo.accessTokenExpirationDate },
        { name: userInfo.name, email: userInfo.email }
      );

      if (credentials.authenticated) {
        resolve({
          identityId: credentials._identityId,
          idToken
        });
      } else {
        reject('Authentication failed');
      }*/
    }
  }
};
</script>

<style></style>

<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <q-chip size="24px">
        <q-avatar size="32px">
          <q-img src="/images/logo_64.png"></q-img>
        </q-avatar>
        For Better Virtual Assistant
      </q-chip>

      <div class="text-h5" style="opacity: 0.9">Sign in required</div>

      <div class="text-h6" style="opacity: 0.9">
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
        @click="signIn"
      />
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  name: 'SignIn',
  methods: {
    signIn: () => {
      Auth.federatedSignIn();
    }
  }
};
</script>

<style></style>

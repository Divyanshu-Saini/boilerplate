<template>
  <q-page class="row items-center justify-evenly">
    <h1>Settings</h1>
  </q-page>
</template>

<script>
import { Auth, Cache } from 'aws-amplify';

export default {
  name: 'Settings',
  async created() {
    console.info('Settings Reloded ...');
    const federatedInfo = Cache.getAllKeys();
    console.log('Cache :', federatedInfo);
    Auth.currentAuthenticatedUser().then((user) => {
      console.log('User', user);
    });
    Auth.currentCredentials().then((creds) => console.log('cred', creds));
    Auth.currentSession().then((session) => console.log('session ', session));
  }
};
</script>

<style></style>

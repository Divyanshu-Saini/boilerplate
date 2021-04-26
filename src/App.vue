<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
const config = {
  interactive: true,
  type: 'implicit',
  scopes: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
  clientId: '21q8icjokssarmr6q53vh2sioo',
  authorizationUri: 'https://fbvabox-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize',
  redirectUri: 'http://localhost/',
  state: 'RANDOM'
};

export default {
  name: 'App',
  async created() {
    console.info('Auth config :', config);
    const accessTokenObj = await this.$q.electron.ipcRenderer
      .invoke('oauth2-launchwebflow', config)
      .catch(error => console.error('Error invoking auth', error));
    console.info('AccessObject :', accessTokenObj);
  }
};
</script>

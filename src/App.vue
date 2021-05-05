<template>
  <div id="q-app" class="fbvafont">
    <router-view />
  </div>
</template>
<script>
import { Auth } from 'aws-amplify';
export default {
  name: 'App',
  async created() {
    // Verifying boot files initialisation
    console.log('Process :', process.env.NAME, process.env.PORT, process.env.POOLID, process.env.obj);
    console.log('LexWebUi :', this.$lexWebUi);
    console.log('lodasd :', this.$_);
    console.log('Axios :', this.$axios);
    console.log('I18n :', this.$i18n);
    console.log('moment :', this.$moment);
    const session = await Auth.currentSession();
    this.$q.localStorage.set('botSession', session);
    console.log('Session :', this.$q.localStorage.getItem('botSession'));
    console.log('Session :', session);
  }
};
</script>

<template>
  <div id="q-app" class="fbvafont">
    <router-view />
  </div>
</template>
<script>
import { IPC_MESSAGES } from 'app/constant';

export default {
  name: 'App',
  async created() {
    // Verifying boot files initialisation
    console.info('....App started');
    if (this.$q.platform.is.electron) {
      console.log('Inside IPC');
      this.$q.electron.ipcRenderer.send(IPC_MESSAGES.RESTORE_SESSION);
      this.$q.electron.ipcRenderer.on(IPC_MESSAGES.RESTORE_SESSION, (event, args) => {
        console.log('Args ...', args, this.$_.isEmpty(args));
        if (!this.$_.isEmpty(args)) {
          const { user } = args;
          this.$store.commit('global/setUser', user);
          this.$router.push({ name: 'home' });
        }
      });
    }
  }
};
</script>

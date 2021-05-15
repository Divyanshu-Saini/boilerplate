<template>
  <div id="q-app" class="fbvafont">
    <router-view />
  </div>
</template>
<script>
import{IPC_MESSAGES} from 'app/constant';

export default {
  name: 'App',
  async created() {
    if(this.$q.platform.is.electron){
      console.log('Inside IPC')
      this.$q.electron.ipcRenderer.send(IPC_MESSAGES.RESTORE_SESSION);
      this.$q.electron.ipcRenderer.on(IPC_MESSAGES.RESTORE_SESSION,(event,args)=>{
        this.$store.commit('global/setUser',args.users);
        this.$router.push({name:'home'});
      })
    }
    // Verifying boot files initialisation
    console.info('....App started');
    console.info('ENV :',process.env.ENV);
  }
};
</script>

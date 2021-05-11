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
    console.info('....App started');
    console.info('ENV :',process.env.ENV);
  }
};
</script>

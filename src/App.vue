<template>
  <div id="q-app" class="fbvafont">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created() {
    // Verifying boot files initialisation
    console.log('LexWebUi :', this.$lexWebUi);
    console.log('lodasd :', this.$_);
    console.log('Axios :', this.$axios);
    console.log('I18n :', this.$i18n);
    console.log('moment :', this.$moment);
  }
};
</script>

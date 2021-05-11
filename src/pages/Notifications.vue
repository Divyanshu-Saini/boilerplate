<template>
  <q-page >
    <NotificationBrowser />
  </q-page>
</template>

<script>
import NotificationBrowser from 'components/NotificationBrowser';
import { mapActions } from "vuex";

export default {
  name: 'Notification',
  components:{
    NotificationBrowser
  },
  methods:{
      ...mapActions("notification", ["setNotification"]),
  },
  created(){
    this.setNotification();
  }
};
</script>

<style></style>

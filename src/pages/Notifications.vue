<template>
  <q-page >
    <NotificationBrowser />
  </q-page>
</template>

<script>
import NotificationBrowser from 'components/NotificationBrowser';

export default {
  name: 'Notification',
  components:{
    NotificationBrowser
  }
};
</script>

<style>
.q-table--dense .q-table thead tr, .q-table--dense .q-table tbody tr, .q-table--dense .q-table tbody td{
  height: 50px;
}
.q-table__title{
  color:rgb(29, 29, 29);

}
</style>


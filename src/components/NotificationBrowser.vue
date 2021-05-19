<template>
  <div class="q-pa-md">
    <q-table
      dense
      title="Notifications"
      :data="notifications"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :sort-method="customSort"
      :fullscreen.sync="isFullscreen"
      virtual-scroll
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import {  mapGetters } from "vuex";

export default {
  data () {
    return {
        filter:'',
        isFullscreen:false,
      columns: [
        {
          name: 'Subject',
          required: true,
          label: 'Subject',
          align: 'left',
          field: (row) => row.Subject,
          format: (val) => `${val}`,
          sortable: true,
        },
        { name: 'Message', align: 'center', label: 'Description', field: 'Message', sortable: true },
        { name: 'Priority', label: 'Priority', field: 'Priority', sortable: true },
        { name: 'Status', label: 'Status', field: 'Status', sortable: true },
        { name: 'ExpiresOn', label: 'Expire Date/Time', field: 'ExpiresOn', format:(val)=>this.$options.filters.formatDate(val),sortable: true },
      ]
    }
  },

  computed: {
    ...mapGetters("notification", ["notifications"]),
  },

  methods: {
    customSort (rows, sortBy, descending) {
      const data = [ ...rows ]

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b

          if (sortBy === 'name') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          }
          else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }

      return data
    }
  },
  mounted(){
    console.info('Notification :', this.notifications);
    console.info('Filters ', this.$options.filters)
  }
}
</script>

<style lang="scss">
.q-table--dense .q-table thead tr, .q-table--dense .q-table tbody tr, .q-table--dense .q-table tbody td{
  height: 50px;
}
.q-table__title{
  color:rgb(29, 29, 29);
}
</style>
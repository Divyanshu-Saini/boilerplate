<template>
  <div class="q-pa-md">
    <q-table
      :grid="$q.screen.sm ||  $q.screen.xs"
      :dense="$q.screen.md || $q.screen.lg"
      title="Notifications"
      :data="notifications"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :sort-method="customSort"
      :fullscreen.sync="isFullscreen"
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
import { mapActions, mapGetters } from "vuex";

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
          sortable: true
        },
        { name: 'Message', align: 'center', label: 'Description', field: 'Message', sortable: true },
        { name: 'Priority', label: 'Priority', field: 'Priority', sortable: true },
        { name: 'Status', label: 'Status', field: 'Status', sortable: true },
        { name: 'CreatedOn', label: 'Date/Time', field: 'CreatedOn', sortable: true },
      ]
    }
  },

  computed: {
    ...mapGetters("notifications", ["notifications"]),
  },

  methods: {
     ...mapActions("notifications", ["setNotification"]),
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

  created(){
    this.setNotification();
  }
}
</script>

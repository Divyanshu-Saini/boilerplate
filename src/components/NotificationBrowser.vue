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
       no-data-label="I didn't find any notification for you"
      virtual-scroll
      binary-state-sort
      class = "full-height bg-green-12"  
      separator="vertical"
    >   
      <template v-slot:top-right >
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
       <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
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
          classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white',
          field: (row) => row.Subject,
          format: (val) => `${val}`,
          sortable: true,
        },
        { name: 'Message', align: 'center', label: 'Description', field: 'Message', classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white', sortable: true },
        { name: 'Priority', label: 'Priority', field: 'Priority',  classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white',sortable: true },
        { name: 'Status', label: 'Status', field: 'Status',  classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white',sortable: true },
        { name: 'ExpiresOn', label: 'Expire Date/Time', field: 'ExpiresOn',  classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white',format:(val)=>this.$options.filters.formatDate(val),sortable: true , sortOrder: 'da'},
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

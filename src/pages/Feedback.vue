<template>
    <div class="column row justify-center items-center">
      <div class="row">
        <h5 class="text-h5 text-black q-my-md">Feedback</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
                <q-select
                  ref="area"
                  label="Area"
                  v-model="areaModel"
                  :options="options"
                  outline
                  class="q-ma-md q-mt-lg"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || 'Please select area',
                  ]"
                  ></q-select>
              <q-input v-model="description" type="textarea" label="Description" ref="description" lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']" outline />
            </q-form>
          </q-card-section>
          <q-card-actions class="row justify-center">
            <q-btn unelevated color="light-green-7" size="md" style="width: 30%; margin-top: 5%;" label="Submit" @click="getFeedback()" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
</template>

<script>
import { LocalStorage, Platform } from 'quasar';

export default {
    name: 'FeedbackForm',
    data: function () {
        return {
            areaModel: null,
            options: [
                {
                    label: 'Personalise',
                    value: 'pers'
                },
                {
                    label: 'AD Account',
                    value: 'ad'
                },
                {
                    label: 'Usability',
                    value: 'usab'
                },
                {
                    label: 'Other',
                    value: 'other'
                }
            ],
            description: ""
        }
    },
    methods: {
        getFeedback: async function() {
          this.$refs.area.validate()
          this.$refs.description.validate()
          if (this.$refs.area.hasError || this.$refs.description.hasError) {
            this.formHasError = true
          }
          else {
            var feedbackData = {};
            feedbackData.area = this.areaModel;
            feedbackData.description = this.description;
            feedbackData.version = LocalStorage.getItem('appVersion');
            feedbackData.userName = this.$store.state.global.user.name;
            feedbackData.currDateTime = new Date();
            console.log("Feedback Submitted!!!! :", feedbackData);
            this.$q.notify({
              position: 'bottom',
              timeout: 2000,
              icon: 'done',
              color: 'positive',
              message: 'Your feedback is submitted. Thanks!'
            })
          }
        }
    }
}
</script>

<style>
.q-card {
  width: 60vw;
}
</style>
import Vue from 'vue';
import moment from 'moment';

Vue.prototype.$moment = moment;

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm');
  }
});

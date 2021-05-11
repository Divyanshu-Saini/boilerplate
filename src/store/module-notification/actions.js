import { DataStore } from 'aws-amplify';
import { Notifications } from '../../models';

export async function setNotification(context) {
   context.dispatch('resetNotification');
  const notification = await DataStore.query(Notifications);
  console.log('In Notification Store :', notification);
  notification.map((ele) => {
    if (!this._vm.$_.isEmpty(ele)) {
      const temp = JSON.parse(JSON.stringify(ele));
      temp.Actions = JSON.parse(temp.Actions);
      console.log('Temp :', temp);
      context.dispatch('pushNotification', temp);
    }
  });
}

export async function pushNotification(context, notification) {
     context.commit('pushNotification', notification);
}

export async function resetNotification(context){
    context.commit('resetNotification',);
}

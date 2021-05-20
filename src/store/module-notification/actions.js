import { DataStore } from 'aws-amplify';
import { Notifications } from '../../models';

export async function setNotification(context,user) {
  context.dispatch('resetNotification');
  const notification = await DataStore.query(Notifications);
  console.log('In Notification Store :', notification);
  notification.map((ele) => {
    if (!this._vm.$_.isEmpty(ele)) {
      const temp = JSON.parse(JSON.stringify(ele));
      temp.Actions = JSON.parse(temp.Actions);
      temp.Targets = JSON.parse(temp.Targets);
      if(temp.Targets && temp.Targets.length > 0){
        if(temp.Targets.some((ele)=>ele.id===user)){
          context.dispatch('pushNotification', temp);
        }
      }
    }
  });
}

export async function pushNotification(context, notification) {
     context.commit('pushNotification', notification);
}

export async function resetNotification(context){
    context.commit('resetNotification',);
}

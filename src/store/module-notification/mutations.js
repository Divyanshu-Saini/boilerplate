export function pushNotification(state, notification) {
 state.notifications.push(notification);
};

export function resetNotification(state){
    state.notifications = []
}

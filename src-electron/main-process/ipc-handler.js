import Store from 'electron-store';

export const electron_store = new Store();
export async function storeUser(event, args) {
  console.info('Event :', event);
  console.info('Args :', args);
  electron_store.set('user', args);
}

export function storeSession(event, args) {
  console.log('Event :', event);
  console.log('args ', args);
  electron_store.set('botSession', args);
}

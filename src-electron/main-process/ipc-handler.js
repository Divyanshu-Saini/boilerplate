import Store from 'electron-store';

export const electron_store = new Store();
export async function storeUser(event, args) {
  console.info('storeUser channel execution started ...');
  electron_store.set('user', args);
  console.info('storeUser channel execution completed ...');
}

export function storeSession(event, args) {
  console.info('storeSession channel execution started ...');
  electron_store.set('botSession', args);
  console.info('storeSession channel execution completed ...');
}

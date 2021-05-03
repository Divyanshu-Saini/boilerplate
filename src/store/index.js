import Vue from 'vue';
import Vuex from 'vuex';
import { Store as LexWebUiStore } from 'nds-aws-lex-web-ui';
import global from './module-global';
import createPersistedState from 'vuex-persistedstate';

// import example from './module-example'

Vue.use(Vuex);

const globalState = createPersistedState({
  //  paths: ['global']
});

/*1
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store(
    Object.assign({}, LexWebUiStore, {
      modules: {
        global
      },
      plugins: [globalState],
      // enable strict mode (adds overhead!)
      // for dev mode only
      strict: process.env.DEBUGGING
    })
  );

  return Store;
}

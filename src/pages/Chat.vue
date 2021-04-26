<template>
  <q-page>
    <lex-web-ui v-on:updateLexState="onUpdateLexState"></lex-web-ui>
  </q-page>
</template>

<script>
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'nds-aws-lex-web-ui/dist/lex-web-ui.css';

Vue.use(Vuetify);

export default {
  name: 'Chat',
  methods: {
    onUpdateLexState(lState) {
      console.log('Lex State :', lState);
    }
  }
};
</script>

<style lang="scss">
#lex-web {
  .application--wrap {
    min-height: 92vh !important;
  }
  .message-list-container {
    position: absolute;
  }
}
</style>

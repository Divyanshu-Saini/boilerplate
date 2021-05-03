<template>
  <q-page>
    <lex-web-ui v-on:updateLexState="onUpdateLexState" v-if="initialiseLex"></lex-web-ui>
  </q-page>
</template>

<script>
import Vue from 'vue';
import Vuetify from 'vuetify';
import { Auth } from 'aws-amplify';
import { CognitoIdentityCredentials } from 'aws-sdk/global';
import 'vuetify/dist/vuetify.min.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'nds-aws-lex-web-ui/dist/lex-web-ui.css';

Vue.use(Vuetify);

export default {
  name: 'Chat',
  data() {
    return {
      initialiseLex: false
    };
  },
  methods: {
    onUpdateLexState(lState) {
      console.log('Lex State :', lState);
    },
    initialiseBot(sessionId) {
      console.log('Session Id :', sessionId);
      this.$store.commit('updateLexState', { sessionId });
      const params = {
        botAliasId: 'EQJNACDMHP',
        botId: 'SDODKAAQQJ',
        localeId: 'en_US',
        sessionId: sessionId
      };
      this.$lexWebUi.lexRuntimeV2Client.getSession(params, (error, data) => {
        if (error) {
          console.log('Error in getSession :', error);
          const putParams = {
            ...params,
            sessionState: {}
          };
          this.setSession(putParams);
          this.getInitialResponse({ ...params, text: 'InitMsg' });
        }
        console.log('Get Session data :', data);
        const putParams = {
          sessionState: {},
          ...params,
          ...data
        };
        delete putParams['interpretations'];
        this.setSession(putParams);
      });
    },
    setSession(params) {
      this.$lexWebUi.lexRuntimeV2Client.putSession(params, (error, data) => {
        if (error) {
          console.log('Error in put session :', error);
        }
        console.log('New Session :', data);
      });
    },
    getInitialResponse(params) {
      this.$lexWebUi.lexRuntimeV2Client.recognizeText(params, (err, res) => {
        if (err) {
          console.error('Error in RecogniseText :', err);
        }
        console.log('Data from recogniseText :', res);
        if (res.sessionState) {
          // this is v2 response
          res.sessionAttributes = res.sessionState.sessionAttributes;
          res.dialogState = res.sessionState.intent.state;
          const finalMessages = [];
          if (res.messages && res.messages.length > 0) {
            res.messages.forEach(mes => {
              if (mes.contentType === 'ImageResponseCard') {
                res.responseCard = {};
                res.responseCard.version = '1';
                res.responseCard.contentType = 'application/vnd.amazonaws.card.generic';
                res.responseCard.genericAttachments = [];
                res.responseCard.genericAttachments.push(mes.imageResponseCard);
              } else {
                /* eslint-disable no-lonely-if */
                if (mes.contentType) {
                  // push v1 style messages for use in the UI
                  const v1Format = {
                    type: mes.contentType,
                    value: mes.content
                  };
                  finalMessages.push(v1Format);
                }
              }
            });
          }
          if (finalMessages.length > 0) {
            const msg = `{"messages": ${JSON.stringify(finalMessages)} }`;
            res.message = msg;
          }
          console.log('Res$$$$->', res);
          let response = res;

          if (response.sessionState || (response.message && response.message.includes('{"messages":'))) {
            if (response.message && response.message.includes('{"messages":')) {
              const tmsg = JSON.parse(response.message);
              if (tmsg && Array.isArray(tmsg.messages)) {
                tmsg.messages.forEach((mes, index) => {
                  let alts = JSON.parse(response.sessionAttributes.appContext || '{}').altMessages;
                  if (mes.type === 'CustomPayload' || mes.contentType === 'CustomPayload') {
                    if (alts === undefined) {
                      alts = {};
                    }
                    alts.markdown = mes.value ? mes.value : mes.content;
                    alts.customPayload = JSON.parse(alts.markdown.replace(/\r?\n|\r/g, ''));
                    alts.isCustom = true;
                  }
                  if ((mes.value && mes.value.length > 0) || (mes.content && mes.content.length > 0)) {
                    let text = mes.value ? mes.value : mes.content;
                    if (alts && alts.isCustom) {
                      text = null;
                    }
                    this.$store.dispatch('pushMessage', {
                      text,
                      type: 'bot',
                      dialogState: this.$store.state.lex.dialogState,
                      responseCard:
                        tmsg.messages.length - 1 === index // attach response card only
                          ? response.responseCard
                          : undefined, // for last response message
                      alts
                    });
                  }
                });
              }
            }
          } else {
            let alts = JSON.parse(response.sessionAttributes.appContext || '{}').altMessages;
            let responseCardObject = JSON.parse(response.sessionAttributes.appContext || '{}').responseCard;
            if (response.messageFormat === 'CustomPayload') {
              if (alts === undefined) {
                alts = {};
              }
              alts.markdown = response.message;
            }
            if (responseCardObject === undefined) {
              responseCardObject = this.$store.state.lex.responseCard;
            }
            this.$store.dispatch('pushMessage', {
              text: response.message,
              type: 'bot',
              dialogState: this.$store.state.lex.dialogState,
              responseCard: responseCardObject, // prefering appcontext over lex.responsecard
              alts
            });
          }
          console.log('Process Response :', res);
        }
      });
    }
  },
  async created() {
    if (!this.$_.isEmpty(this.$store.state.global.user.chatUserId)) {
      this.initialiseBot(this.$store.state.global.user.chatUserId);
      this.$data.initialiseLex = true;
    }
    const credentials = await Auth.currentUserCredentials();
    const session = await Auth.currentSession();
    const poolId = 'us-east-1:cd7eef00-d2ae-4ed3-b68b-e19d3a5e1214';
    const region = 'us-east-1';
    const awscredentials = new CognitoIdentityCredentials(
      {
        IdentityPoolId: poolId,
        Logins: {
          'cognito-idp.us-east-1.amazonaws.com/us-east-1:cd7eef00-d2ae-4ed3-b68b-e19d3a5e1214': session.idToken.jwtToken
        }
      },
      { region }
    );
    console.info('Credential :', credentials, 'Session :', session.idToken.jwtToken, 'aws :', awscredentials);
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

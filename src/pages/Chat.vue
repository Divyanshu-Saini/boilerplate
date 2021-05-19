<template>
  <q-page>
    <div class="desk electron" v-if="$q.platform.is.electron || $q.platform.is.desktop">
      <lex-web-ui v-on:updateLexState="onUpdateLexState" v-if="initialiseLex"></lex-web-ui>
    </div>
    <div class="m-ios" v-if="$q.platform.is.ios">
      <lex-web-ui v-on:updateLexState="onUpdateLexState" v-if="initialiseLex"></lex-web-ui>
    </div>
    <div class="m-android" v-if="$q.platform.is.android">
      <lex-web-ui v-on:updateLexState="onUpdateLexState" v-if="initialiseLex"></lex-web-ui>
    </div>
    <q-banner inline-actions class="text-white bg-red" v-if="!initialiseLex">
      You donot have permission to use chat feature. Check with your admin!
    </q-banner>
  </q-page>
</template>

<script>
import Vue from 'vue';
import { LocalStorage, Platform } from 'quasar';
import Vuetify from 'vuetify';
import { Config as AWSConfig, CognitoIdentityCredentials } from 'aws-sdk/global';
import Polly from 'aws-sdk/clients/polly';
import LexRuntimeV2 from 'aws-sdk/clients/lexruntimev2';
import { Plugin as LexWebUi } from 'nds-aws-lex-web-ui';
import 'vuetify/dist/vuetify.min.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'nds-aws-lex-web-ui/dist/lex-web-ui.css';

Vue.use(Vuetify);

const poolId = 'us-east-1:b3dfe5d1-9bfc-419d-95c9-116e7aced9f0';
const region = 'us-east-1';
const credentials = new CognitoIdentityCredentials({ IdentityPoolId: poolId }, { region });
const awsConfig = new AWSConfig({ region, credentials, apiVersion: 'latest' });

// const lexRuntimeClient = new AWS.LexRuntimeV2(awsConfig);
// const store = new Vuex.Store(LexWebUiStore);
const lexRuntimeV2Client = new LexRuntimeV2(awsConfig);
const pollyClient = new Polly(awsConfig);

// const region = process.env.REGION;
// const poolId = process.env.POOL_ID;
// const poolName = `cognito-idp.${region}.amazonaws.com/${process.env.USER_POOL_ID}`;
// const session = LocalStorage.getItem('botSession');
// console.info('Chat Auth Session :', session);
// const token = Platform.is.electron ? session.id_token : session.idToken.jwtToken;
// console.log('Chat Token ', token, Platform.is.electron, poolName);
// AWS.config.region = 'us-east-1'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:b3dfe5d1-9bfc-419d-95c9-116e7aced9f0',
// });

// let authCred = new CognitoIdentityCredentials(
//   {
//     IdentityPoolId: poolId,
//     Logins: {
//       [poolName]: token
//     }
//   },
//   { region }
// );

// let unAuthCred = new CognitoIdentityCredentials(
//   {
//     IdentityPoolId: 'us-east-1:b3dfe5d1-9bfc-419d-95c9-116e7aced9f0',
//   },
//   { region }
// );
// console.log('CredChat auth:', authCred);
// console.log('CredChat unauth:', unAuthCred);
// TODO : use authrole
// const credentials = Platform.is.ios || Platform.is.android ? unAuthCred : authCred;
// const credentials = unAuthCred;
// console.log('CredChat:', credentials);
// const awsConfig = new AWSConfig({ region, unAuthCred });
// const lexRuntimeV2Client = new LexRuntimeV2(awsConfig);
// const pollyClient = new Polly(awsConfig);

let sessionObject = JSON.parse(LocalStorage.getItem('vuex'));
const sessionAttributes = {
  chatUserId: sessionObject.global.user.chatUserId,
  upn: sessionObject.global.user.upn,
  email:sessionObject.global.user.email
};

const config = {
  cognito: { poolId },
  lex: {
    sessionAttributes,
    botName: 'FBVA_Dev',
    initialUtterance: '',
    reInitSessionAttributesOnRestart: false,
    retryOnLexPostTextTimeout: 'true',
    retryCountPostTextTimeout: '2',
    v2BotId: process.env.V2_BOT_ID,
    v2BotAliasId: process.env.V2_BOT_ALIAS_ID,
    v2BotLocaleId: process.env.V2_BOT_LOCALE_ID,
    initialText: '',
    initialSpeechInstruction: ''
  },
  ui: {
    showHeader: false,
    toolbarTitle: 'Chat with Eva',
    toolbarLogo: '',
    positiveFeedbackIntent: 'Thumbs up',
    negativeFeedbackIntent: 'Thumbs down',
    helpIntent: 'Help',
    enableLogin: false,
    forceLogin: false,
    AllowSuperDangerousHTMLInMessage: true,
    shouldDisplayResponseCardTitle: false,
    saveHistory: true,
    minButtonContent: 'X',
    hideInputFieldsForButtonResponse: false,
    pushInitialTextOnRestart: false,
    directFocusToBotInput: false,
    showDialogStateIcon: false,
    backButton: false,
    messageMenu: true,
    hideButtonMessageBubble: false,
    showMessageDate: true
  },
  polly: {
    voiceId: 'Salli'
  },
  recorder: {
    enable: false,
    preset: 'speech_recognition'
  }
};

Vue.use(LexWebUi, {
  config,
  awsConfig,
  lexRuntimeV2Client,
  pollyClient
});

export default {
  name: 'Chat',
  data() {
    return {
      initialiseLex: false
    };
  },
  methods: {
    onUpdateLexState(lState) {
      console.info('Lex State :', lState);
    },
    initialiseBot(sessionId) {
      console.info('Session Id :', sessionId);
      this.$store.commit('updateLexState', { sessionId });
      const params = {
        botAliasId: 'EQJNACDMHP',
        botId: 'SDODKAAQQJ',
        localeId: 'en_US',
        sessionId: sessionId
      };
      this.$lexWebUi.lexRuntimeV2Client.getSession(params, (error, data) => {
        if (error) {
          const putParams = {
            ...params,
            sessionState: {}
          };
          this.setSession(putParams);
          this.getInitialResponse({ ...params, text: 'InitMsg', sessionState: { sessionAttributes } });
        }
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
          console.error('Error in put session :', error);
          return;
        }
        console.info('New Session :', data);
      });
    },
    getInitialResponse(params) {
      this.$lexWebUi.lexRuntimeV2Client.recognizeText(params, (err, res) => {
        if (err) {
          console.error('Error in RecogniseText :', err);
          return;
        }
        if (res.sessionState) {
          // this is v2 response
          res.sessionAttributes = res.sessionState.sessionAttributes;
          res.dialogState = res.sessionState.intent.state;
          const finalMessages = [];
          if (res.messages && res.messages.length > 0) {
            res.messages.forEach((mes) => {
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
        }
      });
    }
  },
  async created() {
    if (!this.$_.isEmpty(this.$store.state.global.user.identityId)) {
      this.initialiseBot('us-east-1:b3dfe5d1-9bfc-419d-95c9-116e7aced9f0');
      this.$data.initialiseLex = true;
    }
  }
};
</script>

<style lang="scss">
#lex-web {
  .message-list-container {
    position: absolute;
  }
}
.electron,
.desk {
  #lex-web {
    .application--wrap {
      min-height: 92vh !important;
    }
  }
}
.m-ios {
  #lex-web {
    .application--wrap {
      min-height: 88vh !important;
    }
  }
}

.m-android {
  #lex-web {
    .application--wrap {
      min-height: 88vh !important;
    }
  }
}
</style>

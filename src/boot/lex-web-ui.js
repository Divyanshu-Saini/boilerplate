import Vue from 'vue';

import { Config as AWSConfig, CognitoIdentityCredentials } from 'aws-sdk/global';
import Polly from 'aws-sdk/clients/polly';
import LexRuntimeV2 from 'aws-sdk/clients/lexruntimev2';

import { Plugin as LexWebUi } from 'nds-aws-lex-web-ui';

// const poolId = 'us-east-1:4f5d41a5-d758-4f6d-9c2b-66194b644f55';
// const poolId = 'us-east-1:cd7eef00-d2ae-4ed3-b68b-e19d3a5e1214';
const poolId = 'us-east-1:b3dfe5d1-9bfc-419d-95c9-116e7aced9f0';
const region = 'us-east-1';
const credentials = new CognitoIdentityCredentials(
  {
    IdentityPoolId: poolId,
    Logins: {
      'cognito-idp.us-east-1.amazonaws.com/us-east-1_tGdnURSRx': idTokenJwt
    }
  },
  { region }
);
const awsConfig = new AWSConfig({ region, credentials, apiVersion: 'latest' });

// const lexRuntimeClient = new AWS.LexRuntimeV2(awsConfig);
// const store = new Vuex.Store(LexWebUiStore);
const lexRuntimeV2Client = new LexRuntimeV2(awsConfig);
const pollyClient = new Polly(awsConfig);

const config = {
  cognito: { poolId },
  lex: {
    botName: 'FBVA_Dev',
    initialUtterance: '',
    reInitSessionAttributesOnRestart: false,
    retryOnLexPostTextTimeout: 'true',
    retryCountPostTextTimeout: '2',
    v2BotId: 'SDODKAAQQJ',
    v2BotAliasId: 'EQJNACDMHP',
    v2BotLocaleId: 'en_US',
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

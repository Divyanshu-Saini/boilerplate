import Vue from 'vue';

import { Config as AWSConfig, CognitoIdentityCredentials } from 'aws-sdk/global';
import Polly from 'aws-sdk/clients/polly';
import LexRuntimeV2 from 'aws-sdk/clients/lexruntimev2';

import { Plugin as LexWebUi } from 'nds-aws-lex-web-ui';

// const poolId = 'us-east-1:4f5d41a5-d758-4f6d-9c2b-66194b644f55';
// const poolId = 'us-east-1:cd7eef00-d2ae-4ed3-b68b-e19d3a5e1214';
const poolId = 'us-east-1:b3dfe5d1-9bfc-419d-95c9-116e7aced9f0';
const region = 'us-east-1';
const idtoken =
  'eyJraWQiOiJvOUhRZGkzdkc4dXJqS016ZERRU3IzalVDdkR5TUc3Mzc5M3hQNkpLZFh3PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiOG9IMV9mbWVYVWxqTV9JUTV1S0R3USIsInN1YiI6ImUwMTI1ZDA4LTY2MTUtNGRhMy04MzRlLTViNjMxYzQ2MGNiMyIsImN1c3RvbTpsZHNvYmplY3RHVUlEIjoiMDRkMGUyZWItNGExMS00MTFiLWExMzgtZTAyZDRmMGYyMzY5IiwiY29nbml0bzpncm91cHMiOlsidXMtZWFzdC0xX3RHZG5VUlNSeF9Gb3JCZXR0ZXJWaXJ0dWFsQXNzaXN0YW50LURldiJdLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX3RHZG5VUlNSeCIsImNvZ25pdG86dXNlcm5hbWUiOiJmb3JiZXR0ZXJ2aXJ0dWFsYXNzaXN0YW50LWRldl9kaXZ5YW5zaHUuYXdzQG5kc2dsb2JhbC5jb20iLCJnaXZlbl9uYW1lIjoiRGl2eWFuc2h1IiwiY3VzdG9tOm9iamVjdEdVSUQiOiI3MmViYzMzMy1kNmU1LTQwMWQtOTgwMy0yZjMyYTYzM2E0MDMiLCJhdWQiOiI0OTFjcjV1Mmx2aDFqMmMxZ3BrNjdjbXV1cSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6ImRpdnlhbnNodS5hd3NAbmRzZ2xvYmFsLmNvbSIsInByb3ZpZGVyTmFtZSI6IkZvckJldHRlclZpcnR1YWxBc3Npc3RhbnQtRGV2IiwicHJvdmlkZXJUeXBlIjoiU0FNTCIsImlzc3VlciI6Imh0dHBzOlwvXC9zdHMud2luZG93cy5uZXRcLzI5ZDIxMmY1LWQxZTEtNDY2NS05Zjk2LTNhODJlMjg2MzY2N1wvIiwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2MTk1MDcxMDA2ODQifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjE5NTA4MzU4LCJuYW1lIjoiRGl2eWFuc2h1IFNhaW5pIiwiZXhwIjoxNjIwMDMxNzE3LCJpYXQiOjE2MjAwMjgxMTcsImZhbWlseV9uYW1lIjoiU2FpbmkiLCJlbWFpbCI6ImRpdnlhbnNodS5hd3NAbmRzZ2xvYmFsLmNvbSJ9.ofH9ZTlCd8ZNMOEwlM_tFGsZYDLmr1OwLyWJsqlXBh5NYAuyqaAtG9ISk3dIJse20vtaPbBc-5-c0WdcFFgTa2ngkc9zkAxE4dmlRva59WXeXy1-p7mNinrIueiil31OsJHglGon5frSBovn_6Cmk2KoSVf76HgHIzGi7pskSA1kAhBNQ1BGTlY9U7gwZOZdTXvkVyUV3oYWMqv6wQY30xufJuyVfw3hJkYfdKyWThVQoUlXFP4fe9MuXekPTvlSlgaDHjv_iJX7_n6cQEHzjYzmtPhpVABBI3M4Dd6u4nSrH_PmA7rPJx7eKII9CwmJlcS_xgB5UTlCarNGX97DOw';
const credentials = new CognitoIdentityCredentials(
  {
    IdentityPoolId: poolId,
    Logins: {
      'cognito-idp.us-east-1.amazonaws.com/us-east-1_tGdnURSRx': idtoken
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

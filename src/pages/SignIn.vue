<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <q-chip size="24px">
        <q-avatar size="32px">
          <q-img src="images/logo_64.png"></q-img>
        </q-avatar>
        For Better Virtual Assistant
      </q-chip>

      <div class="text-h5" style="opacity: 0.9">Sign in required</div>

      <div class="text-h6" style="opacity: 0.9">
        Either you haven't signed in or your session may have expired. I will need you to sign in before we can proceed
        further...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Sign In"
        no-caps
        @click="signIn()"
      />
    </div>
  </div>
</template>

<script>
import { Auth, Hub, Amplify } from 'aws-amplify';
import { Loading, Platform } from 'quasar';

export default {
  name: 'SignIn',
  methods: {
    async signInSPA() {
      Auth.federatedSignIn();
    },
    async signInElectron() {
      let electron = await import('electron');
      let axios = await import('axios');
      let qs = await import('qs');
      let url = await import('url');
      const code = await this.signInWithPopup(electron, axios, qs, url);
      const tokens = await this.fetchAccessTokens(code, electron, axios, qs, url);
      const userInfo = await this.fetchProfile(tokens.access_token, electron, axios, qs, url);
      console.log(userInfo);
      console.log('Token ', tokens);
      this.$q.localStorage.set('botSession', tokens);
      const tokenData = {
        token: tokens.id_token,
        expires_at: tokens.expires_in * 1000 + new Date().getTime()
      };
      const userData = {
        name: userInfo.name,
        email: userInfo.email
      };

      const credentials = await Auth.federatedSignIn(
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_tGdnURSRx',
        tokenData,
        userInfo
      );
    },
    async signIn() {
      Loading.show({
        message: 'I\'m signing you in.<br/><span class="text-orange text-weight-bold">Hang on...</span>'
      });
      if (this.$q.platform.is.electron) {
        await this.signInElectron();
      } else if (this.$q.platform.is.android) {
      } else if (this.$q.platform.is.ios) {
      } else {
        this.signInSPA();
      }
    },
    async signInWithPopup(electron, axios, qs, url) {
      return new Promise((resolve, reject) => {
        const authWindow = new electron.remote.BrowserWindow({
          width: 500,
          height: 600,
          frame: false,
          show: true
        });

        const COGNITO_AUTHORIZATION_URL = 'https://fbvacore-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize';

        // TODO: Generate and validate PKCE code_challenge value
        const urlParams = {
          response_type: 'code',
          redirect_uri: 'http://localhost:8080/',
          client_id: '491cr5u2lvh1j2c1gpk67cmuuq',
          scope: 'openid profile email aws.cognito.signin.user.admin'
        };
        const authUrl = `${COGNITO_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`;

        function handleNavigation(urlTo) {
          //if (!url.includes('http://localhost:8080/')) return;
          const query = url.parse(urlTo, true).query;
          if (query) {
            if (query.error) {
              reject(new Error(`There was an error: ${query.error}`));
            } else if (query.code) {
              // Login is complete
              authWindow.removeAllListeners('closed');
              setImmediate(() => authWindow.close());
              // This is the authorization code we need to request tokens
              resolve(query.code);
            }
          }
        }

        authWindow.on('closed', () => {
          // TODO: Handle this smoothly
          Loading.hide();
          throw new Error('Auth window was closed by user');
        });

        const filter = {
          urls: ['http://localhost:8080/?code=' + '*']
        };

        authWindow.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
          const url = details.url;
          handleNavigation(url);
          callback({
            cancel: false
          });
        });

        authWindow.loadURL(authUrl);
      });
    },
    async fetchAccessTokens(code, electron, axios, qs, url) {
      const COGNITO_TOKEN_URL = 'https://fbvacore-dev.auth.us-east-1.amazoncognito.com/oauth2/token';
      const response = await axios.post(
        COGNITO_TOKEN_URL,
        qs.stringify({
          code,
          client_id: '491cr5u2lvh1j2c1gpk67cmuuq',
          redirect_uri: 'http://localhost:8080/',
          grant_type: 'authorization_code'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    },
    async fetchProfile(accessToken, electron, axios, qs, url) {
      const COGNITO_PROFILE_URL = 'https://fbvacore-dev.auth.us-east-1.amazoncognito.com/oauth2/userInfo';

      const response = await axios.get(COGNITO_PROFILE_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    }
  }
};
</script>

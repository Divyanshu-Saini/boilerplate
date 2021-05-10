import { Platform } from 'quasar';
import { Amplify, Auth } from 'aws-amplify';
import test from '../fbva-aws-exports-test';
import prod from '../fbva-aws-exports-prod';
import dev from '../fbva-aws-exports-dev';
import { route } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ router, store }) => {
  let awsIos, awsAndroid, awsmobile, awsDesktop, awsWeb;
  if (process.env.NODE_ENV == 'production') {
    awsIos = prod.awsIos;
    awsAndroid = prod.awsAndroid;
    awsmobile = prod.awsmobile;
    awsDesktop = prod.awsDesktop;
    awsWeb = prod.awsWeb;
  } else if (process.env.NODE_ENV == 'test') {
    awsIos = test.awsIos;
    awsAndroid = test.awsAndroid;
    awsmobile = test.awsmobile;
    awsDesktop = test.awsDesktop;
    awsWeb = test.awsWeb;
  } else {
    awsIos = dev.awsIos;
    awsAndroid = dev.awsAndroid;
    awsmobile = dev.awsmobile;
    awsDesktop = dev.awsDesktop;
    awsWeb = dev.awsWeb;
  }

  let awsCurrentConfig = null;

  if (Platform.is.mobile) {
    if (Platform.is.ios) awsCurrentConfig = awsIos;
    else if (Platform.is.android) awsCurrentConfig = awsAndroid;
    else awsCurrentConfig = awsmobile;
  } else if (Platform.is.electron && Platform.is.win) {
    awsCurrentConfig = awsDesktop;
  } else {
    awsCurrentConfig = awsWeb;
  }

  if (awsCurrentConfig != null) {
    Amplify.configure(awsCurrentConfig);

    //check for current session
    try {
      const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });
      const curSession = await Auth.currentSession();
      if (curSession.isValid()) {
        console.log('Already signed in with valid token');
      } else {
        console.log('Token invalid and will be refreshed');
        const refreshToken = curSession.getRefreshToken();
        userInfo.refreshSession(refreshToken);
      }
      //token validated, so safe to refill sign-in info
      store.commit('global/setUser', {
        isSignedIn: true,
        lastSignedInState: 'signIn',
        id: userInfo.username,
        firstName: userInfo.attributes['given_name'],
        lastName: userInfo.attributes['family_name'],
        name: userInfo.attributes['name'],
        email: userInfo.attributes['email'],
        upn: JSON.parse(userInfo.attributes['identities'])[0].userId,
        chatUserId: userInfo.attributes['custom:ldsobjectGUID'],
        photoUrl: '/images/person_48.png'
      });
    } catch (error) {
      console.log('Failed to authenticate existing token or token not present locally');
      store.commit('global/setUser', {
        isSignedIn: false,
        lastSignedInState: 'signIn_failure',
        id: '',
        firstName: '',
        lastName: '',
        name: 'Not signed in',
        email: '',
        upn: '',
        chatUserId: '',
        photoUrl: '/images/person_48.png'
      });
    }
  }
};

// import something here
import { Platform } from 'quasar';
import Amplify from 'aws-amplify';

import test from '../fbva-aws-exports-test';
import prod from '../fbva-aws-exports-prod';
import dev from '../fbva-aws-exports-dev';
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default (/* { app, router, Vue ... } */) => {
  // something to do
  let awsIos, awsAndroid, awsmobile, awsDesktop, awsWeb;
  if (process.env.NODE_ENV == 'prod') {
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

  if (Platform.is.mobile) {
    if (Platform.is.ios) Amplify.configure(awsIos);
    else if (Platform.is.android) Amplify.configure(awsAndroid);
    else Amplify.configure(awsmobile);
  } else if (Platform.is.electron || Platform.is.win) {
    Amplify.configure(awsDesktop);
  } else {
    Amplify.configure(awsWeb);
  }
};

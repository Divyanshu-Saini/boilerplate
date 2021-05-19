// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const { CoWINRequest, Channel, Personalize, Notifications } = initSchema(schema);

export {
  CoWINRequest,
  Channel,
  Personalize,
  Notifications
};
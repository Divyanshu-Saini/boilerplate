// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Channel, Personalize, Notifications } = initSchema(schema);

export {
  Channel,
  Personalize,
  Notifications
};
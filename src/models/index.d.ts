import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Channel {
  readonly id: string;
  readonly title: string;
  readonly isEnabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  constructor(init: ModelInit<Channel>);
  static copyOf(source: Channel, mutator: (draft: MutableModel<Channel>) => MutableModel<Channel> | void): Channel;
}
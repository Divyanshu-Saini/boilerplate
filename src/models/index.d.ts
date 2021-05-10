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

export declare class Personalize {
  readonly id: string;
  readonly userId: string;
  readonly botName: string;
  readonly avatarUrl: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  constructor(init: ModelInit<Personalize>);
  static copyOf(source: Personalize, mutator: (draft: MutableModel<Personalize>) => MutableModel<Personalize> | void): Personalize;
}

export declare class Notifications {
  readonly id: string;
  readonly AllowedChannels: string;
  readonly Targets: string;
  readonly ExpiresOn: string;
  readonly DeliveryStatus: string;
  readonly Status: string;
  readonly Priority: string;
  readonly Subject: string;
  readonly Message?: string;
  readonly Actions?: string;
  readonly AdditionalInfo?: string;
  readonly ReferenceInfo?: string;
  constructor(init: ModelInit<Notifications>);
  static copyOf(source: Notifications, mutator: (draft: MutableModel<Notifications>) => MutableModel<Notifications> | void): Notifications;
}
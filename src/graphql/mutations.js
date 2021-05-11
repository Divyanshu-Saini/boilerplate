/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChannel = /* GraphQL */ `
  mutation CreateChannel(
    $input: CreateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    createChannel(input: $input, condition: $condition) {
      id
      title
      isEnabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateChannel = /* GraphQL */ `
  mutation UpdateChannel(
    $input: UpdateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    updateChannel(input: $input, condition: $condition) {
      id
      title
      isEnabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteChannel = /* GraphQL */ `
  mutation DeleteChannel(
    $input: DeleteChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    deleteChannel(input: $input, condition: $condition) {
      id
      title
      isEnabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createPersonalize = /* GraphQL */ `
  mutation CreatePersonalize(
    $input: CreatePersonalizeInput!
    $condition: ModelPersonalizeConditionInput
  ) {
    createPersonalize(input: $input, condition: $condition) {
      id
      userId
      botName
      avatarUrl
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updatePersonalize = /* GraphQL */ `
  mutation UpdatePersonalize(
    $input: UpdatePersonalizeInput!
    $condition: ModelPersonalizeConditionInput
  ) {
    updatePersonalize(input: $input, condition: $condition) {
      id
      userId
      botName
      avatarUrl
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deletePersonalize = /* GraphQL */ `
  mutation DeletePersonalize(
    $input: DeletePersonalizeInput!
    $condition: ModelPersonalizeConditionInput
  ) {
    deletePersonalize(input: $input, condition: $condition) {
      id
      userId
      botName
      avatarUrl
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createNotifications = /* GraphQL */ `
  mutation CreateNotifications(
    $input: CreateNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    createNotifications(input: $input, condition: $condition) {
      id
      AllowedChannels
      Targets
      ExpiresOn
      DeliveryStatus
      Status
      Priority
      Subject
      Message
      Actions
      AdditionalInfo
      ReferenceInfo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateNotifications = /* GraphQL */ `
  mutation UpdateNotifications(
    $input: UpdateNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    updateNotifications(input: $input, condition: $condition) {
      id
      AllowedChannels
      Targets
      ExpiresOn
      DeliveryStatus
      Status
      Priority
      Subject
      Message
      Actions
      AdditionalInfo
      ReferenceInfo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteNotifications = /* GraphQL */ `
  mutation DeleteNotifications(
    $input: DeleteNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    deleteNotifications(input: $input, condition: $condition) {
      id
      AllowedChannels
      Targets
      ExpiresOn
      DeliveryStatus
      Status
      Priority
      Subject
      Message
      Actions
      AdditionalInfo
      ReferenceInfo
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCoWINRequest = /* GraphQL */ `
  query GetCoWINRequest($id: ID!) {
    getCoWINRequest(id: $id) {
      id
      userId
      sessionId
      pinCode
      isNotificationRequired
      notificationsDisabled
      notificationsDisabledAt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listCoWINRequests = /* GraphQL */ `
  query ListCoWINRequests(
    $filter: ModelCoWINRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCoWINRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        sessionId
        pinCode
        isNotificationRequired
        notificationsDisabled
        notificationsDisabledAt
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncCoWINRequests = /* GraphQL */ `
  query SyncCoWINRequests(
    $filter: ModelCoWINRequestFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCoWINRequests(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        userId
        sessionId
        pinCode
        isNotificationRequired
        notificationsDisabled
        notificationsDisabledAt
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getChannel = /* GraphQL */ `
  query GetChannel($id: ID!) {
    getChannel(id: $id) {
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
export const listChannels = /* GraphQL */ `
  query ListChannels(
    $filter: ModelChannelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChannels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        isEnabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncChannels = /* GraphQL */ `
  query SyncChannels(
    $filter: ModelChannelFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChannels(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        isEnabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPersonalize = /* GraphQL */ `
  query GetPersonalize($id: ID!) {
    getPersonalize(id: $id) {
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
export const listPersonalizes = /* GraphQL */ `
  query ListPersonalizes(
    $filter: ModelPersonalizeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPersonalizes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncPersonalizes = /* GraphQL */ `
  query SyncPersonalizes(
    $filter: ModelPersonalizeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPersonalizes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getNotifications = /* GraphQL */ `
  query GetNotifications($id: ID!) {
    getNotifications(id: $id) {
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
export const listNotificationss = /* GraphQL */ `
  query ListNotificationss(
    $filter: ModelNotificationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotificationss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncNotifications = /* GraphQL */ `
  query SyncNotifications(
    $filter: ModelNotificationsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncNotifications(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;

export const config = {
  // AUTH SETTINGS
  authCookie: 'authcookie', // name of the cookie
  authCookieExp: 'authcookieexp',
  authTimeStamp: 'authtimestamp',
  authType: 'authType',
  authRefreshBeforeMinutes: -5, // minutes before which we should refresh token
  authRefreshInterval: 1 /*minutes */ * 60000, // refresh interval
  authTokenDuration: 110 // minutes after refresh is no longer possible (inactivity of user)
};

// grid settings
export const configGrid = {
  allMode: 'page',
  checkBoxesMode: 'always',
  allowColumnResizing: true,
  allowColumnReordering: true,
  showRowLines: true,
  showBorders: true,
  columnAutoWidth: true,
  remoteOperations: true,
  focusStateEnabled: true,
  pinning: true,
  selectionMode: 'multiple', // "single" or "multiple" or  "none"
  sortingMode: 'single', // "single" or "multiple" or  "none"
  pager: {
    defaultPageSize: 20,
    showPageSizeSelector: true,
    allowedPageSizes: [20, 50, 100, 150],
    showNavigationButtons: true
  }
};
// allowed grid functions enumerator
export enum enumGridOperations {
  skip = 'skip',
  take = 'take',
  requireTotalCount = 'requireTotalCount',
  requireGroupCount = 'requireGroupCount',
  sort = 'sort',
  filter = 'filter',
  totalSummary = 'totalSummary',
  group = 'group',
  groupSummary = 'groupSummary'
}

// operators for filtering and search
export enum enumSearchFilterOperators {
  equal = 'eq',
  lessThan = 'lt',
  greaterThan = 'gt',
  lessOrEqualThan = 'lte',
  greaterOrEqualThan = 'gte',
  notEqual = 'neq',
  isNull = 'is null',
  isNotNull = 'is not null'
}

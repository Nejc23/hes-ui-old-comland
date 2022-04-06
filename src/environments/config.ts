import { environment } from 'src/environments/environment';

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

// operators for filtering and search
export enum enumSearchFilterOperators {
  equal = 'eq',
  lessThan = 'lt',
  greaterThan = 'gt',
  lessOrEqualThan = 'lte',
  greaterOrEqualThan = 'gte',
  notEqual = 'neq',
  isNull = 'is null',
  isNotNull = 'is not null',
  like = 'like'
}

// Ag grid settings
export const configAgGrid = {
  debug: environment.isDebug,
  animateRows: true,
  rowModelType: 'serverSide',
  suppressSizeToFit: true,
  paginationPageSize: 20,
  pagination: true,
  suppressRowClickSelection: true,
  rowSelection: 'multiple',
  multiSortKey: 'ctrl',
  domLayout: 'autoHeight',
  cacheOverflowSize: 2,
  maxConcurrentDatasourceRequests: 2
};

// Ag grid default columns settings
export const configAgGridDefCol = {
  sortable: true,
  resizable: true,
  suppressFiltersToolPanel: true,
  suppressColumnsToolPanel: true,
  floatingFilterComponentParams: { suppressFilterButton: true, suppressFiltersToolPanel: true, suppressColumnsToolPanel: true }
};

export const gridRefreshInterval = 60;

export const languages: Array<Language> = [
  { id: 'en', acceptLanguage: 'en-US' },
  { id: 'sl', acceptLanguage: 'sl-SI' },
  { id: 'de', acceptLanguage: 'de-DE' },
  { id: 'hr', acceptLanguage: 'hr_HR' },
  { id: 'fr', acceptLanguage: 'fr-FR' },
  { id: 'it', acceptLanguage: 'it-IT' },
  { id: 'cz', acceptLanguage: 'cs-CZ' }
];

export interface Language {
  id: string;
  acceptLanguage: string;
}

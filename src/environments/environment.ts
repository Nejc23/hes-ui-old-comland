// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: '',
  // apiMyGridUrl: '', // not use if URI for all apis (even actions) is the same
  cookiePath: '/',
  // dateTimeFormat: 'MM/DD/YYYY hh:mm A'  // MomentJS formatting
  dateTimeFormat: 'dd.MM.yyyy HH:mm',
  dateFormat: 'dd.MM.yyyy',
  timeFormat: 'HH:mm',
  kendoChartCategoryDateFormats: {
    minutes: 'HH:mm',
    hours: 'HH:mm',
    days: 'dd.MM',
    years: 'yyyy'
  },
  kendoPieChartLastSliceColor: '#9FB740',
  isDebug: true,
  licenseKey:
    'CompanyName=Comland d.o.o.,LicensedApplication=ePoint.HES,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-007624,ExpiryDate=2_April_2021_[v2]_MTYxNzMxODAwMDAwMA==c1dec7b42e4f2f63e2882709fbd9598f',

  // identitiy settings
  // stsAuthority: 'http://89.212.201.202:8081/',
  // clientId: 'epoint2',
  ignoreLocale: true,
  // clientRoot: 'http://localhost:4200/',
  // clientScope: 'openid profile roles offline_access company',
  // clientAutoSilentRenew: true
  sidebarAdministrationUsersUrl: 'https://is.enerdat.com:5443/reg/users'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

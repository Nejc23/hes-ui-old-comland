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
  fistDay: 1, // 1 == first day is monday
  timeFormat: 'HH:mm',
  timeFormatLong: 'HH:mm:ss',
  kendoChartCategoryDateFormats: {
    minutes: 'HH:mm',
    hours: 'HH:mm',
    days: 'dd.MM',
    years: 'yyyy'
  },
  kendoPieChartLastSliceColor: '#9FB740',
  isDebug: true,
  licenseKey:
    'CompanyName=Metricsx d.o.o.,LicensedApplication=myGrid,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=4,AssetReference=AG-014718,ExpiryDate=2_April_2022_[v2]_MTY0ODg1NDAwMDAwMA==b6b19ef125d7b53b06e4ca6a3e6461c2',
  ignoreLocale: true,
  thresholdValue: 7 // preconfigured threshold value in days
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

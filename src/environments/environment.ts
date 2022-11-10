// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost/',
  // apiMyGridUrl: '', // not use if URI for all apis (even actions) is the same
  cookiePath: '/',
  // dateTimeFormat: 'MM/DD/YYYY hh:mm A'  // MomentJS formatting
  dateTimeFormat: 'dd.MM.yyyy HH:mm',
  dateTimeFileFormat: 'DD-MM-yyyy_HH-mm',
  dateDisplayFormat: 'DD. MM. YYYY',
  dateOnlyFormat: 'DD. MM',
  dateFormat: 'dd.MM.yyyy',
  fistDay: 1, // 1 == first day is monday
  timeFormat: 'HH:mm',
  timeFormatLong: 'HH:mm:ss',
  decimalsFormat: 4,
  // https://docs.telerik.com/kendo-ui/globalization/intl/dateformatting#default-date-formats
  kendoChartCategoryDateFormats: {
    minutes: 't',
    hours: 't', // h:mm tt for en-US; HH:mm - for 24h format
    days: 'dd.MM',
    years: 'yyyy'
  },
  kendoChartCulture: 'de-DE',
  kendoPieChartLastSliceColor: '#9FB740',
  isDebug: true,
  licenseKey:
    'CompanyName=Metricsx d.o.o.,LicensedApplication=myGrid,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=4,AssetReference=AG-014718,ExpiryDate=2_April_2022_[v2]_MTY0ODg1NDAwMDAwMA==b6b19ef125d7b53b06e4ca6a3e6461c2',
  thresholdValue: 7, // preconfigured threshold value in days,
  mapBoxToken: 'pk.eyJ1IjoibWJ1bG92ZWMiLCJhIjoiY2tzb2tqenNsMG54YTJwbzZ3M3JmcW1xOCJ9.Yvtz-kegMWE4_uQuXjDxQA',
  importIdsMaxLength: 1500000,
  exportDataMaxRange: 60, // 60 months
  slaMedLimit: 90, // SLA colors
  slaHighLimit: 97,
  reKeyAfterDays: 3
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

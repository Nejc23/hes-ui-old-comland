export const environment = {
  production: true,
  apiUrl: 'https://localhost:8888/',
  // apiUrl: 'http://91.230.238.178/[api-url]',
  //  apiMyGridUrl: 'https://89.212.201.202:54322', // not use if URI for all apis (even actions) is the same
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
  kendoChartCategoryDateFormats: {
    minutes: 't',
    hours: 't',
    days: 'dd.MM',
    years: 'yyyy'
  },
  kendoChartCulture: 'de-DE',
  kendoPieChartLastSliceColor: '#9FB740',
  isDebug: false,
  licenseKey:
    'CompanyName=Metricsx d.o.o.,LicensedApplication=myGrid,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=4,AssetReference=AG-014718,ExpiryDate=2_April_2022_[v2]_MTY0ODg1NDAwMDAwMA==b6b19ef125d7b53b06e4ca6a3e6461c2',

  // identitiy settings
  // stsAuthority: 'http://89.212.201.202:8081/',
  // clientId: 'epoint3',
  thresholdValue: 7,
  mapBoxToken: 'pk.eyJ1IjoibWJ1bG92ZWMiLCJhIjoiY2tzb2tqenNsMG54YTJwbzZ3M3JmcW1xOCJ9.Yvtz-kegMWE4_uQuXjDxQA',
  // clientRoot: 'http://advance-hes.azurewebsites.net/npm run start',
  // clientScope: 'openid profile roles offline_access company',
  // clientAutoSilentRenew: true

  importIdsMaxLength: 800,
  exportDataMaxRange: 3
};

export const environment = {
  production: false,
  // apiUrl: 'http://91.230.238.178/[api-url]',
  //  apiMyGridUrl: 'https://89.212.201.202:54322', // not use if URI for all apis (even actions) is the same
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
  isDebug: false,
  licenseKey:
    'CompanyName=Metricsx d.o.o.,LicensedApplication=myGrid,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=4,AssetReference=AG-014718,ExpiryDate=2_April_2022_[v2]_MTY0ODg1NDAwMDAwMA==b6b19ef125d7b53b06e4ca6a3e6461c2',

  // identitiy settings
  // stsAuthority: 'http://89.212.201.202:8081/',
  // clientId: 'ePoint4-staging', // 'ePoint3'
  ignoreLocale: false
  // clientRoot: 'http://localhost/', // 'http://localhost/',//'http://advance-hes.azurewebsites.net/',
  // clientScope: 'openid profile roles offline_access company',
  // clientAutoSilentRenew: true
};

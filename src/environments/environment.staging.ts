export const environment = {
  production: false,
  apiUrl: 'http://91.230.238.178/[api-url]',
  apiMyGridUrl: 'https://89.212.201.202:54322',
  cookiePath: '/',
  // dateTimeFormat: 'MM/DD/YYYY hh:mm A'  // MomentJS formatting
  dateTimeFormat: 'dd.MM.yyyy HH:mm',
  dateFormat: 'dd.MM.yyyy',
  isDebug: false,
  licenseKey:
    'CompanyName=Comland d.o.o.,LicensedApplication=ePoint.HES,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-007624,ExpiryDate=2_April_2021_[v2]_MTYxNzMxODAwMDAwMA==c1dec7b42e4f2f63e2882709fbd9598f',

  // identitiy settings
  stsAuthority: 'http://89.212.201.202:8081/',
  clientId: 'ePoint4-staging', //'ePoint3'
  ignoreLocale: false,
  clientRoot: 'http://localhost/', ///'http://localhost/',//'http://advance-hes.azurewebsites.net/',
  clientScope: 'openid profile roles offline_access company',
  clientAutoSilentRenew: true
};

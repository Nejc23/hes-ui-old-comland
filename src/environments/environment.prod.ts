export const environment = {
  production: true,
  // Docker file for a minimal effort OpenStreetMap tile server https://github.com/Overv/openstreetmap-tile-server
  mapUrl: 'https://a.tile.openstreetmap.org', // TODO: put real server IP on production
  apiUrl: 'http://91.230.238.178/[api-url]',
  navFixedLogoUrl: 'assets/images/logo/amwera.png',
  cookiePath: '/',
  // dateTimeFormat: 'MM/DD/YYYY hh:mm A'  // MomentJS formatting
  dateTimeFormat: 'dd.MM.yyyy HH:mm',
  dateFormat: 'dd.MM.yyyy',
  isDebug: false,
  licenseKey:
    'CompanyName=Comland d.o.o.,LicensedApplication=ePoint.HES,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-007624,ExpiryDate=2_April_2021_[v2]_MTYxNzMxODAwMDAwMA==c1dec7b42e4f2f63e2882709fbd9598f'
};

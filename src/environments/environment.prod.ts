export const environment = {
  production: true,
  // Docker file for a minimal effort OpenStreetMap tile server https://github.com/Overv/openstreetmap-tile-server
  mapUrl: 'https://a.tile.openstreetmap.org', // TODO: put real server IP on production
  apiUrl: 'http://91.230.238.178/[api-url]',
  bigLogoUrl: 'assets/images/logo/cml-lg.png',
  smallLogoUrl: 'assets/images/logo/cml-sm.png',
  cookiePath: '/',
  // dateTimeFormat: 'MM/DD/YYYY hh:mm A'  // MomentJS formatting
  dateTimeFormat: 'DD.MM.YYYY HH:mm'
};

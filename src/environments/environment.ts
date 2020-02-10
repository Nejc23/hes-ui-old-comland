// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Docker file for a minimal effort OpenStreetMap tile server https://github.com/Overv/openstreetmap-tile-server
  // mapUrl: 'https://192.168.0.102/tile'
  mapUrl: 'https://a.tile.openstreetmap.org',
  apiUrl: '',
  bigLogoUrl: 'assets/images/logo/cml-lg.png',
  smallLogoUrl: 'assets/images/logo/cml-sm.png',
  cookiePath: '/',
  // dateTimeFormat: 'MM/DD/YYYY hh:mm A'  // MomentJS formatting
  dateTimeFormat: 'DD.MM.YYYY HH:mm'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

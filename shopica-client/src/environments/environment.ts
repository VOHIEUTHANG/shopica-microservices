// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userServiceUrl: 'http://localhost:5102',
  gatewayServiceUrl: 'http://localhost:5074',
  ghnAPIUrl: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
  tokenKey: 'token',
  awsFolder: 'shopica-files',
  emailToken: 'emailToken',
  databaseToken: 'databaseToken',
  recentlyViewedProductKey: 'recentlyViewedProductKey',
  ghnToken: 'aa3d5553-73e6-11eb-8be2-c21e19fc6803',
  loginMethod: 'loginMethod',
  USDToVND: 25000,
  backendDomain: [
    'localhost:5074',
    'localhost:5102',
    'shopica-api.hvtauthor.com',
  ],
  social: {
    google: {
      clientId:
        '249319704438-lfro6nilauqvmvgs80s7otgpq23um1pq.apps.googleusercontent.com',
    },
    facebook: {
      clientID: '2481894401990919',
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

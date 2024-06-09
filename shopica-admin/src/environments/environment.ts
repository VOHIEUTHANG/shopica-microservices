// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userServiceUrl: 'http://localhost:5102',
  gatewayServiceUrl: 'http://localhost:5074',
  messageServiceUrl: 'https://localhost:5003',
  ghnAPIUrl: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
  tokenKey: 'token',
  verifyKey: 'verifyKey',
  ghnToken: 'aa3d5553-73e6-11eb-8be2-c21e19fc6803',
  awsFolder: 'shopica-files',
  backendDomain: [
    'localhost:5074',
    'localhost:5102',
    'shopica-api.hvtauthor.com',
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

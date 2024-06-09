import { FactorySansProvider } from '@angular/core';
import { environment } from './../../../environments/environment';
import { JwtService } from './../services/jwt/jwt.service';
export function jwtOptionsFactory(jwtService: JwtService) {
  return {
    tokenGetter: () => {
      return jwtService.getToken();
    },
    authScheme: 'Bearer ',
    allowedDomains: environment.backendDomain,
    disallowedRoutes: [], // not token in header
  };
}

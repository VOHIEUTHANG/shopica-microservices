import { UtilitiesService } from './../services/utilities/utilities.service';
import { environment } from '@env';
export function jwtOptionsFactory(utilitiesService: UtilitiesService) {
  return {
    tokenGetter: () => {
      return utilitiesService.getToken();
    },
    authScheme: "Bearer ",
    allowedDomains: environment.backendDomain,
    disallowedRoutes: [], // not token in header
  }
}

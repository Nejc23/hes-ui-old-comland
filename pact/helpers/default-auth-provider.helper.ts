import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { HeaderInjectorInterceptor } from 'src/app/core/header-injector/interceptors/header-injector.interceptor';
import { TokenInterceptor } from 'src/app/core/auth/interceptors/token.interceptor';

let authServiceStub: Partial<AuthService>;

authServiceStub = {
  getAuthToken: () => 'token',
  getAuthTokenType: () => 'bearer',
  //  getAuthTokenMyGridLink: () => 'bearer token'
  isRefreshNeeded2: () => false
};

export const defaultAuthProvider = [
  {
    provide: AuthService,
    useValue: authServiceStub
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderInjectorInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }
];

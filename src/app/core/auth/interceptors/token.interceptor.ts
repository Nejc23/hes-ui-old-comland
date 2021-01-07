import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { enumMyGridLink } from '../../repository/consts/my-grid-link.const';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // authorization token for myGrid.Link API-s
    //    if (this.checkIfMyGridLinkUrl(request)) {
    //      return next.handle(this.createAuthorizationTokenMyGridLinkApi(request));
    //    } else {
    // authorization token for others API-s

    const accessExpired = this.authService.isRefreshNeeded2();

    if (!this.authService.getAuthToken()) {
      return next.handle(request);
    }

    if (accessExpired) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);

        this.authService.renewToken().then((value) => {
          this.authService.user = value;
          this.authService.saveTokenAndSetUserRights2(value, '');
          this.refreshTokenInProgress = false;
          return next.handle(this.createAuthorizationTokenApi(request));
        });
      }
    }

    return next.handle(this.createAuthorizationTokenApi(request));
    //    }
  }
  /*
  // authorization token for myGrid.Link API-s
  private createAuthorizationTokenMyGridLinkApi(request: HttpRequest<any>) {
    const authToken = `${this.authService.getAuthTokenMyGridLink()}`;

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    if (request.url.indexOf(enumMyGridLink.identityTokenServer) < 0) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `${authToken}`)
      });

      return authReq;
    }

    return request;
  }
*/
  // authorization token for other API-s
  private createAuthorizationTokenApi(request: HttpRequest<any>) {
    const authToken = `${this.authService.getAuthTokenType()} ${this.authService.getAuthToken()}`;

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `${authToken}`)
    });

    return authReq;
  } /*
  private checkIfMyGridLinkUrl(request: HttpRequest<any>) {
    const listOfMyLinkApiUrl = Object.values(enumMyGridLink);
    if (listOfMyLinkApiUrl.some(v => request.url.includes(v))) {
      return true;
    }
    return false;
  }*/

  /**
   * Check if request is for BE server myGrid.Link
   * @param request request data
   */
}

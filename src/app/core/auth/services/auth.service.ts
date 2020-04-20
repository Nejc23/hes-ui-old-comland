import { Injectable } from '@angular/core';
import { of, Subscription, timer } from 'rxjs';
import { LoginCredentials } from '../interfaces/login-credentials.interface';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { RefreshTokenRequest } from '../interfaces/refresh-token.interface';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/environments/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppStoreService } from '../../stores/services/app-store.service';
import * as moment from 'moment';
import { loginRouteUrl } from '../consts/route-url';
import { PermissionsStoreService } from '../../permissions/services/permissions-store.service';
import { environment } from 'src/environments/environment';
import { AuthenticationRepositoryService } from '../../repository/services/auth/authentication-repository.service';
import { IdentityToken } from '../../repository/interfaces/myGridLink/myGridLink.interceptor';
import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { selectedLocale } from 'src/environments/locale';

@Injectable()
export class AuthService {
  refreshTokenInterval$: Subscription = null;

  userManager: UserManager;
  public user: User | null;

  constructor(
    private usersRepositoryService: AuthenticationRepositoryService,
    private cookieService: CookieService,
    private router: Router,
    private appStore: AppStoreService,
    private permissionsStoreService: PermissionsStoreService
  ) {
    const settings = {
      authority: environment.stsAuthority,
      client_id: environment.clientId,
      redirect_uri: environment.ignoreLocale
        ? `${environment.clientRoot}assets/signin-callback.html`
        : `${environment.clientRoot}${selectedLocale}/assets/signin-callback.html`, // mora biti enak url kot je v identity "Client Redirect Uris"
      silent_redirect_uri: environment.ignoreLocale
        ? `${environment.clientRoot}assets/silent-callback.html`
        : `${environment.clientRoot}${selectedLocale}assets/silent-callback.html`,
      post_logout_redirect_uri: environment.ignoreLocale ? `${environment.clientRoot}` : `${environment.clientRoot}${selectedLocale}`, // mora biti enak url kot je v identity "Client Post Logout Redirect Uris"
      response_type: 'id_token', // !!! bilo je "id_token token",  pobrisal sem token sicer ne dela, verjetno je tako nastavljen server !!!
      scope: environment.clientScope,
      automaticSilentRenew: true
    };
    this.userManager = new UserManager(settings);

    /* this.userManager.getUser().then(user => {
      this.user = user;
    });*/
  }

  getAuthToken(): string {
    return this.cookieService.get(config.authCookie);
    // return 'bearer token';
  }

  getAuthTokenType(): string {
    return this.cookieService.get(config.authType) == null || this.cookieService.get(config.authType) === ''
      ? 'bearer'
      : this.cookieService.get(config.authType);
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    return this.userManager.signinSilent();
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  public getUser(): Promise<User> {
    return this.userManager.getUser();
  }

  isAuthenticated(): boolean {
    return this.user != null;
  }

  // for calling API-s on myGrid.Link server
  // ----------------------------------------
  setAuthTokenMyGridLink(token: IdentityToken) {
    localStorage.setItem('myGrid.Link_Token', token.TokenType + ' ' + token.AccessToken);
    localStorage.setItem('myGrid.Link_Token_DateTime', new Date().toUTCString());
    localStorage.setItem('myGrid.Link_Token_ExpiresIn', token.ExpiresIn.toString());
  }

  getAuthTokenMyGridLink() {
    return localStorage.getItem('myGrid.Link_Token');
  }

  //TODO, check expiration of myGrid.Link_Token
  isTokenAvailable(): boolean {
    const expires = localStorage.getItem('Link_Token_ExpiresIn');
    const dateCreatedToken = localStorage.getItem('Link_Token_DateTime');
    // todo
    return true;
  } /*
  login(loginCredentials: LoginCredentials) {
    return this.usersRepositoryService.authenticateUser(loginCredentials);
  }
*/
  /**
   * Refresh token after is not valid anymore
   */
  // ----------------------------------------

  /**
   * Login with user credentials
   */ refresh() {
    const expiredToken: RefreshTokenRequest = {
      expiredToken: localStorage.getItem('exp_token')
    };
    return this.usersRepositoryService.refreshUserToken(expiredToken);
  }
  /*
  logout() {
    this.removeAuthTokenData();
    localStorage.removeItem('type_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('exp_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_fullName');
    localStorage.clear();
    this.goToLogin();
  }

  getUser(): string {
    return localStorage.getItem('user_fullName');
  }*/

  /**
   * Save token to cookie service
   */
  saveTokenAndSetUserRights(authenticatedUser: AuthenticatedUser) {
    localStorage.clear();
    localStorage.setItem('type_token', authenticatedUser.tokenType);
    localStorage.setItem('auth_token', authenticatedUser.accessToken);
    localStorage.setItem('exp_token', authenticatedUser.expireDate);
    localStorage.setItem('refresh_token', authenticatedUser.refreshToken);
    localStorage.setItem('user_fullName', authenticatedUser.firstName + ' ' + authenticatedUser.lastName);
    this.cookieService.set(config.authCookie, authenticatedUser.accessToken, null, environment.cookiePath);
    this.cookieService.set(config.authCookieExp, authenticatedUser.expireDate, null, environment.cookiePath);
    this.cookieService.set(config.authType, authenticatedUser.tokenType, null, environment.cookiePath);
    this.setUserRights(authenticatedUser);
  }

  /**
   * Set User and his Rights
   */
  private setUserRights(authenticatedUser: AuthenticatedUser) {
    // if Token is OK
    if (this.getAuthToken() != null && this.getAuthToken().length > 0) {
      return of(null)
        .pipe(
          map((x: any) => {
            this.permissionsStoreService.setUserRights(authenticatedUser.userRights);
            this.appStore.setUser(authenticatedUser);
          })
        )
        .subscribe(
          () => {},
          (e: any) => {}
        );
    } else {
      return of(null);
    }
  }

  /**
   * Get valid token time (tokenValidUntil)
   */
  getAuthValidTokenTime() {
    return this.cookieService.get(config.authCookieExp);
  }

  /**
   * Redirect na login, izvede se samo v primeru, da je url "localhost"
   */
  public goToLogin() {
    this.router.navigate([loginRouteUrl]);
  }

  /**
   * Refresh Token if needed
   * If user is inactive more than 110 minutes, return to LOGIN
   */
  setRefreshTokenInterval() {
    if (this.isIntervalTokenSet()) {
      return;
    }

    this.refreshTokenInterval$ = timer(config.authRefreshInterval, config.authRefreshInterval).subscribe(() => {
      if (!this.checkIfRefreshIsAllowed()) {
        this.goToLogin();
      } else if (this.checkIfRefreshIsNeeded()) {
        this.refreshTokenAndSetUserRights();
      }
    });
  }

  removeRefreshTokenInterval() {
    if (this.refreshTokenInterval$) {
      this.refreshTokenInterval$.unsubscribe();
    }
  }

  isIntervalTokenSet() {
    if (this.refreshTokenInterval$ !== null && !this.refreshTokenInterval$.closed) {
      return true;
    }
    return false;
  }

  /**
   * Compares valid Token time with current UTC time (now)
   */
  checkIfRefreshIsNeeded() {
    const validUntilUtc = this.getAuthValidTokenTime();
    const nowUtc = moment()
      .utc()
      .format();

    const duration = moment.duration(moment(nowUtc).diff(moment(validUntilUtc)));
    const refreshNeeded = duration.asMinutes() >= config.authRefreshBeforeMinutes;
    return refreshNeeded;
  }

  /**
   * After 59 minutes of no activity, refresh token is not available anmymore -> go to Login
   */
  checkIfRefreshIsAllowed() {
    const timePassedUtc = this.cookieService.get(config.authTimeStamp);
    const nowMomentUtc = moment()
      .utc()
      .format();

    const duration = moment.duration(moment(nowMomentUtc).diff(moment(timePassedUtc)));
    const refreshAllowed = duration.asMinutes() <= config.authTokenDuration;
    return refreshAllowed;
  }

  removeAuthTokenData() {
    this.cookieService.delete(config.authCookie);
    this.cookieService.delete(config.authCookieExp);
    this.cookieService.delete(config.authTimeStamp);
    this.cookieService.delete(config.authType);
    this.cookieService.deleteAll('/');
  }

  refreshTokenAndSetUserRights() {
    this.refresh().subscribe(
      response => {
        this.saveTokenAndSetUserRights(response as AuthenticatedUser);
      },
      (e: any) => {
        console.warn(e);
      }
    );
  }
}

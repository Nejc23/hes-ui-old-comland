import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { from, Observable, of, Subscription } from 'rxjs';
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
import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { JwtHelperService } from './jwt.helper.service';
import { RoleService } from '../../permissions/services/role.service';
import { AppConfigStoreService } from '../../configuration/services/app-config-store.service';

@Injectable()
export class AuthService {
  refreshTokenInterval$: Subscription = null;

  userManager: UserManager;
  public user: User | null;

  tokenName = 'myGrid.Link_Token';

  constructor(
    private usersRepositoryService: AuthenticationRepositoryService,
    private cookieService: CookieService,
    private router: Router,
    private appStore: AppStoreService,
    private permissionsStoreService: PermissionsStoreService,
    private jwtHelper: JwtHelperService,
    private roleService: RoleService,
    private configStoreService: AppConfigStoreService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.configStoreService.configObservable.subscribe((appConfig) => {
      const settings = {
        authority: appConfig.identityServer.stsAuthority,
        client_id: appConfig.identityServer.clientId,
        redirect_uri: environment.ignoreLocale
          ? `${appConfig.identityServer.clientRoot}assets/signin-callback.html`
          : `${appConfig.identityServer.clientRoot}${locale}/assets/signin-callback.html`,
        silent_redirect_uri: environment.ignoreLocale
          ? `${appConfig.identityServer.clientRoot}assets/silent-callback.html`
          : `${appConfig.identityServer.clientRoot}${locale}/assets/silent-callback.html`,
        post_logout_redirect_uri: environment.ignoreLocale
          ? `${appConfig.identityServer.clientRoot}`
          : `${appConfig.identityServer.clientRoot}${locale}`,
        response_type: 'id_token token',
        scope: appConfig.identityServer.clientScope,
        automaticSilentRenew: appConfig.identityServer.clientAutoSilentRenew
      };
      this.userManager = new UserManager(settings);
    });
  }

  getAuthToken(): string {
    return this.cookieService.get(config.authCookie);
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

  public renewToken2(): Observable<User> {
    return from(this.userManager.signinSilent());
  }

  storeUser() {
    this.userManager.storeUser(this.user);
  }

  public logout(): Promise<void> {
    this.removeAuthTokenData();
    localStorage.removeItem('type_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_fullName');
    localStorage.removeItem('user_initials');
    localStorage.removeItem('user_company');
    localStorage.removeItem('user_email');
    localStorage.clear();
    return this.userManager.signoutRedirect();
  }

  public getUser(): Promise<User> {
    return this.userManager.getUser();
  }

  isAuthenticated(): boolean {
    return this.user != null;
  }

  isRefreshNeeded2() {
    if (this.user != null && this.user.id_token != null) {
      const decoded = this.jwtHelper.decodeToken(this.user.id_token);
      if (typeof decoded.exp !== 'undefined' && decoded.exp != null) {
        const secondsSinceEpoch = Math.round(Date.now() / 1000);
        if (secondsSinceEpoch > decoded.exp) {
          return true;
        }
      }
    }
    return false;
  }

  saveTokenAndSetUserRights2(authenticatedUser: User, isDevelop: string) {
    let userInitials = '';
    if (authenticatedUser.profile.given_name.length > 0 && authenticatedUser.profile.family_name.length > 0) {
      userInitials = authenticatedUser.profile.given_name.substr(0, 1) + authenticatedUser.profile.family_name.substr(0, 1);
    } else {
      userInitials = authenticatedUser.profile.name.substr(0, 2);
    }
    userInitials = userInitials.toUpperCase();

    localStorage.clear();
    localStorage.setItem('type_token', 'Bearer');
    localStorage.setItem('auth_token', authenticatedUser.id_token);
    // localStorage.setItem('exp_token', authenticatedUser.expireDate);
    // localStorage.setItem('refresh_token', authenticatedUser.refreshToken);
    // localStorage.setItem('user_fullName', authenticatedUser.firstName + ' ' + authenticatedUser.lastName);
    if (authenticatedUser != null && authenticatedUser.profile != null) {
      localStorage.setItem('user_fullName', authenticatedUser.profile.given_name + ' ' + authenticatedUser.profile.family_name);
      localStorage.setItem('user_initials', userInitials);

      localStorage.setItem('user_company', authenticatedUser.profile.company_name);
      localStorage.setItem('user_email', authenticatedUser.profile.name);
    }
    this.cookieService.set(config.authCookie, authenticatedUser.id_token, null, environment.cookiePath);
    this.cookieService.set(config.authType, 'Bearer', null, environment.cookiePath);

    if (isDevelop === this.user.id_token) {
      localStorage.setItem('is_develop', this.user.id_token);
    }
    this.setUserRights(authenticatedUser);
  }

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
*/
  getLoggedUser(): string {
    return localStorage.getItem('user_fullName');
  }

  getUserInitials(): string {
    return localStorage.getItem('user_initials');
  }

  getUserCompany(): string {
    return localStorage.getItem('user_company');
  }

  getUserEmail(): string {
    return localStorage.getItem('user_email');
  }

  getIsDevelop(): boolean {
    if (
      typeof localStorage.getItem('is_develop') !== 'undefined' &&
      localStorage.getItem('is_develop') &&
      this.user &&
      localStorage.getItem('is_develop') === this.user.id_token
    ) {
      return true;
    }
    return false;
  }
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
    // localStorage.setItem('user_company', authenticatedUser.company);
    localStorage.setItem('user_email', authenticatedUser.email);
    this.cookieService.set(config.authCookie, authenticatedUser.accessToken, null, environment.cookiePath);
    this.cookieService.set(config.authCookieExp, authenticatedUser.expireDate, null, environment.cookiePath);
    this.cookieService.set(config.authType, authenticatedUser.tokenType, null, environment.cookiePath);
    // this.setUserRights(authenticatedUser);
  }

  /**
   * Set User and his Rights
   */
  private setUserRights(authenticatedUser: User) {
    // if Token is OK
    if (this.getAuthToken() != null && this.getAuthToken().length > 0) {
      return of(null)
        .pipe(
          map((x: any) => {
            // this.permissionsStoreService.setUserRights(this.roleService.setUSerRightsFromRoles(authenticatedUser));
            this.permissionsStoreService.setUserPermissions(authenticatedUser.profile.permission);
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
  /*setRefreshTokenInterval() {
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
  }*/

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
    const nowUtc = moment().utc().format();

    const duration = moment.duration(moment(nowUtc).diff(moment(validUntilUtc)));
    const refreshNeeded = duration.asMinutes() >= config.authRefreshBeforeMinutes;
    return refreshNeeded;
  }

  /**
   * After 59 minutes of no activity, refresh token is not available anmymore -> go to Login
   */
  checkIfRefreshIsAllowed() {
    const timePassedUtc = this.cookieService.get(config.authTimeStamp);
    const nowMomentUtc = moment().utc().format();

    const duration = moment.duration(moment(nowMomentUtc).diff(moment(timePassedUtc)));
    const refreshAllowed = duration.asMinutes() <= config.authTokenDuration;
    return refreshAllowed;
  }

  removeAuthTokenData() {
    this.cookieService.delete(config.authCookie);
    this.cookieService.delete(config.authCookieExp);
    this.cookieService.delete(config.authTimeStamp);
    this.cookieService.delete(config.authType);
    // this.cookieService.deleteAll('/');
  }
  /*
  refreshTokenAndSetUserRights() {
    this.refresh().subscribe(
      response => {
        this.saveTokenAndSetUserRights(response as AuthenticatedUser);
      },
      (e: any) => {
        console.warn(e);
      }
    );
  }*/
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { PermissionsStoreService } from '../permissions/services/permissions-store.service';

@Injectable()
export class AuthGuard implements CanActivate {
  subscriptionPageRefresh: Subscription; // page refresh

  constructor(
    private router: Router,
    public http: HttpClient,
    private authService: AuthService,
    public permissionsStore: PermissionsStoreService
  ) {}
  /*
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authService.setRefreshTokenInterval();

      // GET token from api and set values to cookie
      if (!this.authService.checkIfRefreshIsAllowed()) {
        this.authService.logout();
      }

      this.subscriptionPageRefresh = this.permissionsStore.userRightsObservable.subscribe(userRights => {
        const isRefreshNeeded = this.authService.checkIfRefreshIsNeeded();
        const userRightsCount = userRights.length;
        const token = this.authService.getAuthToken();

        if (isRefreshNeeded || !userRightsCount || !token) {
          // Refresh when:
          // - Refresh is needed (every 20 minutes)
          // - there are no user rights set (PAGE refresh with F5)
          // - no Token is available
          this.authService
            .refresh()
            .pipe(map(response => this.authService.saveTokenAndSetUserRights(response as AuthenticatedUser)))
            .subscribe(
              () => {
                resolve(true);
              },
              (e: any) => {
                this.authService.logout();
                console.warn(e);
                resolve(false);
              }
            );
        } else {
          resolve(true);
        }
        if (this.subscriptionPageRefresh) {
          this.subscriptionPageRefresh.unsubscribe();
        }
      });
    });
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.authService.getIsDevelop() && this.authService.isRefreshNeeded2()) {
        this.authService
          .renewToken()
          .then((value) => {
            this.authService.user = value;
            this.authService.saveTokenAndSetUserRights2(value, '');
            resolve(true);
          })
          .catch((err) => {
            if (err.message === 'login_required') {
              this.authService.login().catch((errDetail) => console.log(errDetail));
            }
            resolve(false);
          });
      } else {
        if (this.authService.isAuthenticated()) {
          resolve(true);
        } else {
          this.authService
            .login()
            .then(() => {
              if (this.authService.user != null) {
                this.authService.saveTokenAndSetUserRights2(this.authService.user, '');
              }
            })
            .catch((err) => {
              console.log('error');
              console.log(err.message);

              this.router.navigate(['/identityError', { error: err.message }]);
            });
          resolve(false);
        }
      }
    });
  }
}

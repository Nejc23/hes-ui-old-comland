import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { PermissionsStoreService } from '../permissions/services/permissions-store.service';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  subscriptionPageRefresh: Subscription; // page refresh

  constructor(public http: HttpClient, private authService: AuthService, public permissionsStore: PermissionsStoreService) {}

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
  }
}

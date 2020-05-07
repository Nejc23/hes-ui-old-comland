import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

import * as _ from 'lodash';
import { PermissionsService } from '../permissions/services/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivateChild, CanActivate {
  constructor(public permissionService: PermissionsService) {}

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.guardLogic(next, state);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.guardLogic(next, state);
  }

  guardLogic(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const permission = _.get(next.data, 'permission', false);
    console.log(permission);
    // If no permission property always allow access
    if (!permission) {
      return true;
    }

    return this.permissionService.hasAccess(permission);
  }
}

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PermissionsStoreService } from './permissions-store.service';
import { ActionEnumerator } from '../enumerators/action-enumerator.model';
import { PermissionEnumerator } from '../enumerators/permission-enumerator.model';

@Injectable()
export class PermissionService {
  private currentPermissions = [];

  constructor(public permissionsStore: PermissionsStoreService) {
    permissionsStore.userPermissionsObservable.subscribe((permissions) => {
      this.currentPermissions = permissions;
    });
  }

  // has access
  hasAccess(permission: PermissionEnumerator): boolean {
    const hasAccess = _.find(this.currentPermissions, (x) => x === permission) ? true : false;
    return hasAccess;
  }
}

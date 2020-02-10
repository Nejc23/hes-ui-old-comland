import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PermissionsStoreService } from './permissions-store.service';
import { FunctionalityEnumerator } from '../enumerators/functionality-enumerator.model';

@Injectable()
export class PermissionsService {
  private currentPermissions = [];

  constructor(public permissionsStore: PermissionsStoreService) {
    permissionsStore.userRightsObservable.subscribe(permissions => {
      this.currentPermissions = permissions;
    });
  }

  // has access
  hasAccess(permission: FunctionalityEnumerator): boolean {
    return _.find(this.currentPermissions, x => x.functionality === permission) ? true : false;
  }

  // has write access
  hasEditAccess(permission: FunctionalityEnumerator): boolean {
    if (!this.hasAccess(permission)) {
      return false;
    }
    return _.find(this.currentPermissions, x => x.functionality === permission).writeRights === true ? true : false;
  }
}

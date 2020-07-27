import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PermissionsStoreService } from './permissions-store.service';
import { FunctionalityEnumerator } from '../enumerators/functionality-enumerator.model';
import { ActionEnumerator } from '../enumerators/action-enumerator.model';

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

  hasActionAccess(permission: FunctionalityEnumerator, action: ActionEnumerator): boolean {
    if (!this.hasAccess(permission)) {
      return false;
    }

    const listFunct = _.find(this.currentPermissions, x => x.functionality === permission);
    if (typeof listFunct !== 'undefined' && listFunct != null) {
      const actionFound = _.find(listFunct.action, x => x.toString().toLowerCase() === action.toString().toLowerCase());

      if (typeof actionFound !== 'undefined' && actionFound != null) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SavedPermissions } from '../interfaces/permissions.interface';
import { Store } from '../../stores/helpers/store.helper';
import { UserRight } from '../interfaces/user-rights.interface';

@Injectable()
export class PermissionsStoreService extends Store<Array<SavedPermissions>> {
  private userRights: BehaviorSubject<UserRight[]> = new BehaviorSubject<UserRight[]>([] as UserRight[]);
  public userRightsObservable = this.userRights.asObservable();

  private userPermissions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([] as string[]);
  userPermissionsObservable = this.userPermissions.asObservable();

  constructor() {
    super([]);
  }

  setUserRights(rights: UserRight[]) {
    this.userRights.next(rights);
  }

  setUserPermissions(permissions: string[]) {
    this.userPermissions.next(permissions);
  }
}

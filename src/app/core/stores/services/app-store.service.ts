import { Injectable } from '@angular/core';
import { AppState } from '../interfaces/app-state.interface';
import { DefaultAppState } from '../models/default-app-state.model';
import * as _ from 'lodash';
import { Store } from '../helpers/store.helper';
import { UserInfo } from '../../auth/interfaces/user-info.interface';

@Injectable()
export class AppStoreService extends Store<AppState> {
  constructor() {
    super(new DefaultAppState());
  }

  setUser(user: UserInfo) {
    this.setState({
      ..._.clone(this.state),
      user
    });
  }
}

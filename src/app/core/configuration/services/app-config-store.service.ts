import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { Store } from '../../stores/helpers/store.helper';
import { IAppConfig } from '../interfaces/app-config.interface';

@Injectable()
export class AppConfigStoreService extends Store<IAppConfig> {
  private config = new Subject<IAppConfig>();
  public configObservable = this.config.asObservable();

  constructor() {
    super({
      apiServer: { url: null },
      identityServer: {
        stsAuthority: null,
        clientId: null,
        clientRoot: null,
        clientScope: null,
        clientAutoSilentRenew: false
      }
    });
  }

  setConfig(config: IAppConfig) {
    this.config.next(config);
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '../../stores/helpers/store.helper';
import { IAppConfig } from '../interfaces/app-config.interface';

@Injectable()
export class AppConfigStoreService extends Store<IAppConfig> {
  private config = new Subject<IAppConfig>();
  public configObservable = this.config.asObservable();

  constructor() {
    super({
      apiServer: { url: null, translationsDebug: false },
      identityServer: {
        stsAuthority: null,
        stsAuthorityWeb: null,
        clientId: null,
        clientRoot: null,
        clientScope: null,
        clientAutoSilentRenew: false
      },
      features: null
    });
  }

  setConfig(config: IAppConfig) {
    this.config.next(config);
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { activateTriggerDeviceUpgrade } from 'src/app/core/repository/consts/dcu-management.const';
import { DcuManagementActivateTriggerDeviceUpgradeResponse } from 'src/app/core/repository/interfaces/dcu-management/dcu-management-trigger-device-upgrade.interface';

@Injectable()
export class DcuManagementInterceptor {
  constructor() {}

  static canInterceptDcuManagementActivateTriggerDeviceUpdatePost(request: HttpRequest<any>): boolean {
    return new RegExp(activateTriggerDeviceUpgrade).test(request.url) && request.method.endsWith('POST');
  }

  static interceptDcuManagementActivateTriggerDeviceUpdatePost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: DcuManagementActivateTriggerDeviceUpgradeResponse = {
      requestId: 'ceb64f17-1d49-4532-830f-55c15e1b88ff',
      deviceIds: ['2e9a0af2-cc88-43e0-9dfd-4cb1d7457ed6', 'd4c180db-f5f2-4c99-937e-9b92200d5526']
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
}

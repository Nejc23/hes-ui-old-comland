import { DcuManagementActivateTriggerDeviceUpgradeResponse } from './../../interfaces/dcu-management/dcu-management-trigger-device-upgrade.interface';
import { RepositoryService } from './../repository.service';
import { Injectable } from '@angular/core';
import { DcuManagementActivateTriggerDeviceUpgradeRequest } from '../../interfaces/dcu-management/dcu-management-trigger-device-upgrade.interface';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { activateTriggerDeviceUpgrade } from '../../consts/dcu-management.const';

@Injectable({
  providedIn: 'root'
})
export class DcuManagementService {
  constructor(private repository: RepositoryService) {}

  activateTriggerDeviceUpgrade(
    param: DcuManagementActivateTriggerDeviceUpgradeRequest
  ): Observable<DcuManagementActivateTriggerDeviceUpgradeResponse> {
    return this.repository.makeRequest(this.activateTriggerDeviceUpgradeRequest(param));
  }

  activateTriggerDeviceUpgradeRequest(param: DcuManagementActivateTriggerDeviceUpgradeRequest): HttpRequest<any> {
    return new HttpRequest('POST', activateTriggerDeviceUpgrade, param);
  }
}

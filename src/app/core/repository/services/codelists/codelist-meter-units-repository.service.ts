import {
  meterUnitsAlarmNotificationType,
  meterUnitsAlarmSeverityType,
  meterUnitsAlarmSourceType,
  meterUnitsDeviceMedium,
  meterUnitsProtocolType
} from './../../consts/meter-units.const';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import {
  meterUnitCiiStates,
  meterUnitDisconnectorStates,
  meterUnitFirmwares,
  meterUnitStatuses,
  meterUnitTags,
  meterUnitVendors
} from '../../consts/meter-units.const';

@Injectable({
  providedIn: 'root'
})
export class CodelistMeterUnitsRepositoryService {
  id = 0;

  constructor(private repository: RepositoryService) {}

  meterUnitStatusCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitStatusCodelistRequest(meterUnitTypeId));
  }

  meterUnitStatusCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitStatuses}/${this.id}`);
  }

  meterUnitTagCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitTagCodelistRequest(meterUnitTypeId));
  }

  meterUnitTagCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitTags}/${this.id}`);
  }

  meterUnitFirmwareCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitFirmwareCodelistRequest(meterUnitTypeId));
  }

  meterUnitFirmwareCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitFirmwares}/${id}`);
  }

  meterUnitDisconnectorStateCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitDisconnectorStateCodelistRequest(meterUnitTypeId));
  }

  meterUnitDisconnectorStateCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitDisconnectorStates}/${this.id}`);
  }

  meterUnitCiiStateCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitCiiStateCodelistRequest(meterUnitTypeId));
  }

  meterUnitCiiStateCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitCiiStates}/${this.id}`);
  }

  meterUnitVendorCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitVendorCodelistRequest(meterUnitTypeId));
  }

  meterUnitVendorCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitVendors}/${this.id}`);
  }

  meterUnitDeviceMediumCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitDeviceMediumCodelistRequest());
  }

  meterUnitDeviceMediumCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitsDeviceMedium}`);
  }

  meterUnitProtocolTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitProtocolTypeCodelistRequest());
  }

  meterUnitProtocolTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitsProtocolType}`);
  }

  meterUnitAlarmSeverityTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitAlarmSeverityTypeCodelistRequest());
  }

  meterUnitAlarmSeverityTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitsAlarmSeverityType}`);
  }

  meterUnitAlarmSourceTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitAlarmSourceTypeCodelistRequest());
  }

  meterUnitAlarmSourceTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitsAlarmSourceType}`);
  }

  meterUnitAlarmNotificationTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitAlarmNotificationTypeCodelistRequest());
  }

  meterUnitAlarmNotificationTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitsAlarmNotificationType}`);
  }
}

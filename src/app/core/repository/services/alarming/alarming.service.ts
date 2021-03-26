import { IActionRequestParamsAlarms } from './../../interfaces/myGridLink/action-prams.interface';
import { IAlarmsList } from './../../interfaces/alarming/alarms-list.interface';
import { alarmingAlarms } from './../../consts/alarms.const';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AlarmingService {
  constructor(private repository: RepositoryService) {}

  getGridAlarms(param: IActionRequestParamsAlarms): Observable<GridResponse<IAlarmsList>> {
    return this.repository.makeRequest(this.getGridAlarmsRequest(param));
  }

  getGridAlarmsRequest(param: IActionRequestParamsAlarms): HttpRequest<any> {
    return new HttpRequest('POST', alarmingAlarms, param);
  }
}

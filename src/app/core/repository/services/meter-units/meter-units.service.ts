import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { MeterUnitsList } from '../../interfaces/meter-units/meter-units-list.interface';
import { MeterUnitsLayout } from '../../interfaces/meter-units/meter-units-layout.interface';
import {
  meterUnits,
  meterUnitsLayout,
  meterUnitsScheduler,
  deleteJob,
  executeJob,
  enableJob,
  disableJob
} from '../../consts/meter-units.const';
import { MeterUnitsReadSchedule, MeterUnitsReadScheduleService } from '../../interfaces/meter-units/meter-units-read-schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridMeterUnits(param: GridRequestParams): Observable<GridResponse<MeterUnitsList>> {
    return this.repository.makeRequest(this.getGridMeterUnitsRequest(param));
  }

  getGridMeterUnitsRequest(param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', meterUnits, param);
  }

  getMeterUnitsLayout(typeId: number): Observable<MeterUnitsLayout[]> {
    return this.repository.makeRequest(this.getMeterUnitsLayoutRequest(typeId));
  }

  getMeterUnitsLayoutRequest(typeId: number): HttpRequest<any> {
    return new HttpRequest('GET', `${meterUnits}/${typeId}/${meterUnitsLayout}`);
  }

  saveMeterUnitsLayout(typeId: number, id: number, payload: MeterUnitsLayout): Observable<MeterUnitsLayout> {
    return this.repository.makeRequest(this.saveMeterUnitsFilterRequest(typeId, id, payload));
  }

  saveMeterUnitsFilterRequest(typeId: number, id: number, payload: MeterUnitsLayout): HttpRequest<MeterUnitsLayout> {
    return new HttpRequest('PUT', `${meterUnits}/${typeId}/${meterUnitsLayout}/${id}`, payload as any);
  }

  deleteMeterUnitsLayout(typeId: number, id: number): Observable<MeterUnitsLayout> {
    return this.repository.makeRequest(this.deleteMeterUnitsLayoutRequest(typeId, id));
  }

  deleteMeterUnitsLayoutRequest(typeId: number, id: number): HttpRequest<MeterUnitsLayout> {
    return new HttpRequest('DELETE', `${meterUnits}/${typeId}/${meterUnitsLayout}/${id}`);
  }

  createMeterUnitsLayout(typeId: number, payload: MeterUnitsLayout): Observable<MeterUnitsLayout> {
    return this.repository.makeRequest(this.createMeterUnitsLayoutRequest(typeId, payload));
  }

  createMeterUnitsLayoutRequest(typeId: number, payload: MeterUnitsLayout): HttpRequest<MeterUnitsLayout> {
    return new HttpRequest('POST', `${meterUnits}/${typeId}/${meterUnitsLayout}`, payload as any);
  }

  createMeterUnitsReadScheduler(schedule: MeterUnitsReadScheduleService): Observable<MeterUnitsReadScheduleService> {
    return this.repository.makeRequest(this.createMeterUnitsReadSchedulerRequest(schedule));
  }

  createMeterUnitsReadSchedulerRequest(param: MeterUnitsReadScheduleService): HttpRequest<any> {
    return new HttpRequest('POST', `${meterUnitsScheduler}`, param);
  }

  deleteSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.deleteSchedulerJobRequest(id));
  }

  deleteSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('DELETE', `${meterUnitsScheduler}/${deleteJob}/${id}`);
  }

  executeSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.executeSchedulerJobRequest(id));
  }

  executeSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${meterUnitsScheduler}/${executeJob}/${id}`, null);
  }

  enableSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.enableSchedulerJobRequest(id));
  }

  enableSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${meterUnitsScheduler}/${enableJob}/${id}`, null);
  }

  disableSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.disableSchedulerJobRequest(id));
  }

  disableSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${meterUnitsScheduler}/${disableJob}/${id}`, null);
  }
}

import { getProfiles, getEvents, getInstantaneousValues } from './../../consts/data-processing.const';
import { DataProcessingRequest } from './../../../../features/meter-units/registers/interfaces/data-processing-request.interface';
import { HttpRequest } from '@angular/common/http';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EventProfileDefinitionsForDevice,
  ProfileDefinitionsForDevice,
  RegisterDefinitionsForDevice
} from '../../interfaces/data-processing/profile-definitions-for-device.interface';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {
  constructor(private repository: RepositoryService) {}

  getProfiles(request: DataProcessingRequest): Observable<ProfileDefinitionsForDevice[]> {
    return this.repository.makeRequest(this.getProfilesRequest(request));
  }

  getProfilesRequest(request: DataProcessingRequest): HttpRequest<ProfileDefinitionsForDevice[]> {
    return new HttpRequest('POST', `${getProfiles}`, request as any);
  }

  getEvents(request: DataProcessingRequest): Observable<EventProfileDefinitionsForDevice[]> {
    return this.repository.makeRequest(this.getEventsRequest(request));
  }

  getEventsRequest(request: DataProcessingRequest): HttpRequest<EventProfileDefinitionsForDevice[]> {
    return new HttpRequest('POST', `${getEvents}`, request as any);
  }

  getInstantaneousValues(request: DataProcessingRequest): Observable<RegisterDefinitionsForDevice[]> {
    return this.repository.makeRequest(this.getInstantaneousValuesRequest(request));
  }

  getInstantaneousValuesRequest(request: DataProcessingRequest): HttpRequest<RegisterDefinitionsForDevice[]> {
    return new HttpRequest('POST', `${getInstantaneousValues}`, request as any);
  }
}

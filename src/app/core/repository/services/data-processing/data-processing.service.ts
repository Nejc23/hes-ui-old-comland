import { languages } from './../../../../../environments/config';
import { DataProcessingRequest } from './../../interfaces/data-processing/data-processing-request.interface';
import { getProfiles, getEvents, getInstantaneousValues } from './../../consts/data-processing.const';
import { HttpRequest } from '@angular/common/http';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  EventProfileDefinitionsForDevice,
  ProfileDefinitionsForDevice,
  RegisterDefinitionsForDevice,
  RegisterValue
} from '../../interfaces/data-processing/profile-definitions-for-device.interface';
import { map } from 'rxjs/operators';
import { RegistersFilter } from 'src/app/features/meter-units/registers/interfaces/data-processing-request.interface';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {
  constructor(private repository: RepositoryService) {}

  getChartData(filter: RegistersFilter): Observable<RegisterValue[]> {
    // TODO enum for categorization
    const request: DataProcessingRequest = {
      deviceIds: [filter.deviceId],
      profiles: [
        {
          profileId: filter.register.registerGroupId,
          registerIds: [filter.register.registerDefinitionId]
        }
      ],
      startTime: filter.startTime.toISOString(),
      endTime: filter.endTime.toISOString()
    };

    if (filter.register.categorization === 'EVENT') {
      return this.getEvents(request).pipe(
        map((response) => {
          if (
            !response ||
            response.length === 0 ||
            !response[0].eventProfileDefinitions ||
            response[0].eventProfileDefinitions.length === 0 ||
            !response[0].eventProfileDefinitions[0].eventRegisterDefinition ||
            response[0].eventProfileDefinitions[0].eventRegisterDefinition.length === 0
          ) {
            return null;
          } else {
            return response[0].eventProfileDefinitions[0].eventRegisterDefinition[0].eventRegisterValues;
          }
        })
      );
    } else if (filter.register.categorization === 'INSTANTANEOUS_VALUE') {
      request.registerIds = request.profiles[0].registerIds;
      request.profiles = null;

      return this.getInstantaneousValues(request).pipe(
        map((response) => {
          if (!response || response.length === 0 || !response[0].registerDefinitions || response[0].registerDefinitions.length === 0) {
            return null;
          } else {
            return response[0].registerDefinitions[0].registerValues;
          }
        })
      );
    } else {
      // PROFILE
      return this.getProfiles(request).pipe(
        map((response) => {
          if (
            !response ||
            response.length === 0 ||
            !response[0].profileDefinitions ||
            response[0].profileDefinitions.length === 0 ||
            !response[0].profileDefinitions[0].registerDefinitions ||
            response[0].profileDefinitions[0].registerDefinitions.length === 0
          ) {
            return null;
          } else {
            return response[0].profileDefinitions[0].registerDefinitions[0].registerValues;
          }
        })
      );
    }
  }

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

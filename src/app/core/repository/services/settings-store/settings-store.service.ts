import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { userSettings } from '../../consts/settings-store.const';
import { AnyARecord } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class SettingsStoreService {
  constructor(private repository: RepositoryService) {}

  getUserSettings(key: string): Observable<any> {
    return this.repository.makeRequest(this.getUserSettingsRequest(key));
  }

  getUserSettingsRequest(key: string): HttpRequest<any> {
    return new HttpRequest('GET', userSettings + `/${key}`);
  }

  saveUserSettings(key: string, settings: any): Observable<any> {
    return this.repository.makeRequest(this.saveUserSettingsRequest(key, settings));
  }

  saveUserSettingsRequest(key: string, settings: any): HttpRequest<any> {
    return new HttpRequest('PUT', userSettings + `/${key}`, settings);
  }
}

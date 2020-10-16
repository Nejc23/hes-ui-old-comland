import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { userSettings } from '../../consts/settings-store.const';
import { UserSettingsGetRequest } from '../../interfaces/settings-store/user-settings-get-request.interface';
import { UserSettingsSaveRequest } from '../../interfaces/settings-store/user-settings-save-request.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsStoreService {
  constructor(private repository: RepositoryService) {}

  getUserSettings(param: UserSettingsGetRequest): Observable<any> {
    return this.repository.makeRequest(this.getUserSettingsRequest(param));
  }

  getUserSettingsRequest(param: UserSettingsGetRequest): HttpRequest<any> {
    return new HttpRequest('POST', userSettings, param);
  }

  saveUserSettings(param: UserSettingsSaveRequest): Observable<any> {
    return this.repository.makeRequest(this.saveUserSettingsRequest(param));
  }

  saveUserSettingsRequest(param: UserSettingsSaveRequest): HttpRequest<any> {
    return new HttpRequest('PUT', userSettings, param);
  }
}

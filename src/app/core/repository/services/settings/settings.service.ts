import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userSettings, userSettingsBase } from '../../consts/settings-store.const';
import { Setting } from '../../interfaces/settings/setting';
import { RepositoryService } from '../repository.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private repository: RepositoryService) {}

  getSetting(settingName: string): Observable<Setting> {
    return this.repository.makeRequest(this.getSettingRequest(settingName));
  }

  getSettingRequest(settingName: string): HttpRequest<any> {
    return new HttpRequest('GET', `${userSettingsBase}/${userSettings}/${settingName}`);
  }
}

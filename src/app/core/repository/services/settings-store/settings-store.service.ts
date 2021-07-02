import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { userSettingsBase } from '../../consts/settings-store.const';
import { userSettingsConfiguration } from './../../consts/settings-store.const';

@Injectable({
  providedIn: 'root'
})
export class SettingsStoreService {
  constructor(private repository: RepositoryService, private authService: AuthService) {}

  getUserSettings(userId: string, key: string): Observable<any> {
    return this.repository.makeRequest(this.getUserSettingsRequest(userId, key));
  }

  getUserSettingsRequest(userId: string, key: string): HttpRequest<any> {
    return new HttpRequest('GET', `${userSettingsBase}/${userId}/${userSettingsConfiguration}/${key}`);
  }

  saveUserSettings(userId: string, key: string, settings: any): Observable<any> {
    return this.repository.makeRequest(this.saveUserSettingsRequest(userId, key, settings));
  }

  saveUserSettingsRequest(userId: string, key: string, settings: any): HttpRequest<any> {
    return new HttpRequest('PUT', `${userSettingsBase}/${userId}/${userSettingsConfiguration}/${key}`, settings);
  }

  getCurrentUserSettings(key: string): Observable<any> {
    const sid = this.authService.user.profile.sub;
    return this.getUserSettings(sid, key);
  }

  saveCurrentUserSettings(key: string, settings: any) {
    const sid = this.authService.user.profile.sub;
    this.saveUserSettings(sid, key, settings).subscribe();
  }
}

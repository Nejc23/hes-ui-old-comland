import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../../configuration/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  makeRequest<T>(request: HttpRequest<any>): Observable<T> {
    if (AppConfigService.settings && AppConfigService.settings?.apiServer?.url !== '') {
      this.apiUrl = AppConfigService.settings?.apiServer?.url;
    }
    const options = { body: request.body, params: request.params, headers: request.headers };
    return this.http.request<any>(request.method, this.apiUrl + request.url, options);
  }
}

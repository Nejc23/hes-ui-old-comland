import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { meterUnits } from '../consts/meter-units.const';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  makeRequest<T>(request: HttpRequest<any>): Observable<T> {
    const options = { body: request.body, params: request.params, headers: request.headers };

    let method = request.method;
    if (request.method.toLowerCase() === 'patch' && request.url === `${meterUnits}`) {
      method = 'DELETE';
    }

    return this.http.request<any>(method, this.apiUrl + request.url, options);
  }
}

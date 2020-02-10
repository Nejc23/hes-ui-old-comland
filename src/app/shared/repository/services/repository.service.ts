import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  constructor(private http: HttpClient) {}
  makeRequest<T>(request: HttpRequest<any>): Observable<T> {
    return this.http.request<any>(request.method, request.url, { body: request.body, params: request.params, headers: request.headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { DashboardGridResponse } from '../../interfaces/dashboards/dashboard-grid-response.interface';
import { DashboardItemDataResponse } from '../../interfaces/dashboards/dashboard-item-data-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GridRepositoryService {
  constructor(private repository: RepositoryService) {}

  getGrid(id: number): Observable<DashboardGridResponse> {
    return this.repository.makeRequest(this.getGridRequest(id));
  }

  getGridRequest(id: number): HttpRequest<DashboardGridResponse> {
    return new HttpRequest('GET', `/api/dashboards/${id}/grid-items-settings`);
  }

  saveGrid(id: number, payload: DashboardGridResponse): Observable<DashboardGridResponse> {
    return this.repository.makeRequest(this.saveGridRequest(id, payload));
  }

  saveGridRequest(id: number, payload: DashboardGridResponse): HttpRequest<DashboardGridResponse> {
    return new HttpRequest('PUT', `/api/dashboards/${id}/grid-items-settings`, payload as DashboardGridResponse);
  }

  getGridItemsData(id: number): Observable<DashboardItemDataResponse[]> {
    return this.repository.makeRequest(this.getGridItemsDataRequest(id));
  }

  getGridItemsDataRequest(id: number): HttpRequest<DashboardItemDataResponse[]> {
    return new HttpRequest('GET', `/api/dashboards/${id}/grid-items-data`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { DashboardModel } from 'src/app/features/dashboard/interfaces/dashboard-model.interface';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardRepositoryService {
  constructor(private repository: RepositoryService) {}

  getDashboard(id: number): Observable<DashboardModel> {
    return this.repository.makeRequest(this.getDashboardRequest(id));
  }

  getDashboardRequest(id: number): HttpRequest<DashboardModel> {
    return new HttpRequest('GET', `/api/dashboards/${id}`);
  }

  saveDashboard(id: number, payload: DashboardModel): Observable<DashboardModel> {
    return this.repository.makeRequest(this.saveDashboardRequest(id, payload));
  }

  saveDashboardRequest(id: number, payload: DashboardModel): HttpRequest<DashboardModel> {
    return new HttpRequest('PUT', `/api/dashboards/${id}`, payload as any);
  }

  deleteDashboard(id: number): Observable<DashboardModel> {
    return this.repository.makeRequest(this.deleteDashboardRequest(id));
  }

  deleteDashboardRequest(id: number): HttpRequest<DashboardModel> {
    return new HttpRequest('DELETE', `/api/dashboards/${id}`);
  }

  createDashboard(payload: DashboardModel): Observable<DashboardModel> {
    return this.repository.makeRequest(this.createDashboardRequest(payload));
  }

  createDashboardRequest(payload: DashboardModel): HttpRequest<DashboardModel> {
    return new HttpRequest('POST', `/api/dashboards`, payload as any);
  }
}

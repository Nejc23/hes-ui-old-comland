import { Injectable } from '@angular/core';
import { DashboardStoreService } from './dashboard-store.service';
import { DashboardEventsService } from './dashboard-events.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardRefreshService {
  constructor(private dashboardStore: DashboardStoreService, private dashboardEvents: DashboardEventsService) {}

  refreshDashboard() {
    this.dashboardEvents.triggerRefreshGridEvent();
  }

  setRefreshInterval() {
    const interval = window.setInterval(() => this.refreshDashboard(), 1000 * 60);
    this.dashboardStore.setRefreshInterval(interval);
  }

  removeRefreshInterval() {
    clearInterval(this.dashboardStore.state.refreshInterval);
  }
}

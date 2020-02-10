import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardEventsService {
  private readonly refreshGrid = new Subject<void>();

  constructor() {}

  triggerRefreshGridEvent() {
    this.refreshGrid.next();
  }

  getRefreshGrid$() {
    return this.refreshGrid.asObservable();
  }
}

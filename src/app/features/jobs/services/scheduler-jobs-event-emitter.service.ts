import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulerJobsEventEmitterService {
  public eventEmitterRefresh: EventEmitter<boolean>;

  constructor() {
    this.eventEmitterRefresh = new EventEmitter<boolean>();
  }

  public refresh(value: boolean) {
    this.eventEmitterRefresh.emit(value);
  }
}

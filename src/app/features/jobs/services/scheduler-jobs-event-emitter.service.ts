import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulerJobsEventEmitterService {
  public eventEmitterRefresh: EventEmitter<boolean>;

  public eventEmitterRowMouseOver: EventEmitter<number>;
  public eventEmitterRowMouseOut: EventEmitter<number>;

  constructor() {
    this.eventEmitterRefresh = new EventEmitter<boolean>();

    this.eventEmitterRowMouseOver = new EventEmitter<number>();
    this.eventEmitterRowMouseOut = new EventEmitter<number>();
  }

  public refresh(value: boolean) {
    this.eventEmitterRefresh.emit(value);
  }

  public rowMouseOver(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOver.emit(rowNumber);
  }

  public rowMouseOut(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOut.emit(rowNumber);
  }
}

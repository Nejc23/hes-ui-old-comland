import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridEventEmitterService {
  public eventEmitter: EventEmitter<boolean>;
  public eventEmitterPageChange: EventEmitter<number>;

  constructor() {
    this.eventEmitter = new EventEmitter<boolean>();
    this.eventEmitterPageChange = new EventEmitter<number>();
  }

  // for check-box in header
  public checkChange(value: boolean) {
    this.eventEmitter.emit(value);
  }

  // for check-box in header
  public pageChange(value: number) {
    this.eventEmitterPageChange.emit(value);
  }
}

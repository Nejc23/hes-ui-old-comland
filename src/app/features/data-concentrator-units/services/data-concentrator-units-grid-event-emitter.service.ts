import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridEventEmitterService {
  cookieNameForGridSettings = 'grdColDCU';

  public eventEmitter: EventEmitter<boolean>;

  constructor() {
    this.eventEmitter = new EventEmitter<boolean>();
  }

  public checkChanged(checked: boolean) {
    // do something, then...
    this.eventEmitter.emit(checked);
  }
}

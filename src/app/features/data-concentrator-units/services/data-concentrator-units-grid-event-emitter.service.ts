import { Injectable, EventEmitter } from '@angular/core';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridEventEmitterService {
  public eventEmitter: EventEmitter<boolean>;
  public eventEmitterPageChange: EventEmitter<number>;
  public eventEmitterLayoutChange: EventEmitter<DcuLayout>;

  constructor() {
    this.eventEmitter = new EventEmitter<boolean>();
    this.eventEmitterPageChange = new EventEmitter<number>();
    this.eventEmitterLayoutChange = new EventEmitter<DcuLayout>();
  }

  // for check-box in header
  public checkChange(value: boolean) {
    this.eventEmitter.emit(value);
  }

  // for check-box in header
  public pageChange(value: number) {
    this.eventEmitterPageChange.emit(value);
  }

  // for selecting new grid layout and filter
  public layoutChange(value: DcuLayout) {
    this.eventEmitterLayoutChange.emit(value);
  }
}

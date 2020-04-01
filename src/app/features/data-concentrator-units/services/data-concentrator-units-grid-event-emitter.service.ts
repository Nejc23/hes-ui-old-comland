import { Injectable, EventEmitter } from '@angular/core';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridEventEmitterService {
  public eventEmitterSelectDeselectAll: EventEmitter<number>;
  public eventEmitterLayoutChange: EventEmitter<DcuLayout>;

  constructor() {
    this.eventEmitterSelectDeselectAll = new EventEmitter<number>();
    this.eventEmitterLayoutChange = new EventEmitter<DcuLayout>();
  }

  // for check-box in header
  public selectDeselectAll(value: number) {
    this.eventEmitterSelectDeselectAll.emit(value);
  }

  // for selecting new grid layout and filter
  public layoutChange(value: DcuLayout) {
    this.eventEmitterLayoutChange.emit(value);
  }
}

import { EventEmitter, Injectable } from '@angular/core';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridEventEmitterService {
  public eventEmitterSelectDeselectAll: EventEmitter<number>;
  public eventEmitterLayoutChange: EventEmitter<DcuLayout>;
  public eventEmitterDcuAdded: EventEmitter<DataConcentratorUnitsList>;
  public eventEmitterConcentratorDeleted: EventEmitter<boolean>;

  constructor() {
    this.eventEmitterSelectDeselectAll = new EventEmitter<number>();
    this.eventEmitterLayoutChange = new EventEmitter<DcuLayout>();
    this.eventEmitterDcuAdded = new EventEmitter<DataConcentratorUnitsList>();
    this.eventEmitterConcentratorDeleted = new EventEmitter<boolean>();
  }

  // for check-box in header
  public selectDeselectAll(value: number) {
    this.eventEmitterSelectDeselectAll.emit(value);
  }

  // for selecting new grid layout and filter
  public layoutChange(value: DcuLayout) {
    this.eventEmitterLayoutChange.emit(value);
  }

  public addNewDcuToList(value: DataConcentratorUnitsList) {
    this.eventEmitterDcuAdded.emit(value);
  }

  public concentratorDeleted(result: boolean) {
    this.eventEmitterConcentratorDeleted.emit(result);
  }
}

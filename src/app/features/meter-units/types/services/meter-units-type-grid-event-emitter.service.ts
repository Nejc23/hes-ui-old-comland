import { Injectable, EventEmitter } from '@angular/core';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeGridEventEmitterService {
  public eventEmitterSelectDeselectAll: EventEmitter<boolean>;
  public eventEmitterLayoutChange: EventEmitter<DcuLayout>;

  private isSelectedAll = new BehaviorSubject(false);

  constructor() {
    this.eventEmitterSelectDeselectAll = new EventEmitter<boolean>();
    this.eventEmitterLayoutChange = new EventEmitter<DcuLayout>();
    this.isSelectedAll = new BehaviorSubject<boolean>(false);
  }

  // for check-box in header
  public selectDeselectAll(value: boolean) {
    this.eventEmitterSelectDeselectAll.emit(value);
  }

  // for selecting new grid layout and filter
  public layoutChange(value: DcuLayout) {
    this.eventEmitterLayoutChange.emit(value);
  }

  public getIsSelectedAll(): Observable<boolean> {
    return this.isSelectedAll.asObservable();
  }

  public setIsSelectedAll(val: boolean) {
    this.isSelectedAll.next(val);
  }
}

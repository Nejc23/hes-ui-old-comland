import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeGridEventEmitterService {
  public eventEmitterSelectDeselectAll: EventEmitter<boolean>;
  public eventEmitterLayoutChange: EventEmitter<MeterUnitsLayout>;
  public eventEmitterRowMouseOver: EventEmitter<number>;
  public eventEmitterRowMouseOut: EventEmitter<number>;

  private isSelectedAll = new BehaviorSubject(false);

  constructor() {
    this.eventEmitterSelectDeselectAll = new EventEmitter<boolean>();
    this.eventEmitterLayoutChange = new EventEmitter<MeterUnitsLayout>();
    this.isSelectedAll = new BehaviorSubject<boolean>(false);

    this.eventEmitterRowMouseOver = new EventEmitter<number>();
    this.eventEmitterRowMouseOut = new EventEmitter<number>();
  }

  // for check-box in header
  public selectDeselectAll(value: boolean) {
    this.eventEmitterSelectDeselectAll.emit(value);
  }

  // for selecting new grid layout and filter
  public layoutChange(value: MeterUnitsLayout) {
    this.eventEmitterLayoutChange.emit(value);
  }

  public getIsSelectedAll(): Observable<boolean> {
    return this.isSelectedAll.asObservable();
  }

  public setIsSelectedAll(val: boolean) {
    this.isSelectedAll.next(val);
  }

  public rowMouseOver(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOver.emit(rowNumber);
  }

  public rowMouseOut(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOut.emit(rowNumber);
  }
}

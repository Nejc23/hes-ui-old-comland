import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeGridEventEmitterService {
  public eventEmitterSelectDeselectAll: EventEmitter<boolean>;
  public eventEmitterLayoutChange: EventEmitter<MeterUnitsLayout>;
  public eventEmitterRefreshDevices: EventEmitter<void>;

  private isSelectedAll = new BehaviorSubject(false);

  constructor() {
    this.eventEmitterSelectDeselectAll = new EventEmitter<boolean>();
    this.eventEmitterLayoutChange = new EventEmitter<MeterUnitsLayout>();
    this.eventEmitterRefreshDevices = new EventEmitter<void>();
    this.isSelectedAll = new BehaviorSubject<boolean>(false);
  }

  // for check-box in header
  public selectDeselectAll(value: boolean) {
    this.eventEmitterSelectDeselectAll.emit(value);
  }

  // for selecting new grid layout and filter
  public layoutChange(value: MeterUnitsLayout) {
    this.eventEmitterLayoutChange.emit(value);
  }

  public refreshData() {
    this.eventEmitterRefreshDevices.emit();
  }

  public getIsSelectedAll(): Observable<boolean> {
    return this.isSelectedAll.asObservable();
  }

  public setIsSelectedAll(val: boolean) {
    this.isSelectedAll.next(val);
  }
}

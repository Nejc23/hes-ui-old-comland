import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesGridEventEmitterService {
  public eventEmitterEdit: EventEmitter<number>;
  public eventEmitterRowMouseOver: EventEmitter<number>;
  public eventEmitterRowMouseOut: EventEmitter<number>;

  constructor() {
    this.eventEmitterEdit = new EventEmitter<number>();
    this.eventEmitterRowMouseOver = new EventEmitter<number>();
    this.eventEmitterRowMouseOut = new EventEmitter<number>();
  }

  // for check-box in header
  public edit(value: number) {
    this.eventEmitterEdit.emit(value);
  }

  public rowMouseOver(rowNumber: number) {
    this.eventEmitterRowMouseOver.emit(rowNumber);
  }

  public rowMouseOut(rowNumber: number) {
    this.eventEmitterRowMouseOut.emit(rowNumber);
  }
}

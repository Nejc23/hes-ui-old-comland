import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesGridEventEmitterService {
  public eventEmitterRowMouseOver: EventEmitter<number>;
  public eventEmitterRowMouseOut: EventEmitter<number>;
  public eventEmitterRowMouseOverJobs: EventEmitter<number>;
  public eventEmitterRowMouseOutJobs: EventEmitter<number>;

  constructor() {
    this.eventEmitterRowMouseOver = new EventEmitter<number>();
    this.eventEmitterRowMouseOut = new EventEmitter<number>();
    this.eventEmitterRowMouseOverJobs = new EventEmitter<number>();
    this.eventEmitterRowMouseOutJobs = new EventEmitter<number>();
  }

  public rowMouseOver(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOver.emit(rowNumber);
  }

  public rowMouseOut(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOut.emit(rowNumber);
  }

  public rowMouseOverJobs(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOverJobs.emit(rowNumber);
  }

  public rowMouseOutJobs(rowNumber: number, gridNumber: number) {
    this.eventEmitterRowMouseOutJobs.emit(rowNumber);
  }
}

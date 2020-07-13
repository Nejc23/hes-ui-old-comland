import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesGridEventEmitterService {
  public eventEmitterEdit: EventEmitter<number>;

  constructor() {
    this.eventEmitterEdit = new EventEmitter<number>();
  }

  // for check-box in header
  public edit(value: number) {
    this.eventEmitterEdit.emit(value);
  }
}

import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsStoreEmitterService {
  public eventEmitterSettingsLoaded: EventEmitter<void>;

  constructor() {
    this.eventEmitterSettingsLoaded = new EventEmitter<void>();
  }

  settingsLoaded() {
    this.eventEmitterSettingsLoaded.emit();
  }
}

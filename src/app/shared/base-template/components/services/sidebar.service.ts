import { Injectable, EventEmitter, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService implements OnDestroy {
  public eventEmitterToggleMenu: EventEmitter<void>;

  constructor() {
    this.eventEmitterToggleMenu = new EventEmitter<void>(true); // create async event
  }

  public toggleMenu() {
    this.eventEmitterToggleMenu.emit();
  }

  ngOnDestroy() {
    this.eventEmitterToggleMenu.unsubscribe();
  }
}

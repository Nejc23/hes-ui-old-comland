import { Injectable, EventEmitter, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService implements OnDestroy {
  public eventEmitterSetPageName: EventEmitter<string>;

  constructor() {
    this.eventEmitterSetPageName = new EventEmitter<string>(true); // create async event
  }

  public setPageName(pageName: string) {
    this.eventEmitterSetPageName.emit(pageName);
  }

  ngOnDestroy() {
    this.eventEmitterSetPageName.unsubscribe();
  }
}

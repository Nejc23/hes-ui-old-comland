import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Breadcrumb } from '../interfaces/breadcrumb.interface';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService implements OnDestroy {
  public eventEmitterSetPageName: EventEmitter<string>;
  public eventEmitterSetBreadcrumbs: EventEmitter<Breadcrumb[]>;

  constructor() {
    this.eventEmitterSetPageName = new EventEmitter<string>(true); // create async event
    this.eventEmitterSetBreadcrumbs = new EventEmitter<Breadcrumb[]>(true);
  }

  public setPageName(pageName: string) {
    this.eventEmitterSetPageName.emit(pageName);
  }

  public setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
    this.eventEmitterSetBreadcrumbs.emit(breadcrumbs);
  }

  ngOnDestroy() {
    this.eventEmitterSetPageName.unsubscribe();
    this.eventEmitterSetBreadcrumbs.unsubscribe();
  }
}

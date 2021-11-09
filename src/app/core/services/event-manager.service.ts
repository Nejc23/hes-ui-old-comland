import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { Observable, Subject } from 'rxjs';

@Injectable()
export class EventManagerService {
  private customEventSubjects: { [key: string]: Subject<any> } = {};

  constructor() {}

  public getCustom(key: string): Observable<any> {
    return this.getCustomSubject(key).asObservable();
  }

  public emitCustom(key: string, event: any) {
    this.getCustomSubject(key).next(event);
  }

  private getCustomSubject(key: string) {
    if (_.isUndefined(this.customEventSubjects[key])) {
      this.customEventSubjects[key] = new Subject();
    }

    return this.customEventSubjects[key];
  }
}

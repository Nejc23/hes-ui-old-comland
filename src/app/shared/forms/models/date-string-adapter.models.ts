import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class NgbUTCStringAdapter extends NgbDateAdapter<string> {
  fromModel(date: string): NgbDateStruct {
    return date
      ? {
          year: moment(date, 'YYYY-MM-DD').year(),
          month: moment(date, 'YYYY-MM-DD').month() + 1,
          day: moment(date, 'YYYY-MM-DD').date()
        }
      : null;
  }

  toModel(date: NgbDateStruct): string {
    if (!date) {
      return null;
    }

    const d = `${date.day}-${date.month}-${date.year}`;

    return date ? moment(d, 'DD-MM-YYYY').format() : null;
  }
}

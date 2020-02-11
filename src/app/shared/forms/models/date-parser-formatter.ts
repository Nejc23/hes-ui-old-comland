import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class NgbCustomDateParserFormatter extends NgbDateParserFormatter {
  constructor() {
    super();
  }

  format(date: NgbDateStruct): string {
    let stringDate = '';
    if (date) {
      stringDate += date.day + '. ';
      stringDate += date.month + '. ';
      stringDate += date.year;
    }
    return stringDate;
  }

  parse(value: string): NgbDateStruct {
    const toInteger = (x: string | number): number => {
      return parseInt(`${x}`, 10);
    };

    if (value) {
      const dateParts = value.trim().split('/');
      return {
        year: toInteger(dateParts[2]),
        month: toInteger(dateParts[1]),
        day: toInteger(dateParts[0])
      };
    }

    return { year: 0, month: 0, day: 0 };
  }
}

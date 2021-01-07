import { AbstractControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { toInteger } from 'lodash';
import * as moment from 'moment';
import { dateServerFormat, dateOnlyServerFormat } from '../consts/date-format';
import { regexPattern, regexPatternIso } from '../consts/regex.consts';

/**
 *
 * @param value date in format: 1. 1. 2018
 */
export function parse(value: string): NgbDateStruct {
  if (value) {
    const dateParts = value.replace(/\s/g, '').trim().split('.');
    return {
      year: toInteger(dateParts[2]),
      month: toInteger(dateParts[1]),
      day: toInteger(dateParts[0])
    };
  }
  return { year: 0, month: 0, day: 0 };
}

/**
 * Return date in format: 2018-02-02
 */
export function getParsedDateOnly(parsedDate: string): string {
  if (parsedDate) {
    const index = parsedDate.indexOf('T');
    if (index > 0) {
      parsedDate = parsedDate.substring(0, index);
    }
    const dateParts = parsedDate.replace(/\s/g, '').trim().split('-');
    if (dateParts && dateParts.length === 3) {
      const date = moment()
        .year(toInteger(dateParts[0]))
        .month(toInteger(dateParts[1]) - 1)
        .date(toInteger(dateParts[2]));
      return date.format(dateOnlyServerFormat);
    }
  }
  return null;
}

/**
 * Return date in format: 2018-02-02T10:35:24+01:00
 */
export function getParsedDate(parsedDate: NgbDateStruct): string {
  if (parsedDate) {
    const date = moment()
      .year(parsedDate.year)
      .month(parsedDate.month - 1)
      .date(parsedDate.day);
    const dateFormatted = date.format(dateServerFormat);
    return dateFormatted;
  }
  return null;
}

/**
 * Return date in Moment format
 */
export function getParsedFormatedDate(controlDate: AbstractControl): moment.Moment {
  let formattedDate: moment.Moment;
  if (controlDate.value && !controlDate.value.includes('T')) {
    // in case manually entered
    formattedDate = moment(getParsedDate(parse(controlDate.value)));
  } else {
    formattedDate = moment(controlDate.value); // chosen from date picker
  }
  return formattedDate;
}

/**
 * Test for date with REGEX in right format
 * Input examples allowed: 1. 2. 2018, 1.2.2018
 */
export function checkDateFormat(controlDate: AbstractControl): boolean {
  if (controlDate.value) {
    if (!controlDate.value.includes('T')) {
      // in case manually entered     1. 2. 2018, 1.2.2018
      const testString = controlDate.value.replace(/\s/g, '').trim();
      const controlDateOk = regexPattern.test(testString);
      return controlDateOk;
    }
    return true; // format in YYYY-MM-DDTHH:mm:ss
  }
}

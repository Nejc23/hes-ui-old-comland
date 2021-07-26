import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDateTime'
})
export class FormatDateTimePipe implements PipeTransform {
  constructor() {}

  public transform(value): any {
    if (!value) {
      return '';
    }
    return moment(value).format('L') + ' ' + moment(value).format('LT');
  }
}

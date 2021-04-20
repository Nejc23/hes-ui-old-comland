import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDateTime'
})
export class FormatDateTimePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public locale: string) {}

  public transform(value): any {
    console.log(value);
    if (!value) {
      return '';
    }
    return moment(value).format('L') + ' ' + moment(value).format('LT');
  }
}

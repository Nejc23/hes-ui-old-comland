import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';

@Pipe({
  name: 'formatDateTime'
})
export class FormatDateTimePipe implements PipeTransform {
  constructor() {}

  public transform(value): any {
    if (!value) {
      return '';
    }
    return moment(value).format(environment.dateDisplayFormat) + ' ' + moment(value).format(environment.timeFormatLong);
  }
}

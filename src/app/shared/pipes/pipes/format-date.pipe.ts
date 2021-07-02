import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  constructor() {}

  public transform(value): any {
    const locale_id = localStorage.getItem('lang');

    if (!value) {
      return '';
    }
    return new DatePipe(locale_id).transform(value, environment.dateFormat);
  }
}

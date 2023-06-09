import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

// not used?
@Pipe({
  name: 'dateDefault'
})
export class DateDefaultPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public format: string) {}

  public transform(value): any {
    const locale_id = localStorage.getItem('lang');

    if (!value) {
      return '';
    }
    return new DatePipe(locale_id).transform(value, this.format);
  }
}

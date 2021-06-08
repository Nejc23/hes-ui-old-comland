import { Pipe, PipeTransform, Inject, LOCALE_ID, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

// not used?
@Pipe({
  name: 'dateDefault'
})
export class DateDefaultPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public format: string) {}

  public transform(value): any {
    let locale_id = localStorage.getItem('lang');

    if (!value) {
      return '';
    }
    return new DatePipe(locale_id).transform(value, this.format);
  }
}

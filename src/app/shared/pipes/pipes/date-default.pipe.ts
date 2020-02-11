import { Pipe, PipeTransform, Inject, LOCALE_ID, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateDefault'
})
export class DateDefaultPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public locale: string, @Inject(LOCALE_ID) public format: string) {}

  public transform(value): any {
    if (!value) {
      return '';
    }
    return new DatePipe(this.locale).transform(value, this.format);
  }
}

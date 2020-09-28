import { Pipe, PipeTransform, Inject, LOCALE_ID, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'formatDateTime'
})
export class FormatDateTimePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public locale: string) {}

  public transform(value): any {
    if (!value) {
      return '';
    }
    return new DatePipe(this.locale).transform(value, environment.dateTimeFormat);
  }
}

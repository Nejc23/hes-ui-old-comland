import { Pipe, PipeTransform, Inject, LOCALE_ID, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  constructor() {}

  public transform(value): any {
    let locale_id = localStorage.getItem('lang');

    if (!value) {
      return '';
    }
    return new DatePipe(locale_id).transform(value, environment.dateFormat);
  }
}

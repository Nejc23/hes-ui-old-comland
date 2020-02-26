import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class ActionFormStaticTextService {
  constructor(private i18n: I18n) {}

  get placeholderSearch() {
    return this.i18n('Search');
  }
}
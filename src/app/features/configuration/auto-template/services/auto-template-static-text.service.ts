import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesStaticTextService {
  constructor(private i18n: I18n) {}

  get title() {
    return this.i18n('Auto Templates');
  }

  get notAvailableTekst() {
    return this.i18n('N/A');
  }
}

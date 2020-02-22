import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsStaticTextService {
  constructor(private i18n: I18n) {}

  get headerTitleDCU() {
    return this.i18n('Data Concentrator Units');
  }
  /*
  get breadcrumbNameDCU() {
    return this.i18n('Overview - Data Concentrator Units');
  }
*/
  get notAvailableTekst() {
    return this.i18n('N/A');
  }

  get noFilterAppliedTekst() {
    return this.i18n('No filter applied');
  }

  get nextPlannedReadText() {
    return this.i18n('Next planned read') + ' ';
  }
}

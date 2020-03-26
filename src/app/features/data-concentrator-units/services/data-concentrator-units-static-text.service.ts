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

  get noRecordsFound() {
    return this.i18n('No records found. You need to adjust your search or filter parameters.');
  }

  get loadingData() {
    return this.i18n('Loading data...');
  }

  get noFilterAppliedTekst() {
    return this.i18n('No filter applied');
  }

  get nextPlannedReadText() {
    return this.i18n('Next planned read') + ' ';
  }

  setfilterHeaderText(filterName: string, status: boolean, type: boolean, vendor: boolean, tag: boolean) {
    let result = this.noFilterAppliedTekst;
    let additionalString = '';

    if (filterName !== '' && filterName !== undefined) {
      additionalString = status || type || vendor || tag ? ' · ' : '';
      result = filterName + additionalString;
    } else if (status || type || vendor || tag) {
      result = '';
    }

    if ((filterName !== '' && filterName !== undefined) || status || type || vendor || tag) {
      result = result + this.i18n('Filtered by: ');
    }

    if (status) {
      additionalString = type || vendor || tag ? ', ' : '';
      result = result + this.i18n('status') + additionalString;
    }

    if (type) {
      additionalString = vendor || tag ? ', ' : '';
      result = result + this.i18n('type') + additionalString;
    }

    if (vendor) {
      additionalString = tag ? ', ' : '';
      result = result + this.i18n('vendor') + additionalString;
    }

    if (tag) {
      result = result + this.i18n('tag');
    }
    return result;
  }
}

import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsStaticTextService {
  public titleBreadCrumbs = this.i18n('Overview - Data Concentrator Units');

  constructor(private i18n: I18n) {}

  get headerTitleDCU() {
    return this.i18n('Data Concentrator Units');
  }

  get jobsTitle() {
    return this.i18n('Jobs');
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

  setfilterHeaderText(
    filterName: string,
    status: boolean,
    readStatuses: boolean,
    type: boolean,
    vendor: boolean,
    tag: boolean,
    showDeleted: boolean
  ) {
    let result = this.noFilterAppliedTekst;
    let additionalString = '';

    if (filterName !== '' && filterName !== undefined) {
      additionalString = status || readStatuses || type || vendor || tag || showDeleted ? ' · ' : '';
      result = filterName + additionalString;
    } else if (status || readStatuses || type || vendor || tag || showDeleted) {
      result = '';
    }

    if ((filterName !== '' && filterName !== undefined) || status || readStatuses || type || vendor || tag || showDeleted) {
      result = result + this.i18n('Filtered by: ');
    }

    if (status) {
      additionalString = readStatuses || type || vendor || tag || showDeleted ? ', ' : '';
      result = result + this.i18n('status') + additionalString;
    }

    if (readStatuses) {
      additionalString = type || vendor || tag || showDeleted ? ', ' : '';
      result = result + this.i18n('read status') + additionalString;
    }

    if (type) {
      additionalString = vendor || tag || showDeleted ? ', ' : '';
      result = result + this.i18n('type') + additionalString;
    }

    if (vendor) {
      additionalString = tag || showDeleted ? ', ' : '';
      result = result + this.i18n('vendor') + additionalString;
    }

    if (tag) {
      additionalString = showDeleted ? ', ' : '';
      result = result + this.i18n('tag') + additionalString;
    }

    if (showDeleted) {
      result = result + this.i18n('show deleted');
    }
    return result;
  }
}

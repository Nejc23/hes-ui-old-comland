import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeStaticTextService {
  constructor(private i18n: I18n) {}

  get headerTitleMeterUnitsType() {
    return this.i18n('Meter Units');
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
    vendor: boolean,
    tag: boolean,
    readStatuses: boolean,
    firmware: boolean,
    breakerState: boolean,
    showChildMBus: boolean,
    showDeleted: boolean
  ) {
    let result = this.noFilterAppliedTekst;
    let additionalString = '';
    if (filterName !== '' && filterName !== undefined) {
      additionalString = status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted ? ' · ' : '';
      result = filterName + additionalString;
    } else if (status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted) {
      result = '';
    }

    if (
      (filterName !== '' && filterName !== undefined) ||
      status ||
      vendor ||
      tag ||
      readStatuses ||
      firmware ||
      breakerState ||
      showChildMBus ||
      showDeleted
    ) {
      result = result + this.i18n('Filtered by: ');
    }

    if (status) {
      additionalString = vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted ? ', ' : '';
      result = result + this.i18n('status') + additionalString;
    }

    if (vendor) {
      additionalString = tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted ? ', ' : '';
      result = result + this.i18n('vendor') + additionalString;
    }

    if (tag) {
      additionalString = readStatuses || firmware || breakerState || showChildMBus || showDeleted ? ', ' : '';
      result = result + this.i18n('tag') + additionalString;
    }

    if (readStatuses) {
      additionalString = firmware || breakerState || showChildMBus || showDeleted ? ', ' : '';
      result = result + this.i18n('read status') + additionalString;
    }

    if (firmware) {
      additionalString = breakerState || showChildMBus || showDeleted ? ', ' : '';
      result = result + this.i18n('firmware') + additionalString;
    }

    if (breakerState) {
      additionalString = showChildMBus || showDeleted ? ', ' : '';
      result = result + this.i18n('breaker state') + additionalString;
    }

    if (showChildMBus) {
      additionalString = showDeleted ? ', ' : '';
      result = result + this.i18n('show child MBus') + additionalString;
    }

    if (showDeleted) {
      result = result + this.i18n('show deleted');
    }
    return result;
  }
}

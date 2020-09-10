import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class DcuForJobStaticTextService {
  public titleBreadCrumbs = this.i18n('Overview - Concentrators');

  constructor(private i18n: I18n) {}

  get headerTitleDcu() {
    return this.i18n('Concentrators for');
  }

  get notAvailableTekst() {
    return this.i18n('N/A');
  }

  get noRecordsFound() {
    return this.i18n('No records found.');
  }

  get loadingData() {
    return this.i18n('Loading data...');
  }

  get noFilterAppliedTekst() {
    return this.i18n('No filter applied');
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
    showDeleted: boolean,
    showWithoutTemplate: boolean,
    showOnlyReadyForActivation: boolean
  ) {
    let result = this.noFilterAppliedTekst;
    let additionalString = '';
    if (filterName !== '' && filterName !== undefined) {
      additionalString =
        status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate
          ? ' · '
          : '';
      result = filterName + additionalString;
    } else if (status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate) {
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
      showDeleted ||
      showWithoutTemplate
    ) {
      result = result + this.i18n('Filtered by: ');
    }

    if (status) {
      additionalString =
        vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('status') + additionalString;
    }

    if (vendor) {
      additionalString = tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('vendor') + additionalString;
    }

    if (tag) {
      additionalString = readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('tag') + additionalString;
    }

    if (readStatuses) {
      additionalString = firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('read status') + additionalString;
    }

    if (firmware) {
      additionalString = breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('firmware') + additionalString;
    }

    if (breakerState) {
      additionalString = showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('breaker state') + additionalString;
    }

    if (showChildMBus) {
      additionalString = showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('show child MBus') + additionalString;
    }

    if (showDeleted) {
      additionalString = showWithoutTemplate ? ', ' : '';
      result = result + this.i18n('show deleted') + additionalString;
    }

    if (showWithoutTemplate) {
      additionalString = showOnlyReadyForActivation ? ', ' : '';
      result = result + this.i18n('show without template') + additionalString;
    }

    if (showOnlyReadyForActivation) {
      result = result + this.i18n('show only ready for activation');
    }

    return result;
  }
}

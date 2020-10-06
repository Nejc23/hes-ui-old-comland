import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FiltersInfo } from 'src/app/shared/forms/interfaces/filters-info.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeStaticTextService {
  public titleBreadCrumbs = this.i18n('Overview - Meter Units');

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

  getFiltersInfo(
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
  ): FiltersInfo {
    const result: FiltersInfo = {
      isSet: false,
      count: 0,
      text: this.noFilterAppliedTekst
    };

    let additionalString = '';
    if (filterName !== '' && filterName !== undefined) {
      additionalString =
        status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate
          ? ' · '
          : '';
      result.text = filterName + additionalString;
    } else if (status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate) {
      result.text = '';
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
      result.text += this.i18n('Filtered by: ');
    }

    if (status) {
      additionalString =
        vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('status') + additionalString;
      result.count++;
    }

    if (vendor) {
      additionalString = tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('vendor') + additionalString;
      result.count++;
    }

    if (tag) {
      additionalString = readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('tag') + additionalString;
      result.count++;
    }

    if (readStatuses) {
      additionalString = firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('read status') + additionalString;
      result.count++;
    }

    if (firmware) {
      additionalString = breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('firmware') + additionalString;
      result.count++;
    }

    if (breakerState) {
      additionalString = showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('breaker state') + additionalString;
      result.count++;
    }

    if (showChildMBus) {
      additionalString = showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('show child MBus') + additionalString;
      result.count++;
    }

    if (showDeleted) {
      additionalString = showWithoutTemplate ? ', ' : '';
      result.text += this.i18n('show deleted') + additionalString;
      result.count++;
    }

    if (showWithoutTemplate) {
      additionalString = showOnlyReadyForActivation ? ', ' : '';
      result.text += this.i18n('show without template') + additionalString;
      result.count++;
    }

    if (showOnlyReadyForActivation) {
      result.text += this.i18n('show only ready for activation');
      result.count++;
    }

    result.isSet = result.count > 0;

    return result;
  }
}

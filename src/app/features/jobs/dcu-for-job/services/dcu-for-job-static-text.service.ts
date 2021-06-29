import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DcuForJobStaticTextService {
  constructor(private translate: TranslateService) {}

  get headerTitleDcu() {
    return `Concentrator units for`;
  }

  get notAvailableTekst() {
    return `N/A`;
  }

  get noRecordsFound() {
    return `No records found.`;
  }

  get loadingData() {
    return `Loading data...`;
  }

  get noFilterAppliedTekst() {
    return `No filter applied`;
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
    showWithoutTemplate: boolean,
    showOnlyReadyForActivation: boolean
  ) {
    let result = this.noFilterAppliedTekst;
    let additionalString = '';
    if (filterName !== '' && filterName !== undefined) {
      additionalString =
        status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate ? ' · ' : '';
      result = filterName + additionalString;
    } else if (status || vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate) {
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
      showWithoutTemplate
    ) {
      result = result + this.translate.instant('FILTER.FILTERED-BY') + ' ';
    }

    if (status) {
      additionalString = vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.STATUS') + additionalString;
    }

    if (vendor) {
      additionalString = tag || readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.VENDOR') + additionalString;
    }

    if (tag) {
      additionalString = readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.TAG') + additionalString;
    }

    if (readStatuses) {
      additionalString = firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.READ-STATUS') + additionalString;
    }

    if (firmware) {
      additionalString = breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.FIRMWARE').toLowerCase() + additionalString;
    }

    if (breakerState) {
      additionalString = showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.DISCONNECTOR-STATE').toLowerCase() + additionalString;
    }

    if (showChildMBus) {
      additionalString = showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('COMMON.SHOW-CHILD-MBUS') + additionalString;
    }

    if (showWithoutTemplate) {
      additionalString = showOnlyReadyForActivation ? ', ' : '';
      result = result + this.translate.instant('COMMON.SHOW-WITHOUT-TEMPLATE') + additionalString;
    }

    if (showOnlyReadyForActivation) {
      result = result + this.translate.instant('COMMON.SHOW-ONLY-FOR-ACTIVATION');
    }

    return result;
  }
}

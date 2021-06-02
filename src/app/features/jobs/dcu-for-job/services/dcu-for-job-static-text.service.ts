import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DcuForJobStaticTextService {
  public titleBreadCrumbs = `Overview - Concentrators`;

  constructor() {}

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
      result = result + `Filtered by: `;
    }

    if (status) {
      additionalString = vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + `status` + additionalString;
    }

    if (vendor) {
      additionalString = tag || readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + `vendor` + additionalString;
    }

    if (tag) {
      additionalString = readStatuses || firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + `tag` + additionalString;
    }

    if (readStatuses) {
      additionalString = firmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + `read status` + additionalString;
    }

    if (firmware) {
      additionalString = breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + `firmware` + additionalString;
    }

    if (breakerState) {
      additionalString = showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + `disconnector state` + additionalString;
    }

    if (showChildMBus) {
      additionalString = showWithoutTemplate ? ', ' : '';
      result = result + `show child MBus` + additionalString;
    }

    if (showWithoutTemplate) {
      additionalString = showOnlyReadyForActivation ? ', ' : '';
      result = result + `show without template` + additionalString;
    }

    if (showOnlyReadyForActivation) {
      result = result + `show only ready for activation`;
    }

    return result;
  }
}

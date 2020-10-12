import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AllForJobStaticTextService {
  public titleBreadCrumbs = $localize `Overview - Meter Units`;

  constructor() {}

  get headerTitleMeterUnitsAll() {
    return $localize `Meter Units for`;
  }

  get notAvailableTekst() {
    return $localize `N/A`;
  }

  get noRecordsFound() {
    return $localize `No records found.`;
  }

  get loadingData() {
    return $localize `Loading data...`;
  }

  get noFilterAppliedTekst() {
    return $localize `No filter applied`;
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
      result = result + $localize `Filtered by: `;
    }

    if (status) {
      additionalString =
        vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + $localize `status` + additionalString;
    }

    if (vendor) {
      additionalString = tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + $localize `vendor` + additionalString;
    }

    if (tag) {
      additionalString = readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + $localize `tag` + additionalString;
    }

    if (readStatuses) {
      additionalString = firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + $localize `read status` + additionalString;
    }

    if (firmware) {
      additionalString = breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + $localize `firmware` + additionalString;
    }

    if (breakerState) {
      additionalString = showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + $localize `breaker state` + additionalString;
    }

    if (showChildMBus) {
      additionalString = showDeleted || showWithoutTemplate ? ', ' : '';
      result = result + $localize `show child MBus` + additionalString;
    }

    if (showDeleted) {
      additionalString = showWithoutTemplate ? ', ' : '';
      result = result + $localize `show deleted` + additionalString;
    }

    if (showWithoutTemplate) {
      additionalString = showOnlyReadyForActivation ? ', ' : '';
      result = result + $localize `show without template` + additionalString;
    }

    if (showOnlyReadyForActivation) {
      result = result + $localize `show only ready for activation`;
    }

    return result;
  }
}

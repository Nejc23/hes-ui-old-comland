import { Injectable } from '@angular/core';
import { FiltersInfo } from 'src/app/shared/forms/interfaces/filters-info.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeStaticTextService {
  public titleBreadCrumbs = $localize `Overview - Meter Units`;

  constructor() {}

  get headerTitleMeterUnitsType() {
    return $localize `Meter Units`;
  }
  /*
  get breadcrumbNameDCU() {
    return $localize `Overview - Data Concentrator Units`;
  }
*/
  get notAvailableTekst() {
    return $localize `N/A`;
  }

  get noRecordsFound() {
    return $localize `No records found. You need to adjust your search or filter parameters.`;
  }

  get loadingData() {
    return $localize `Loading data...`;
  }

  get noFilterAppliedTekst() {
    return $localize `No filter applied`;
  }

  get nextPlannedReadText() {
    return $localize `Next planned read` + ' ';
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
      result.text += $localize `Filtered by: `;
    }

    if (status) {
      additionalString =
        vendor || tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += $localize `status` + additionalString;
      result.count++;
    }

    if (vendor) {
      additionalString = tag || readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += $localize `vendor` + additionalString;
      result.count++;
    }

    if (tag) {
      additionalString = readStatuses || firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += $localize `tag` + additionalString;
      result.count++;
    }

    if (readStatuses) {
      additionalString = firmware || breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += $localize `read status` + additionalString;
      result.count++;
    }

    if (firmware) {
      additionalString = breakerState || showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += $localize `firmware` + additionalString;
      result.count++;
    }

    if (breakerState) {
      additionalString = showChildMBus || showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += $localize `breaker state` + additionalString;
      result.count++;
    }

    if (showChildMBus) {
      additionalString = showDeleted || showWithoutTemplate ? ', ' : '';
      result.text += $localize `show child MBus` + additionalString;
      result.count++;
    }

    if (showDeleted) {
      additionalString = showWithoutTemplate ? ', ' : '';
      result.text += $localize `show deleted` + additionalString;
      result.count++;
    }

    if (showWithoutTemplate) {
      additionalString = showOnlyReadyForActivation ? ', ' : '';
      result.text += $localize `show without template` + additionalString;
      result.count++;
    }

    if (showOnlyReadyForActivation) {
      result.text += $localize `show only ready for activation`;
      result.count++;
    }

    result.isSet = result.count > 0;

    return result;
  }
}

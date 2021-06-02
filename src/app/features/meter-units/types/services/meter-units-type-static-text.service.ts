import { Injectable } from '@angular/core';
import { FiltersInfo } from 'src/app/shared/forms/interfaces/filters-info.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeStaticTextService {
  // public titleBreadCrumbs =  `Overview - Meter Units`;

  constructor() {}

  get headerTitleMeterUnitsType() {
    return `Meters`;
  }
  /*
  get breadcrumbNameDCU() {
    return   `Overview - Data Concentrator Units`;
  }
*/
  get notAvailableTekst() {
    return `N/A`;
  }

  get notSetText() {
    return `Not set`;
  }

  get noRecordsFound() {
    return `No records found. You may need to adjust your search or filter parameters.`;
  }

  get loadingData() {
    return `Loading data...`;
  }

  get noFilterAppliedTekst() {
    return `No filters applied`;
  }

  get nextPlannedReadText() {
    return `Next planned read` + ' ';
  }

  getFiltersInfo(
    filterName: string,
    status: boolean,
    vendor: boolean,
    tag: boolean,
    readStatuses: boolean,
    firmware: boolean,
    disconnectorState: boolean,
    ciiState: boolean,
    showOptionFilter: boolean,
    protocol: boolean,
    medium: boolean
    // showChildMBus: boolean,
    // showWithoutTemplate: boolean,
    // showOnlyReadyForActivation: boolean
  ): FiltersInfo {
    const separator = ', ';
    const result: FiltersInfo = {
      isSet: false,
      count: 0,
      text: this.noFilterAppliedTekst
    };

    let additionalString = '';
    if (filterName !== '' && filterName !== undefined) {
      additionalString =
        status || vendor || tag || readStatuses || firmware || disconnectorState || ciiState || showOptionFilter || protocol || medium
          ? ' · '
          : '';
      result.text = filterName + additionalString;
    } else if (
      status ||
      vendor ||
      tag ||
      readStatuses ||
      firmware ||
      disconnectorState ||
      ciiState ||
      showOptionFilter ||
      protocol ||
      medium
    ) {
      result.text = '';
    }

    if (
      (filterName !== '' && filterName !== undefined) ||
      status ||
      vendor ||
      tag ||
      readStatuses ||
      firmware ||
      disconnectorState ||
      ciiState ||
      showOptionFilter ||
      protocol ||
      medium
    ) {
      result.text += `Filtered by: `;
    }

    if (status) {
      result.text += `status` + separator;
      result.count++;
    }

    if (protocol) {
      result.text += `protocol` + separator;
      result.count++;
    }

    if (vendor) {
      result.text += `vendor` + separator;
      result.count++;
    }

    if (medium) {
      result.text += `medium` + separator;
      result.count++;
    }

    if (tag) {
      result.text += `tag` + separator;
      result.count++;
    }

    if (readStatuses) {
      result.text += `read status` + separator;
      result.count++;
    }

    if (firmware) {
      result.text += `firmware` + separator;
      result.count++;
    }

    if (disconnectorState) {
      result.text += `disconnector state` + separator;
      result.count++;
    }

    if (ciiState) {
      result.text += `CII state` + separator;
      result.count++;
    }

    if (showOptionFilter) {
      result.text += `show option` + separator;
      result.count++;
    }

    result.isSet = false;
    if (result.count > 0) {
      result.text = result.text.replace(/\,\s$/, '');
      result.isSet = true;
    }

    return result;
  }
}

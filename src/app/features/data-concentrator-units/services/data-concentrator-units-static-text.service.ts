import { Injectable } from '@angular/core';
import { FiltersInfo } from '../../../shared/forms/interfaces/filters-info.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsStaticTextService {
  // public titleBreadCrumbs =  `Data Concentrator Units`;

  constructor() {}

  get headerTitleDCU() {
    return `Concentrators`;
  }

  get jobsTitle() {
    return `Jobs`;
  }

  get notAvailableTekst() {
    return `N/A`;
  }

  get noRecordsFound() {
    return `No records found. You may need to adjust your search or filter parameters.`;
  }

  get loadingData() {
    return `Loading data...`;
  }

  get noFilterAppliedTekst() {
    return `No filter applied`;
  }

  get nextPlannedReadText() {
    return `Next planned read` + ' ';
  }

  getFiltersInfo(filterName: string, status: boolean, readStatuses: boolean, type: boolean, vendor: boolean, tag: boolean): FiltersInfo {
    const result: FiltersInfo = {
      isSet: false,
      count: 0,
      text: this.noFilterAppliedTekst
    };

    let additionalString = '';

    if (filterName !== '' && filterName !== undefined) {
      additionalString = status || readStatuses || type || vendor || tag ? ' · ' : '';
      result.text = filterName + additionalString;
    } else if (status || readStatuses || type || vendor || tag) {
      result.text = '';
    }

    if ((filterName !== '' && filterName !== undefined) || status || readStatuses || type || vendor || tag) {
      result.text += `Filtered by: `;
    }

    if (status) {
      additionalString = readStatuses || type || vendor || tag ? ', ' : '';
      result.text += `status` + additionalString;
      result.count++;
    }

    if (readStatuses) {
      additionalString = type || vendor || tag ? ', ' : '';
      result.text += `read status` + additionalString;
      result.count++;
    }

    if (type) {
      additionalString = vendor || tag ? ', ' : '';
      result.text += `type` + additionalString;
      result.count++;
    }

    if (vendor) {
      additionalString = tag ? ', ' : '';
      result.text += `vendor` + additionalString;
      result.count++;
    }

    if (tag) {
      result.text += `tag`;
      result.count++;
    }

    result.isSet = result.count > 0;

    return result;
  }
}

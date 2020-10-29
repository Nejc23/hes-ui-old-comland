import { Injectable } from '@angular/core';
import { FiltersInfo } from '../../../shared/forms/interfaces/filters-info.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsStaticTextService {
  public titleBreadCrumbs = $localize`Data Concentrator Units`;

  constructor() {}

  get headerTitleDCU() {
    return $localize`Data Concentrator Units`;
  }

  get jobsTitle() {
    return $localize`Jobs`;
  }

  get notAvailableTekst() {
    return $localize`N/A`;
  }

  get noRecordsFound() {
    return $localize`No records found. You need to adjust your search or filter parameters.`;
  }

  get loadingData() {
    return $localize`Loading data...`;
  }

  get noFilterAppliedTekst() {
    return $localize`No filter applied`;
  }

  get nextPlannedReadText() {
    return $localize`Next planned read` + ' ';
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
      result.text += $localize`Filtered by: `;
    }

    if (status) {
      additionalString = readStatuses || type || vendor || tag ? ', ' : '';
      result.text += $localize`status` + additionalString;
      result.count++;
    }

    if (readStatuses) {
      additionalString = type || vendor || tag ? ', ' : '';
      result.text += $localize`read status` + additionalString;
      result.count++;
    }

    if (type) {
      additionalString = vendor || tag ? ', ' : '';
      result.text += $localize`type` + additionalString;
      result.count++;
    }

    if (vendor) {
      additionalString = tag ? ', ' : '';
      result.text += $localize`vendor` + additionalString;
      result.count++;
    }

    if (tag) {
      result.text += $localize`tag`;
      result.count++;
    }

    result.isSet = result.count > 0;

    return result;
  }
}

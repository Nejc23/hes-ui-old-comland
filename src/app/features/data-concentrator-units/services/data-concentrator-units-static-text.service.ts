import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FiltersInfo } from '../../../shared/forms/interfaces/filters-info.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsStaticTextService {
  public titleBreadCrumbs = this.i18n('Data Concentrator Units');

  constructor(private i18n: I18n) {}

  get headerTitleDCU() {
    return this.i18n('Data Concentrator Units');
  }

  get jobsTitle() {
    return this.i18n('Jobs');
  }

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
    readStatuses: boolean,
    type: boolean,
    vendor: boolean,
    tag: boolean,
    showDeleted: boolean
  ): FiltersInfo {
    const result: FiltersInfo = {
      isSet: false,
      count: 0,
      text: this.noFilterAppliedTekst
    };

    let additionalString = '';

    if (filterName !== '' && filterName !== undefined) {
      additionalString = status || readStatuses || type || vendor || tag || showDeleted ? ' · ' : '';
      result.text = filterName + additionalString;
    } else if (status || readStatuses || type || vendor || tag || showDeleted) {
      result.text = '';
    }

    if ((filterName !== '' && filterName !== undefined) || status || readStatuses || type || vendor || tag || showDeleted) {
      result.text += this.i18n('Filtered by: ');
    }

    if (status) {
      additionalString = readStatuses || type || vendor || tag || showDeleted ? ', ' : '';
      result.text += this.i18n('status') + additionalString;
      result.count++;
    }

    if (readStatuses) {
      additionalString = type || vendor || tag || showDeleted ? ', ' : '';
      result.text += this.i18n('read status') + additionalString;
      result.count++;
    }

    if (type) {
      additionalString = vendor || tag || showDeleted ? ', ' : '';
      result.text += this.i18n('type') + additionalString;
      result.count++;
    }

    if (vendor) {
      additionalString = tag || showDeleted ? ', ' : '';
      result.text += this.i18n('vendor') + additionalString;
      result.count++;
    }

    if (tag) {
      additionalString = showDeleted ? ', ' : '';
      result.text += this.i18n('tag') + additionalString;
      result.count++;
    }

    if (showDeleted) {
      result.text += this.i18n('show deleted');
      result.count++;
    }

    result.isSet = result.count > 0;

    return result;
  }
}

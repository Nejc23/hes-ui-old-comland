import { Injectable } from '@angular/core';
import { FiltersInfo } from 'src/app/shared/forms/interfaces/filters-info.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeStaticTextService {
  constructor(private translate: TranslateService) {}

  get headerTitleMeterUnitsType() {
    return this.translate.instant('MENU.METERS');
  }

  get notAvailableTekst() {
    return this.translate.instant('COMMON.NA');
  }

  get notSetText() {
    return this.translate.instant('COMMON.NOT-SET');
  }

  get noRecordsFound() {
    return this.translate.instant('COMMON.NO-RECORDS-FOUND');
  }

  get loadingData() {
    return this.translate.instant('COMMON.LOADING-DATA');
  }

  get noFilterAppliedTekst() {
    return this.translate.instant('COMMON.NO-FILTER-APPLIED');
  }

  get nextPlannedReadText() {
    return this.translate.instant('JOB.NEXT-READ') + ' ';
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
    medium: boolean,
    slaFilter: boolean
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
      result.text += this.translate.instant('FILTER.FILTERED-BY');
    }

    if (status) {
      result.text += this.translate.instant('FORM.STATUS').toLowerCase() + separator;
      result.count++;
    }

    if (protocol) {
      result.text += this.translate.instant('FORM.PROTOCOL').toLowerCase() + separator;
      result.count++;
    }

    if (vendor) {
      result.text += this.translate.instant('FORM.VENDOR').toLowerCase() + separator;
      result.count++;
    }

    if (medium) {
      result.text += this.translate.instant('FORM.MEDIUM').toLowerCase() + separator;
      result.count++;
    }

    if (tag) {
      result.text += this.translate.instant('FORM.TAG').toLowerCase() + separator;
      result.count++;
    }

    if (readStatuses) {
      result.text += this.translate.instant('FORM.READ-STATUS').toLowerCase() + separator;
      result.count++;
    }

    if (firmware) {
      result.text += this.translate.instant('FORM.FIRMWARE').toLowerCase() + separator;
      result.count++;
    }

    if (disconnectorState) {
      result.text += this.translate.instant('FORM.DISCONNECTOR-STATE').toLowerCase() + separator;
      result.count++;
    }

    if (ciiState) {
      result.text += this.translate.instant('FORM.CII-STATE').toLowerCase() + separator;
      result.count++;
    }

    if (showOptionFilter) {
      result.text += this.translate.instant('COMMON.SHOW-OPTION').toLowerCase() + separator;
      result.count++;
    }

    if (slaFilter) {
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

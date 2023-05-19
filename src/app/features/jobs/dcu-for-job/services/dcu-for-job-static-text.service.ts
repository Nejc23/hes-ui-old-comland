import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DcuForJobStaticTextService {
  constructor(private translate: TranslateService) {}

  get headerTitleDcu() {
    return this.translate.instant('DCU.CONCENTRATOR-UNITS-FOR');
  }

  get notAvailableTekst() {
    return this.translate.instant('COMMON.NA');
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

  setfilterHeaderText(
    filterName: string,
    status: boolean,
    vendor: boolean,
    tag: boolean,
    readStatuses: boolean,
    appFirmware: boolean,
    metrologyFirmware: boolean,
    moduleFirmware: boolean,
    breakerState: boolean,
    showChildMBus: boolean,
    showWithoutTemplate: boolean,
    showOnlyReadyForActivation: boolean
  ) {
    let result = this.noFilterAppliedTekst;
    let additionalString = '';
    if (filterName !== '' && filterName !== undefined) {
      additionalString =
        status ||
        vendor ||
        tag ||
        readStatuses ||
        appFirmware ||
        metrologyFirmware ||
        moduleFirmware ||
        breakerState ||
        showChildMBus ||
        showWithoutTemplate
          ? ' · '
          : '';
      result = filterName + additionalString;
    } else if (
      status ||
      vendor ||
      tag ||
      readStatuses ||
      appFirmware ||
      metrologyFirmware ||
      moduleFirmware ||
      breakerState ||
      showChildMBus ||
      showWithoutTemplate
    ) {
      result = '';
    }

    if (
      (filterName !== '' && filterName !== undefined) ||
      status ||
      vendor ||
      tag ||
      readStatuses ||
      appFirmware ||
      metrologyFirmware ||
      moduleFirmware ||
      breakerState ||
      showChildMBus ||
      showWithoutTemplate
    ) {
      result = result + this.translate.instant('FILTER.FILTERED-BY') + ' ';
    }

    if (status) {
      additionalString =
        vendor ||
        tag ||
        readStatuses ||
        appFirmware ||
        metrologyFirmware ||
        moduleFirmware ||
        breakerState ||
        showChildMBus ||
        showWithoutTemplate
          ? ', '
          : '';
      result = result + this.translate.instant('GRID.STATUS') + additionalString;
    }

    if (vendor) {
      additionalString = tag || readStatuses || appFirmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.VENDOR') + additionalString;
    }

    if (tag) {
      additionalString = readStatuses || appFirmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.TAG') + additionalString;
    }

    if (readStatuses) {
      additionalString = appFirmware || breakerState || showChildMBus || showWithoutTemplate ? ', ' : '';
      result = result + this.translate.instant('GRID.READ-STATUS') + additionalString;
    }

    if (appFirmware) {
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

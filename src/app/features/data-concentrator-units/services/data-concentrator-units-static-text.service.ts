import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FiltersInfo } from '../../../shared/forms/interfaces/filters-info.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsStaticTextService {
  constructor(private translate: TranslateService) {}

  get notAvailableTekst() {
    return this.translate.instant('COMMON.NA');
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
    readStatuses: boolean,
    type: boolean,
    vendor: boolean,
    tag: boolean,
    sla: boolean
  ): FiltersInfo {
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
      result.text += this.translate.instant('FILTER.FILTERED-BY');
    }

    if (status) {
      additionalString = readStatuses || type || vendor || tag ? ', ' : '';
      result.text += this.translate.instant('DCU.STATUS', { additionalString: additionalString });
      result.count++;
    }

    if (readStatuses) {
      additionalString = type || vendor || tag ? ', ' : '';
      result.text += this.translate.instant('DCU.READ-STATUS', { additionalString: additionalString });
      result.count++;
    }

    if (type) {
      additionalString = vendor || tag ? ', ' : '';
      result.text += this.translate.instant('DCU.TYPE', { additionalString: additionalString });
      result.count++;
    }

    if (vendor) {
      additionalString = tag ? ', ' : '';
      result.text += this.translate.instant('DCU.VENDOR', { additionalString: additionalString });
      result.count++;
    }

    if (tag) {
      result.text += this.translate.instant('COMMON.TAG');
      result.count++;
    }

    if (sla) {
      result.count++;
    }

    result.isSet = result.count > 0;

    return result;
  }
}

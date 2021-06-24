import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class JobsStaticTextService {
  constructor(private translate: TranslateService) {}

  get jobsTitle() {
    return this.translate.instant('FORM.JOBS');
  }

  get notAvailableTekst() {
    return this.translate.instant('COMMON.NA');
  }

  get noRecordsFound() {
    return this.translate.instant('COMMON.NO-RECORDS-SEARCH');
  }

  get noData() {
    return this.translate.instant('JOB.NO-JOBS');
  }

  get loadingData() {
    return this.translate.instant('COMMON.LOADING-DATA');
  }

  get noFilterAppliedTekst() {
    return this.translate.instant('COMMON.NO-FILTER-APPLIED');
  }

  get placeholderSearch() {
    return this.translate.instant('COMMON.SEARCH');
  }

  get messageSchedulerJobStarted() {
    return this.translate.instant('JOB.SCHEDULER-JOB-STARTED');
  }

  get messageServerError() {
    return this.translate.instant('COMMON.SERVER-ERROR');
  }
}

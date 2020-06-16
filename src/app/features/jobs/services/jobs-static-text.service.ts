import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class JobsStaticTextService {
  constructor(private i18n: I18n) {}

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

  get placeholderSearch() {
    return this.i18n('Search');
  }

  get messageSchedulerJobStarted() {
    return this.i18n(`Scheduler job started!`);
  }

  get messageJobStopped() {
    return this.i18n(`Job stoped!`);
  }

  get messageJobCanceled() {
    return this.i18n(`Job canceled!`);
  }

  get messageServerError() {
    return this.i18n(`Server error!`);
  }
}

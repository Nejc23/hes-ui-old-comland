import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobsStaticTextService {
  constructor() {}

  get jobsTitle() {
    return `Jobs`;
  }

  get notAvailableTekst() {
    return `N/A`;
  }

  get noRecordsFound() {
    return `No records found. You may need to adjust your search or filter parameters.`;
  }

  get noData() {
    return `No Jobs have been added yet.`;
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

  get placeholderSearch() {
    return `Search`;
  }

  get messageSchedulerJobStarted() {
    return `Scheduler job started!`;
  }

  get messageJobStopped() {
    return `Job stoped!`;
  }

  get messageJobCanceled() {
    return `Job canceled!`;
  }

  get messageServerError() {
    return `Server error!`;
  }
}

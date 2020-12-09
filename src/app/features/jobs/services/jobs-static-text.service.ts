import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobsStaticTextService {
  constructor() {}

  get jobsTitle() {
    return $localize`Jobs`;
  }

  get notAvailableTekst() {
    return $localize`N/A`;
  }

  get noRecordsFound() {
    return $localize`No records found. You may need to adjust your search or filter parameters.`;
  }

  get noData() {
    return $localize`No Jobs have been added yet.`;
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

  get placeholderSearch() {
    return $localize`Search`;
  }

  get messageSchedulerJobStarted() {
    return $localize`Scheduler job started!`;
  }

  get messageJobStopped() {
    return $localize`Job stoped!`;
  }

  get messageJobCanceled() {
    return $localize`Job canceled!`;
  }

  get messageServerError() {
    return $localize`Server error!`;
  }
}

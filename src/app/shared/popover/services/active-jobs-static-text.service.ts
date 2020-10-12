import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobsStaticTextService {
  constructor() {}

  get notAvailableTekst() {
    return $localize`N/A`;
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

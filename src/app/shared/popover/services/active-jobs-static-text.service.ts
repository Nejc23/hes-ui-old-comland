import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobsStaticTextService {
  constructor() {}

  get notAvailableTekst() {
    return `N/A`;
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

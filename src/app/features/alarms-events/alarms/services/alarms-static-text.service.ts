import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlarmsStaticTextService {
  get notAvailableTekst() {
    return $localize`N/A`;
  }

  get noData() {
    return $localize`No Alarms have been added yet.`;
  }

  get noRecordsFound() {
    return $localize`No records found. You may need to adjust your date range.`;
  }

  get loadingData() {
    return $localize`Loading data...`;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlarmsStaticTextService {
  get notAvailableTekst() {
    return `N/A`;
  }

  get noData() {
    return `No Alarms have been added yet.`;
  }

  get noRecordsFound() {
    return `No records found. You may need to adjust your date range.`;
  }

  get loadingData() {
    return `Loading data...`;
  }
}

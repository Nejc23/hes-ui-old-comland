import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grid-cell-threshold',
  templateUrl: './grid-cell-threshold.component.html'
})
export class GridCellThresholdComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst;
  notSetText = this.statictextService.notSetText;
  isNotSet = false;
  public params: any;
  oldReadingDate = false;
  readOnText = $localize`Read on`;
  preconfiguredThreshold = environment.thresholdValue;
  thresholdValue = this.notAvailableText;

  constructor(private statictextService: MeterUnitsTypeStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
    this.checkDate();
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    if (this.params.value && !this.params.value.contains('not')) {
      this.thresholdValue = this.params.value.value + ' ' + this.params.value.unit;
      this.isNotSet = false;
    } else {
      this.thresholdValue = this.notSetText;
      this.isNotSet = true;
    }
    return true;
  }

  checkDate() {
    //TODO CHECK DATE FORMAT WITH BE
    if (
      this.params.value?.timestamp &&
      moment(this.params.value.timestamp, 'YYYY-MM-DD hh:mm:ss') < moment().subtract(this.preconfiguredThreshold, 'day')
    ) {
      this.oldReadingDate = true;
    }
  }
}

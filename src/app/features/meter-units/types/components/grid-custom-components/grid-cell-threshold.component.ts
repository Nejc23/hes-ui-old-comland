import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { dateServerFormat } from '../../../../../shared/forms/consts/date-format';

@Component({
  selector: 'app-grid-cell-threshold',
  templateUrl: './grid-cell-threshold.component.html'
})
export class GridCellThresholdComponent implements ICellRendererAngularComp {
  notAvailableText = this.staticTextService.notAvailableTekst;
  notSetText = this.staticTextService.notSetText;
  public params: any;
  oldReadingDate = false;
  readOnText = $localize`Read on`;
  preconfiguredThreshold = environment.thresholdValue;
  thresholdValue = this.notAvailableText;

  constructor(private staticTextService: MeterUnitsTypeStaticTextService) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.checkDate();
  }

  isValueSet(): boolean {
    if (this.params?.value?.value !== undefined) {
      if (!this.params.value.value.toLocaleLowerCase().includes('not')) {
        this.thresholdValue = this.params.value.value + ' ' + this.params.value.unit;
        return false;
      } else {
        this.thresholdValue = this.notSetText;
        return true;
      }
    }
    return false;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    this.checkDate();
    return true;
  }

  checkDate() {
    if (
      this.params.value?.timestamp &&
      moment(this.params.value.timestamp, dateServerFormat) < moment().subtract(this.preconfiguredThreshold, 'day')
    ) {
      this.oldReadingDate = true;
    }
  }
}

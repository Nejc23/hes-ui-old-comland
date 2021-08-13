import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { dateServerFormat } from '../../../../../shared/forms/consts/date-format';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-cell-threshold',
  templateUrl: './grid-cell-threshold.component.html'
})
export class GridCellThresholdComponent implements ICellRendererAngularComp {
  notAvailableText = this.staticTextService.notAvailableTekst;
  notSetText = this.staticTextService.notSetText;
  public params: any;
  readOnText = this.translate.instant('COMMON.READ-ON');
  preconfiguredThreshold = environment.thresholdValue;
  thresholdValue = this.notAvailableText;

  constructor(private staticTextService: MeterUnitsTypeStaticTextService, private translate: TranslateService) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.checkDate();
  }

  isValueSet(): boolean {
    if (this.params?.value?.value !== undefined) {
      if (!this.params.value.value.toLocaleLowerCase().includes('not')) {
        if (!isNaN(Number(this.params.value.value))) {
          var numberValue = Number(this.params.value.value);
          this.thresholdValue = numberValue.toString() + ' ' + this.params.value.unit;
        } else {
          this.thresholdValue = this.params.value.value + ' ' + this.params.value.unit;
        }

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
    return (
      this.params.value?.timestamp &&
      moment(this.params.value.timestamp, dateServerFormat) < moment().subtract(this.preconfiguredThreshold, 'day')
    );
  }
}

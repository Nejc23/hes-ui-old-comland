import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';
import { readStatusTrashold } from 'src/app/features/data-concentrator-units/consts/data-concentrator-units.consts';

@Component({
  selector: 'app-grid-cell-read-status',
  templateUrl: './grid-cell-read-status.component.html'
})
export class GridCellReadStatusComponent implements ICellRendererAngularComp {
  trasholds = readStatusTrashold;

  public params: any;

  constructor(private staticextService: MeterUnitsTypeStaticTextService, private i18n: I18n) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  // set tooltip text
  setToolTip(value: string) {
    return value + ' %';
  }
}

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';

@Component({
  selector: 'app-grid-cell-icon',
  templateUrl: './grid-cell-icon.component.html'
})
export class GridCellIconComponent implements ICellRendererAngularComp {
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

  // set momemnt text (next planned read) out of date and time
  setMomentNextPlannedReadTime(time: string) {
    return this.staticextService.nextPlannedReadText + this.i18n(moment(time).fromNow());
  }
}

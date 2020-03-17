import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { DataConcentratorUnitsStaticTextService } from '../../services/data-concentrator-units-static-text.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';
import { readStatusTrashold } from '../../consts/data-concentrator-units.consts';

@Component({
  selector: 'app-grid-cell-read-status',
  templateUrl: './grid-cell-read-status.component.html'
})
export class GridCellReadStatusComponent implements ICellRendererAngularComp {
  trasholds = readStatusTrashold;

  public params: any;

  constructor(private staticextService: DataConcentratorUnitsStaticTextService, private i18n: I18n) {}
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
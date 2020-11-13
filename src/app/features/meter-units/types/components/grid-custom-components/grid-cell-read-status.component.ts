import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import * as moment from 'moment';
import { readStatusColor } from '../../consts/meter-units.consts';
import { DataConcentratorUnitsStaticTextService } from 'src/app/features/data-concentrator-units/services/data-concentrator-units-static-text.service';

@Component({
  selector: 'app-grid-cell-read-status',
  templateUrl: './grid-cell-read-status.component.html'
})
export class GridCellReadStatusComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A

  trasholds = readStatusColor;

  public params: any;

  constructor(private statictextService: DataConcentratorUnitsStaticTextService) {}
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
    return moment(value).format('L') + ' ' + moment(value).format('LTS');
  }

  // set momemnt text (next planned read) out of date and time
  setMomentStatusDate(value: string) {
    return moment(value).format('L');
  }
}

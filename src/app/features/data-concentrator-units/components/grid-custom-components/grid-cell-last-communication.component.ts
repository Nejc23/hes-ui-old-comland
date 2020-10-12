import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { DataConcentratorUnitsStaticTextService } from '../../services/data-concentrator-units-static-text.service';
import * as moment from 'moment';

@Component({
  selector: 'app-grid-cell-last-communication',
  templateUrl: './grid-cell-last-communication.component.html'
})
export class GridCellLastCommunicationComponent implements ICellRendererAngularComp {
  notAvailableText = this.staticextService.notAvailableTekst; // N/A
  public params: any;

  constructor(private staticextService: DataConcentratorUnitsStaticTextService) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  // set momemnt text (last communication) out of date and time
  setMomentLastCommunicationTime(time: string) {
    return $localize `${moment(time).fromNow()}`;
  }
}

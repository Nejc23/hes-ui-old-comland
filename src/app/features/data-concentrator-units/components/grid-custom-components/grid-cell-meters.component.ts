import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { DataConcentratorUnitsStaticTextService } from '../../services/data-concentrator-units-static-text.service';

@Component({
  selector: 'app-grid-cell-meters',
  templateUrl: './grid-cell-meters.component.html'
})
export class GridCellMetersComponent implements ICellRendererAngularComp {
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

  // set tooltip text
  setToolTip(data: any) {
    const arrow = data.metersUp ? '\u2191' : '\u2193';
    if (data.metersPercent == null) {
      return data.meters + ' m   ' + arrow + ' ' + this.notAvailableText + ' %';
    }
    return data.meters + ' m   ' + arrow + ' ' + data.metersPercent + ' %';
  }
}

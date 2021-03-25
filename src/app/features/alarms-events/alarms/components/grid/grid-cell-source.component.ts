import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { AlarmsStaticTextService } from '../../services/alarms-static-text.service';

@Component({
  selector: 'app-grid-cell-source',
  templateUrl: './grid-cell-source.component.html'
})
export class GridCellSourceComponent implements ICellRendererAngularComp {
  public params: any;

  notAvailableText = this.statictextService.notAvailableTekst; // N/A

  constructor(private statictextService: AlarmsStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { AlarmsStaticTextService } from '../../services/alarms-static-text.service';

@Component({
  selector: 'app-grid-cell-severity',
  templateUrl: './grid-cell-severity.component.html'
})
export class GridCellSeverityComponent implements ICellRendererAngularComp {
  public params: any;

  notAvailableText = this.statictextService.notAvailableTekst; // N/A

  class = '';

  constructor(private statictextService: AlarmsStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;

    this.class = '';

    switch (this.params?.data?.severityId) {
      case 0: {
        this.class = 'text-danger';
        break;
      }
      case 1: {
        this.class = 'text-warning';
        break;
      }
      case 2: {
        this.class = 'text-info';
        break;
      }
    }
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}

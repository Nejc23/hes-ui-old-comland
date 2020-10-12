import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { DataConcentratorUnitsStaticTextService } from '../../services/data-concentrator-units-static-text.service';

@Component({
  selector: 'app-grid-cell-type',
  templateUrl: './grid-cell-type.component.html'
})
export class GridCellTypeComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
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
}

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { DataConcentratorUnitsStaticTextService } from '../../services/data-concentrator-units-static-text.service';

@Component({
  selector: 'app-grid-cell-tags',
  templateUrl: './grid-cell-tags.component.html'
})
export class GridCellTagsComponent implements ICellRendererAngularComp {
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
}

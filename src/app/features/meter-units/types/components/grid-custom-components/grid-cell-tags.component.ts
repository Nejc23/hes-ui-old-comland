import { MeterUnitsTypeStaticTextService } from './../../services/meter-units-type-static-text.service';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-grid-cell-tags',
  templateUrl: './grid-cell-tags.component.html'
})
export class GridCellTagsComponent implements ICellRendererAngularComp {
  notAvailableText = this.staticextService.notAvailableTekst; // N/A
  public params: any;

  constructor(private staticextService: MeterUnitsTypeStaticTextService) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  isValueValidArray(params: any): boolean {
    return params.value && params instanceof Array;
  }
}

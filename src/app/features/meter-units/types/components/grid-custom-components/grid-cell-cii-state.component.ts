import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';

@Component({
  selector: 'app-grid-cell-cii-state',
  templateUrl: './grid-cell-cii-state.component.html'
})
export class GridCellCiiStateComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
  public params: any;
  public valueClass: any;

  constructor(private statictextService: MeterUnitsTypeStaticTextService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;

    let value = params?.value as string;
    if (value) {
      value = value.toLowerCase();
      this.valueClass = {
        'badge-success': value === 'on',
        'badge-dark': value === 'off'
      };
    }
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}

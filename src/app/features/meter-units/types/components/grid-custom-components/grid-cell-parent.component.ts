import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-cell-parent',
  templateUrl: './grid-cell-parent.component.html'
})
export class GridCellParentComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
  public params: any;

  constructor(private statictextService: MeterUnitsTypeStaticTextService, private router: Router) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  openDcuDetails() {
    this.router.navigate([`/dataConcentratorUnits/${this.params.data.concentratorId}`]);
  }
}

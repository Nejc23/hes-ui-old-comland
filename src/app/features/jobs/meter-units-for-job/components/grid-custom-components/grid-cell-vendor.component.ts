import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { AllForJobStaticTextService } from '../../services/meter-units-for-job-static-text.service';

@Component({
  // selector: 'app-grid-cell-vendor',
  templateUrl: './grid-cell-vendor.component.html'
})
export class AllForJobGridCellVendorComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
  public params: any;

  constructor(private statictextService: AllForJobStaticTextService) {}
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

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { AllForJobStaticTextService } from '../../services/meter-units-for-job-static-text.service';

@Component({
  // selector: 'app-meter-units-grid-cell-id-number',
  templateUrl: './grid-cell-id-number.component.html'
})
export class AllForJobGridCellIdNumberComponent implements ICellRendererAngularComp {
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

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DcuForJobStaticTextService } from '../../services/dcu-for-job-static-text.service';

@Component({
  // selector: 'app-meter-units-grid-cell-id-number',
  templateUrl: './grid-cell-id-number.component.html'
})
export class DcuForJobGridCellIdNumberComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
  public params: any;

  constructor(private statictextService: DcuForJobStaticTextService, private i18n: I18n) {}
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

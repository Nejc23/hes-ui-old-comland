import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';
import { jobStatus } from '../../consts/meter-units.consts';

@Component({
  selector: 'app-grid-cell-job-status',
  templateUrl: './grid-cell-job-status.component.html'
})
export class GridCellJobStatusComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
  public params: any;
  jobStatus = jobStatus;

  constructor(private statictextService: MeterUnitsTypeStaticTextService, private i18n: I18n) {}
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
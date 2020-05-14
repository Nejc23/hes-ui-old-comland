import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { ActiveJobsStaticTextService } from '../../services/active-jobs-static-text.service';

@Component({
  selector: 'app-grid-cell-active-job-status',
  templateUrl: './grid-cell-active-job-status.component.html'
})
export class GridCellActiveJobStatusComponent implements ICellRendererAngularComp {
  notAvailableText = this.statictextService.notAvailableTekst; // N/A
  public params: any;

  constructor(private statictextService: ActiveJobsStaticTextService, private i18n: I18n) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  setToolTip(value: boolean) {
    return value ? this.i18n('Running job') : this.i18n('Pending job');
  }
}

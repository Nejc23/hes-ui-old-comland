import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-cell-active-read-only',
  templateUrl: './grid-cell-active-read-only.component.html'
})
export class GridCellActiveReadOnlyComponent implements ICellRendererAngularComp {
  @ViewChild('activeSwitch', { static: true }) activeSwitch;

  public params: any;
  messageDisabled = this.translate.instant('JOB.SCHEDULER-JOB-DISABLED');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');

  constructor(private translate: TranslateService) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  // set tooltip text
  setToolTip(value: boolean) {
    return value ? this.translate.instant('COMMON.ACTIVE') : this.translate.instant('COMMON.INACTIVE');
  }
}

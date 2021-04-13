import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

@Component({
  selector: 'app-grid-cell-active-read-only',
  templateUrl: './grid-cell-active-read-only.component.html'
})
export class GridCellActiveReadOnlyComponent implements ICellRendererAngularComp {
  @ViewChild('activeSwitch', { static: true }) activeSwitch;

  public params: any;
  messageEnabled = $localize`Scheduler job enabled!`;
  messageDisabled = $localize`Scheduler job disabled!`;
  messageServerError = $localize`Server error!`;

  constructor(private modalService: ModalService, private toast: ToastNotificationService, private service: JobsService) {}
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
    return value ? $localize`Active` : $localize`Inactive`;
  }
}

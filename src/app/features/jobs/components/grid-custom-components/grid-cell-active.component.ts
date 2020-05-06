import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

@Component({
  selector: 'app-grid-cell-active',
  templateUrl: './grid-cell-active.component.html'
})
export class GridCellActiveComponent implements ICellRendererAngularComp {
  public params: any;
  messageActionInProgress = this.i18n(`Action in progress!`);
  messageServerError = this.i18n(`Server error!`);

  constructor(
    private i18n: I18n,
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: MeterUnitsService
  ) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  valueChange(params: any, event: boolean) {
    // console.log(`valueChange event = ${event}`);
    // console.log(JSON.stringify(params.node.data));
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = event ? this.i18n('Enable') : this.i18n('Disable');
    response = event ? this.service.enableSchedulerJob(params.node.data.id) : this.service.disableSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = this.i18n('Confirm operation');
    component.modalBody = this.i18n('Do you want to change scheduled job status?');

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        response.subscribe(
          value => {
            this.toast.successToast(this.messageActionInProgress);
            this.refresh(this.params);
          },
          e => {
            this.toast.errorToast(this.messageServerError);
            this.params.data.active = !this.params.data.active;
            this.refresh(this.params);
          }
        );
      },
      reason => {
        // on dismiss (CLOSE)
        this.params.data.active = !event;
        console.log(`cancel = ${JSON.stringify(this.params.data)}`);
        this.refresh(this.params);
      }
    );
  }

  // set tooltip text
  setToolTip(value: boolean) {
    return value ? this.i18n('Active') : this.i18n('Inactive');
  }
}

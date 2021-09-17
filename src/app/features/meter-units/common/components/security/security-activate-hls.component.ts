import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { IActionRequestEnableHls } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';

@Component({
  templateUrl: './security-activate-hls.component.html'
})
export class SecurityActivateHlsComponent {
  public selectedRowsCount: number;
  disabled = false;

  actionRequest: IActionRequestParams;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private toast: ToastNotificationService,
    private formUtils: FormsUtilsService,
    private translate: TranslateService
  ) {}

  get securityClientProperty() {
    return 'securityClient';
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.securityClientProperty]: [null, [Validators.required]]
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }

  fillData(): IActionRequestEnableHls {
    const formData: IActionRequestEnableHls = {
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      includedIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds
    };

    return formData;
  }

  onConfirm() {
    this.disabled = true;
    const values = this.fillData();
    this.gridLinkService.postSecurityEnableHls(values);
    const successMessage = this.translate.instant('PLC-METER.METER-UNITS-ACTIVATE-HLS');

    this.gridLinkService.postSecurityEnableHls(values).subscribe(
      (success) => {
        this.toast.successToast(successMessage);
        this.onDismiss();
        this.disabled = false;
        const modalRef = this.modalService.open(StatusJobComponent, { size: 'md' });
        modalRef.componentInstance.requestId = success.requestId;
        modalRef.componentInstance.jobName = this.translate.instant('PLC-METER.SECURITY.ACTIVATE-HLS', {
          selectedRowsCount: this.selectedRowsCount
        });
      },
      (error) => {
        console.log(`Error on postSecurityEnableHls`, error);
      }
    );
  }
}

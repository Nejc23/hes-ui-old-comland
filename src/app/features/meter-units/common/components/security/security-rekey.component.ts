import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { FormsUtilsService } from '../../../../../core/forms/services/forms-utils.service';
import {
  IActionRequestParams,
  IActionRequestSecurityRekey
} from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { ToastNotificationService } from '../../../../../core/toast-notification/services/toast-notification.service';
import { Codelist } from '../../../../../shared/repository/interfaces/codelists/codelist.interface';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';

@Component({
  templateUrl: './security-rekey.component.html'
})
export class SecurityRekeyComponent {
  public selectedRowsCount: number;

  actionRequest: IActionRequestParams;

  form: FormGroup;
  keyTypes: Codelist<string>[];
  selectedKeyType: Codelist<string>;

  showSecondConfirm = false;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private toast: ToastNotificationService,
    private formUtils: FormsUtilsService,
    private translate: TranslateService,
    private modalService: ModalService
  ) {
    this.keyTypes = [
      { id: 'PSK', value: this.translate.instant('PLC-METER.SECURITY.PSK') },
      { id: 'GUEK', value: this.translate.instant('PLC-METER.SECURITY.GUEK') },
      { id: 'GAK_M2', value: this.translate.instant('PLC-METER.SECURITY.GAK-M2') },
      { id: 'GUEK_M2', value: this.translate.instant('PLC-METER.SECURITY.GUEK-M2') },
      { id: 'AK_DATA_COLLECTOR', value: this.translate.instant('PLC-METER.SECURITY.AK-DATA-COLLECTOR') },
      { id: 'UEK_DATA_COLLECTOR', value: this.translate.instant('PLC-METER.SECURITY.UEK-DATA-COLLECTOR') },
      { id: 'AK_INSTALLER', value: this.translate.instant('PLC-METER.SECURITY.AK-INSTALLER') },
      { id: 'UEK_INSTALLER', value: this.translate.instant('PLC-METER.SECURITY.UEK-INSTALLER') }
    ];
    this.selectedKeyType = this.keyTypes[0];
    this.form = this.createForm();
  }

  get keyTypeProperty() {
    return 'keyType';
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.keyTypeProperty]: [this.selectedKeyType, [Validators.required]]
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }

  fillData(): IActionRequestSecurityRekey {
    const formData: IActionRequestSecurityRekey = {
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      includedIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds,
      keyType: this.selectedKeyType.id
    };

    return formData;
  }

  keyTypeChanged(value: Codelist<string>) {
    this.selectedKeyType = value;
  }

  onConfirm() {
    if (!this.showSecondConfirm) {
      this.form.get(this.keyTypeProperty).markAsDirty();
      if (this.form.valid) {
        this.showSecondConfirm = true;
      }
    } else {
      const values = this.fillData();
      const request = this.gridLinkService.postSecurityRekey(values);
      const successMessage = this.translate.instant('PLC-METER.METER-UNITS-RE-KEYING');
      this.formUtils.saveForm(this.form, request, successMessage).subscribe(
        (result) => {
          this.modal.close();

          const modalRef = this.modalService.open(StatusJobComponent, { size: 'md' });
          modalRef.componentInstance.requestId = result.requestId;
          modalRef.componentInstance.deviceCount = this.selectedRowsCount;
          modalRef.componentInstance.jobName = this.translate.instant('PLC-METER.SECURITY.RE-KEY-METER', {
            selectedRowsCount: this.selectedRowsCount
          });
        },
        () => {} // error
      );
    }
  }
}

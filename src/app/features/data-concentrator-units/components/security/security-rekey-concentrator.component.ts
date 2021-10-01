import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { FormsUtilsService } from '../../../../core/forms/services/forms-utils.service';
import {
  IActionRequestParams,
  IActionRequestSecurityRekey
} from '../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { Codelist } from '../../../../shared/repository/interfaces/codelists/codelist.interface';
import { MeterUnitsTypeGridService } from '../../../meter-units/types/services/meter-units-type-grid.service';
import { ModalService } from '../../../../core/modals/services/modal.service';
import { StatusJobComponent } from '../../../jobs/components/status-job/status-job.component';

@Component({
  templateUrl: './security-rekey-concentrator.component.html'
})
export class SecurityRekeyConcentratorComponent {
  public selectedRowsCount: number;
  public alertText: string;
  actionRequest: IActionRequestParams;

  form: FormGroup;
  keyTypes: Codelist<string>[];
  selectedValues: Array<any>;

  showSecondConfirm = false;
  public value: any = [];

  keyTypesArray: Array<any> = [
    { id: 'GAK', value: this.translate.instant('DCU.SECURITY-GAK') },
    { id: 'GBEK', value: this.translate.instant('DCU.SECURITY-GBEK') }
  ];

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
    this.form = this.formBuilder.group({});
  }

  onDismiss() {
    this.modal.dismiss();
    console.log(this.actionRequest);
  }

  fillData(): IActionRequestSecurityRekey {
    const formData: IActionRequestSecurityRekey = {
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      concentratorIds: this.actionRequest.concentratorIds,
      keyTypes: [...this.selectedValues.map((value) => value.id)]
    };

    return formData;
  }

  onConfirm() {
    if (!this.showSecondConfirm) {
      if (this.selectedValues) {
        this.showSecondConfirm = true;
      }
    } else {
      const values = this.fillData();
      const request = this.gridLinkService.postSecurityConcentratorRekey(values);
      this.formUtils.saveForm(this.form, request, '').subscribe(
        (result) => {
          this.modal.close();

          const modalRef = this.modalService.open(StatusJobComponent, { size: 'md' });
          modalRef.componentInstance.requestId = result.requestId;
          modalRef.componentInstance.deviceCount = this.selectedRowsCount;
          modalRef.componentInstance.jobName = this.translate.instant('DCU.RE-KEY-CONCENTRATOR', {
            selectedRowsCount: this.selectedRowsCount
          });
        },
        () => {}
      );
    }
  }
}

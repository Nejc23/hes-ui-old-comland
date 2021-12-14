import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class SecurityRekeyConcentratorComponent implements OnInit {
  public selectedRowsCount: number;
  public alertText: string;
  public alertHmacText: string;
  public isHmacOnly = false;
  actionRequest: IActionRequestParams;

  form: FormGroup;
  keyTypes: Codelist<string>[];

  showSecondConfirm = false;
  public value: any = [];

  keyTypesArray: Array<any> = [
    { id: 'Authentication', value: this.translate.instant('DCU.SECURITY-GAK'), apiId: 'GAK' },
    { id: 'Broadcast', value: this.translate.instant('DCU.SECURITY-GBEK'), apiId: 'GBEK' },
    { id: 'Authentication and Broadcast', value: this.translate.instant('DCU.SECURITY-GAK-GBEK'), apiId: 'GAK_GBEK' },
    { id: 'HMAC', value: this.translate.instant('DCU.SECURITY-HMAC'), apiId: 'HMAC' }
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
  ) {}
  ngOnInit() {
    if (this.isHmacOnly) {
      this.keyTypesArray = [{ id: 'HMAC', value: this.translate.instant('DCU.SECURITY-HMAC'), apiId: 'HMAC' }];
    }

    this.form = this.formBuilder.group({
      keyType: [this.keyTypesArray[0], Validators.required]
    });
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
      keyType: this.form.get('keyType').value.apiId
    };

    return formData;
  }

  onConfirm() {
    if (!this.showSecondConfirm) {
      this.showSecondConfirm = true;
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

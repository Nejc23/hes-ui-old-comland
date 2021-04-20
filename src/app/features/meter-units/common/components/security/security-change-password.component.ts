import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { FormsUtilsService } from './../../../../../core/forms/services/forms-utils.service';
import { ToastNotificationService } from './../../../../../core/toast-notification/services/toast-notification.service';
import { Codelist } from './../../../../../shared/repository/interfaces/codelists/codelist.interface';
import {
  IActionRequestParams,
  IActionRequestSecurityChangePassword
} from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';

@Component({
  templateUrl: './security-change-password.component.html'
})
export class SecurityChangePasswordComponent implements OnInit {
  public selectedRowsCount: number;

  actionRequest: IActionRequestParams;

  form: FormGroup;
  passwordTypes: Codelist<string>[];
  selectedPasswordType: Codelist<string>;

  showSecondConfirm = false;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private toast: ToastNotificationService,
    private formUtils: FormsUtilsService
  ) {
    this.passwordTypes = [
      { id: 'PW_LG', value: 'PW_LG (Management)' },
      { id: 'PW_M2', value: 'PW_M2 (Operator)' },
      { id: 'PW_L1', value: 'PW_L1 (Reader)' },
      { id: 'PW_L2', value: 'PW_L2 (Installer)' },
      { id: 'PW_CALIBRATION', value: 'PW_CALIBRATION (Verification)' }
    ];
    this.selectedPasswordType = this.passwordTypes[0];
    this.form = this.createForm();
  }

  ngOnInit() {}

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.passwordTypeProperty]: [this.selectedPasswordType, [Validators.required]]
    });
  }

  get passwordTypeProperty() {
    return 'passwordType';
  }

  onDismiss() {
    this.modal.dismiss();
  }

  fillData(): IActionRequestSecurityChangePassword {
    const formData: IActionRequestSecurityChangePassword = {
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      includedIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds,
      passwordType: this.selectedPasswordType.id
    };

    return formData;
  }

  passwordTypeChanged(value: Codelist<string>) {
    debugger;
    this.selectedPasswordType = value;
  }

  onConfirm() {
    if (!this.showSecondConfirm) {
      this.form.get(this.passwordTypeProperty).markAsDirty();
      if (this.form.valid) {
        this.showSecondConfirm = true;
      }
    } else {
      const values = this.fillData();
      const request = this.gridLinkService.postSecurityChangePassword(values);
      const successMessage = $localize`Meter Units password type change was successful`;
      this.formUtils.saveForm(this.form, request, successMessage).subscribe((result) => {
        this.modal.close();
      });
    }
  }
}

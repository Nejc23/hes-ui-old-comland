import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { FormsUtilsService } from './../../../../../core/forms/services/forms-utils.service';
import { ToastNotificationService } from './../../../../../core/toast-notification/services/toast-notification.service';
import { Codelist } from './../../../../../shared/repository/interfaces/codelists/codelist.interface';
import {
  IActionRequestParams,
  IActionRequestSecurityRekey
} from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';
import { TemplatesService } from 'src/app/core/repository/services/templates/templates.service';

@Component({
  templateUrl: './security-rekey.component.html'
})
export class SecurityRekeyComponent implements OnInit {
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
    private formUtils: FormsUtilsService
  ) {
    this.keyTypes = [
      { id: 'GUEK', value: 'GUEK' },
      { id: 'GAK', value: 'GAK' },
      { id: 'GBEK', value: 'GBEK' },
      { id: 'PSK', value: 'PSK' },
      { id: 'UEK_LOCAL', value: 'UEK_LOCAL' },
      { id: 'UEK_ADMIN', value: 'UEK_ADMIN' },
      { id: 'UEK_CIP', value: 'UEK_CIP' },
      { id: 'AK_CIP', value: 'AK_CIP' },
      { id: 'AK_LOCAL', value: 'AK_LOCAL' },
      { id: 'AK_ADMIN', value: 'AK_ADMIN' },
      { id: 'UEK_PREESTABLISHED', value: 'UEK_PREESTABLISHED' },
      { id: 'AK_PREESTABLISHED', value: 'AK_PREESTABLISHED' },
      { id: 'UEK_USER_ADMIN', value: 'UEK_USER_ADMIN' },
      { id: 'AK_USER_ADMIN', value: 'AK_USER_ADMIN' },
      { id: 'UEK_DATA_COLLECTOR', value: 'UEK_DATA_COLLECTOR' },
      { id: 'AK_DATA_COLLECTOR', value: 'AK_DATA_COLLECTOR' },
      { id: 'UEK_SECURITY_ADMIN', value: 'UEK_SECURITY_ADMIN' },
      { id: 'AK_SECURITY_ADMIN', value: 'AK_SECURITY_ADMIN' },
      { id: 'UEK_CALIBRATION', value: 'UEK_CALIBRATION' },
      { id: 'AK_CALIBRATION', value: 'AK_CALIBRATION' },
      { id: 'UEK_MAINTENANCE', value: 'UEK_MAINTENANCE' },
      { id: 'AK_MAINTENANCE', value: 'AK_MAINTENANCE' },
      { id: 'UEK_INSTALLER', value: 'UEK_INSTALLER' },
      { id: 'AK_INSTALLER', value: 'AK_INSTALLER' },
      { id: 'UEK_SECURITY_AUDITOR', value: 'UEK_SECURITY_AUDITOR' },
      { id: 'AK_SECURITY_AUDITOR', value: 'AK_SECURITY_AUDITOR' },
      { id: 'GUEK_M2', value: 'GUEK_M2' },
      { id: 'GAK_M2', value: 'GAK_M2' },
      { id: 'GUEK_M3', value: 'GUEK_M3' },
      { id: 'GAK_M3', value: 'GAK_M3' },
      { id: 'GUEK_M4', value: 'GUEK_M4' },
      { id: 'GAK_M4', value: 'GAK_M4' },
      { id: 'GUEK_M5', value: 'GUEK_M5' },
      { id: 'GAK_M5', value: 'GAK_M5' }
    ];
    this.selectedKeyType = this.keyTypes[0];
    this.form = this.createForm();
  }

  ngOnInit() {
    // this.templatesService.getKeyTypes().subscribe((value) => {
    //   this.keyTypes = value.keyTypes.map((k) => {
    //     return { id: k, value: k };
    //   }); // console.log('securityClients', values);
    // });
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.keyTypeProperty]: [this.selectedKeyType, [Validators.required]]
    });
  }

  get keyTypeProperty() {
    return 'keyType';
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
      const successMessage = $localize`Meter Units re-keying was successful`;
      this.formUtils.saveForm(this.form, request, successMessage).subscribe(
        (result) => {
          this.modal.close();
        },
        () => {} // error
      );
    }
  }
}

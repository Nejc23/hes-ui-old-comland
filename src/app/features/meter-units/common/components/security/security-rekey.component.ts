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
      { id: 'PSK', value: 'PSK' },
      { id: 'GAK', value: 'GAK (Management)' },
      { id: 'GUEK', value: 'GUEK (Management)' },
      { id: 'GBEK', value: 'GBEK (Management)' },
      { id: 'GAK_M2', value: 'GAK_M2 (Operator)' },
      { id: 'GUEK_M2', value: 'GUEK_M2 (Operator)' },
      { id: 'AK_DATA_COLLECTOR', value: 'AK_DATA_COLLECTOR (Reader)' },
      { id: 'UEK_DATA_COLLECTOR', value: 'UEK_DATA_COLLECTOR (Reader)' },
      { id: 'AK_INSTALLER', value: 'AK_INSTALLER (Installer)' },
      { id: 'UEK_INSTALLER', value: 'UEK_INSTALLER (Installer)' }
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

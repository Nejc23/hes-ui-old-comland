import { IActionRequestEnableHls } from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Component({
  templateUrl: './security-activate-hls.component.html'
})
export class SecurityActivateHlsComponent implements OnInit {
  // deviceIdsParam = [];
  // filterParam?: GridFilterParams;
  // searchParam?: GridSearchParams[];
  // excludeIdsParam?: string[];
  public selectedRowsCount: number;

  actionRequest: IActionRequestParams;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private toast: ToastNotificationService,
    private formUtils: FormsUtilsService
  ) {}

  ngOnInit() {}

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.securityClientProperty]: [null, [Validators.required]]
    });
  }

  get securityClientProperty() {
    return 'securityClient';
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
    const values = this.fillData();
    const request = this.gridLinkService.postSecurityEnableHls(values);
    const successMessage = $localize`Meter Units activate hls successfull`;

    this.gridLinkService.postSecurityEnableHls(values).subscribe(
      (sucess) => {
        this.toast.successToast(successMessage);
      },
      (error) => {
        console.log($localize`Error on postSecurityEnableHls`, error);
      }
    );
  }
}

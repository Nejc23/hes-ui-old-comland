import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { DataConcentratorUnitsGridService } from '../../services/data-concentrator-units-grid.service';

@Component({
  selector: 'app-dcu-fw-upgrade',
  templateUrl: './dcu-fw-upgrade.component.html'
})
export class DcuFwUpgradeComponent {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  form: FormGroup;
  noConfig = false;
  actionRequest: IActionRequestParams;
  allowedExt = ['bin'];
  acceptExtensions = ['.bin'];
  public file: File;
  activate = false;

  public selectedRowsCount: number;
  uploadDropSubtitle = this.translate.instant('DCU.FILE-BIN-FORMAT');

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private dcuOperatrionService: DataConcentratorUnitsOperationsService,
    private toast: ToastNotificationService,
    private dcuGridService: DataConcentratorUnitsGridService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.imageProperty]: [this.file, Validators.required],
      [this.imageGuidProperty]: ['']
    });
  }

  // fillData(): IActionRequestDcuFwUpgradeData {
  //   const formData: IActionRequestDcuFwUpgradeData = {
  //     image: this.file,
  //     pageSize: this.actionRequest.pageSize,
  //     pageNumber: this.actionRequest.pageNumber,
  //     sort: this.actionRequest.sort,
  //     textSearch: this.actionRequest.textSearch,
  //     filter: this.actionRequest.filter,
  //     concentratorIds: this.actionRequest.deviceIds,
  //     excludeIds: this.actionRequest.excludeIds
  //   };
  //   return formData;
  // }

  resetAll() {
    this.form.reset();
    this.touConfigSelect.deselectAllRows();
  }

  upgrade() {
    const formData = new FormData();

    if (this.actionRequest && this.actionRequest.concentratorIds && this.actionRequest.concentratorIds.length > 0) {
      for (const concentratorId of this.actionRequest.concentratorIds) {
        formData.append('concentratorIds', concentratorId);
      }
    }

    if (this.file) {
      formData.append('image', this.file, this.file?.name);
    }

    const request = this.dcuOperatrionService.postDcFwUpgrade(formData);
    const successMessage = this.translate.instant('DCU.FW-UPGRADE-PROGRESS');
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        if (result && result.length > 0) {
          this.dcuGridService.saveDcOperationRequestId(result);
        }
        this.modal.close();
      },
      (error) => {
        console.log('upgrade error', error);
      } // error
    );
  }

  activateMU() {
    this.toast.infoToast(' ');
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  // properties - START
  get imageGuidProperty() {
    return 'imageGuid';
  }
  get imageProperty() {
    return 'file';
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  public selected(event: any): void {
    event.files.forEach((file: FileInfo) => {
      if (file.rawFile) {
        this.file = file.rawFile;
      }
    });
  }
}

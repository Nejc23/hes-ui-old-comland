import { MeterUnitsTypeGridService } from './../../../types/services/meter-units-type-grid.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { FileGuid, MeterUnitsFwUpgrade } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';
import { PlcMeterReadScheduleGridService } from '../../services/plc-meter-read-schedule-grid.service';
import { fwUploadFile, meterUnits, fwRemoveFile } from 'src/app/core/repository/consts/meter-units.const';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';

@Component({
  selector: 'app-plc-meter-fw-upgrade',
  templateUrl: './plc-meter-fw-upgrade.component.html'
})
export class PlcMeterFwUpgradeComponent implements OnInit {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  form: FormGroup;
  noConfig = false;
  configRequiredText = this.i18n('Required field');
  messageServerError = this.i18n(`Server error!`);
  deviceIdsParam = [];
  uploadSaveUrl = `${fwUploadFile}`;
  imgGuid: FileGuid = null;
  allowedExt = [];
  allowedExtExplainText = 'can only upload one file.';
  public files: Array<any>;
  activate = false;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private plcMeterReadScheduleGridService: PlcMeterReadScheduleGridService,
    private myGridService: MyGridLinkService,
    private toast: ToastNotificationService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.imageProperty]: [this.files, Validators.required],
      [this.imageIdenifyerProperty]: [null, Validators.required],
      [this.imageSizeProperty]: [null, [Validators.required, Validators.maxLength(6)]],
      [this.imageSignatureProperty]: [null, Validators.required],
      [this.imageFillLastBlockProperty]: [false, Validators.required],
      [this.imageGuidProperty]: ['']
    });
  }

  ngOnInit() {}

  fillData(): MeterUnitsFwUpgrade {
    const formData: MeterUnitsFwUpgrade = {
      //  files: this.form.get(this.imageProperty).value,
      imageIdent: this.form.get(this.imageIdenifyerProperty).value,
      fileId: this.form.get(this.imageGuidProperty).value,
      imageSize: parseInt(this.form.get(this.imageSizeProperty).value, 10),
      signature: this.form.get(this.imageSignatureProperty).value,
      overrideFillLastBlock: this.form.get(this.imageFillLastBlockProperty).value,
      // bulkActionsRequestParam: this.plcMeterReadScheduleGridService.getSelectedRowsOrFilters() // todo for filters
      deviceIds: this.plcMeterReadScheduleGridService.getSelectedRowsOrFilters().id.filter(Boolean)
    };
    return formData;
  }

  resetAll() {
    this.form.reset();
    this.touConfigSelect.deselectAllRows();
  }

  upgrade() {
    if (this.imgGuid != null && this.imgGuid.imageGuid && this.imgGuid.imageGuid.length > 0) {
      this.form.get(this.imageGuidProperty).setValue(this.imgGuid.imageGuid);
    } else if (this.imgGuid) {
      this.form.get(this.imageGuidProperty).setValue(this.imgGuid);
    }

    const values = this.fillData();
    const request = this.myGridService.createFwUpgrade(values);
    const successMessage = this.i18n(`Meter Units upload Edited was successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        if (result && result.requestId.length > 0) {
          this.meterUnitsTypeGridService.saveMyGridLinkRequestId(result.requestId);
        }
        this.modal.close();
        /*this.toast.infoToast(result.status);
          if (result.status.includes('waiting for activiation')) {
            this.activate = true;
          }
        }*/
      },
      () => {} // error
    );
  }

  activateMU() {
    this.toast.infoToast('// TODO ');
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  successUploaded(event) {
    this.imgGuid = event.response.body;
  }

  // properties - START
  get imageGuidProperty() {
    return 'imageGuid';
  }
  get imageProperty() {
    return 'files';
  }

  get imageIdenifyerProperty() {
    return 'imageIdentifyer';
  }

  get imageSizeProperty() {
    return 'imageSize';
  }

  get imageSignatureProperty() {
    return 'imageSignature';
  }

  get imageFillLastBlockProperty() {
    return 'imageFillLastBlock';
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }
}
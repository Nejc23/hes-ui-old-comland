import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { RequestTOUData } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { MeterUnitsTypeGridService } from '../../types/services/meter-units-type-grid.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsFwUpgradeForm, FileGuid } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';
import { PlcMeterReadScheduleGridService } from '../../services/plc-meter-read-schedule-grid.service';
import { PlcMeterReadScheduleService } from '../../services/plc-meter-read-scheduler.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { fwUploadFile, meterUnits, fwRemoveFile } from 'src/app/core/repository/consts/meter-units.const';

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
  uploadSaveUrl = `${meterUnits}/${fwUploadFile}`;
  uploadRemoveUrl = `${meterUnits}/${fwRemoveFile}`;
  imgGuid: FileGuid = null;
  allowedExt = ['gif', 'jpg', 'jpeg', 'png'];
  public files: Array<any>;
  activate = false;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private plcMeterReadScheduleGridService: PlcMeterReadScheduleGridService,
    private meterService: MeterUnitsService,
    private authService: AuthService,
    private toast: ToastNotificationService
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

  fillData(): MeterUnitsFwUpgradeForm {
    const formData: MeterUnitsFwUpgradeForm = {
      files: this.form.get(this.imageProperty).value,
      imageIdenifyer: this.form.get(this.imageIdenifyerProperty).value,
      imageGuid: this.form.get(this.imageGuidProperty).value,
      imageSize: parseInt(this.form.get(this.imageSizeProperty).value, 10),
      imageSignature: this.form.get(this.imageSignatureProperty).value,
      imageFillLastBlock: this.form.get(this.imageFillLastBlockProperty).value,
      bulkActionsRequestParam: this.plcMeterReadScheduleGridService.getSelectedRowsOrFilters()
    };
    console.log(formData);
    return formData;
  }

  resetAll() {
    this.form.reset();
    this.touConfigSelect.deselectAllRows();
  }

  upgrade() {
    if (this.imgGuid != null && this.imgGuid.imageGuid.length > 0) {
      console.log(this.imgGuid.imageGuid);
      this.form.get(this.imageGuidProperty).setValue(this.imgGuid.imageGuid);
    }

    const values = this.fillData();
    const request = this.meterService.createFwUpgrade(values);
    // console.log(`request = ${JSON.stringify(request)}`);
    const successMessage = this.i18n(`Meter Units upload Edited was successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        console.log(result);
        if (result) {
          this.toast.infoToast(result.status);
          if (result.status.includes('waiting for activiation')) {
            this.activate = true;
          }
        }
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

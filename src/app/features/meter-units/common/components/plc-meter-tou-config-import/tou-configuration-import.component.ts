import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { MeterUnitsTouConfigImport } from 'src/app/core/repository/interfaces/meter-units/meter-units-tou-config-import.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { EventManagerService } from '../../../../../core/services/event-manager.service';
import { TouConfigErrorHandler } from '../plc-meter-tou-config/tou-config-error-handler/tou-config-error-handler';

@Component({
  templateUrl: './tou-configuration-import.component.html'
})
export class TouConfigurationImportComponent {
  form: FormGroup;
  public files: Array<any>;
  allowedExt = ['xml'];
  acceptExtensions = ['.xml'];
  data = '';
  uploadDropSubtitle = this.translate.instant('COMMON.IMPORT-SUBTITLE-XML');

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public modal: NgbActiveModal,
    private translate: TranslateService,
    private meterService: MeterUnitsService,
    private eventsService: EventManagerService,
    private touConfigErrorHelper: TouConfigErrorHandler
  ) {
    this.resetForm();
  }

  get nameProperty() {
    return 'name';
  }

  get fileProperty() {
    return 'files';
  }

  resetForm() {
    this.files = [];
    this.form = this.createForm();
    this.modal.dismiss();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: ['', Validators.required],
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }

  getTitle() {
    return this.translate.instant('PLC-METER.IMPORT-TOU-TITLE');
  }

  import() {
    const values = this.fillData();
    const request = this.meterService.importConfigTou(values);
    const successMessage = this.translate.instant('PLC-METER.IMPORT-SUCCESSFULLY');
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      () => {
        this.resetForm();
        this.eventsService.emitCustom('RefreshTouConfigList', true);
      },
      (x) => {
        this.touConfigErrorHelper.showErrorsAsToasts(x);
      }
    );
  }

  fillData(): MeterUnitsTouConfigImport {
    return {
      timeOfUseName: this.form.get(this.nameProperty).value,
      fileContent: this.data
    };
  }

  selected(event: any) {
    event.files.forEach((file: FileInfo) => {
      if (file.rawFile) {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.data = reader.result as string;
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  removed(event: any) {
    this.data = '';
  }
}

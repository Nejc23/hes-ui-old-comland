import { ToastNotificationService } from './../../../../../core/toast-notification/services/toast-notification.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { FileInfo } from '@progress/kendo-angular-upload';
import { MeterUnitsTouConfigImport } from 'src/app/core/repository/interfaces/meter-units/meter-units-tou-config-import.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plc-meter-tou-config-import',
  templateUrl: './plc-meter-tou-config-import.component.html'
})
export class PlcMeterTouConfigImportComponent implements OnInit {
  form: FormGroup;
  public files: Array<any>;
  allowedExt = ['xml'];
  acceptExtensions = ['.xml'];
  data = '';
  errorMsg = '';

  uploadDropSubtitle = this.translate.instant('PLC-METER.DROP-SUBTITLE');
  subtitle = this.translate.instant('PLC-METER.SUBTITLE');

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private meterService: MeterUnitsService,
    private breadcrumbService: BreadcrumbService,
    private toast: ToastNotificationService,
    private translate: TranslateService
  ) {
    this.resetForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: ['', Validators.required],
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {
    this.breadcrumbService.setPageName(this.translate.instant('PLC-METER.IMPORT-TOU-TITLE'));
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

  fillData(): MeterUnitsTouConfigImport {
    return {
      timeOfUseName: this.form.get(this.nameProperty).value,
      fileContent: this.data
    };
  }

  save() {
    this.errorMsg = '';
    const values = this.fillData();
    const request = this.meterService.importConfigTou(values);
    const successMessage = this.translate.instant('PLC-METER.IMPORT-SUCCESSFULLY');
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.resetForm();
      },
      (x) => {
        debugger;
        if (x.statusText) this.toast.errorToast(x.statusText);
        console.log(x);
      } // error
    );
  }

  resetForm() {
    this.files = [];
    this.form = this.createForm();
    this.data = '';
  }

  // properties - START
  get nameProperty() {
    return 'name';
  }

  get fileProperty() {
    return 'files';
  }
  // properties - END
}

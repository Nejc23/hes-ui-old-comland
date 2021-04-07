import { ToastNotificationService } from './../../../../../core/toast-notification/services/toast-notification.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import * as _ from 'lodash';
import { FileInfo } from '@progress/kendo-angular-upload';
import { MeterUnitsTouConfigImport } from 'src/app/core/repository/interfaces/meter-units/meter-units-tou-config-import.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

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

  uploadDropSubtitle = $localize`Selected file must be in .xml file format.`;
  subtitle = $localize`To import TOU configuration, first enter a configuration name, and then select the configuration file to be imported.`;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private meterService: MeterUnitsService,
    private breadcrumbService: BreadcrumbService,
    private toast: ToastNotificationService
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
    this.breadcrumbService.setPageName($localize`Import TOU Configuration`);
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
    const formData: MeterUnitsTouConfigImport = {
      timeOfUseName: this.form.get(this.nameProperty).value,
      fileContent: this.data
    };
    return formData;
  }

  save() {
    this.errorMsg = '';
    const values = this.fillData();
    const request = this.meterService.importConfigTou(values);
    // console.log(`request = ${JSON.stringify(request)}`);
    const successMessage = $localize`Import xml file was successfully`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.resetForm();
      },
      (x) => {
        this.toast.errorToast(x.statusText);
        // this.errorMsg = x.statusText;
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

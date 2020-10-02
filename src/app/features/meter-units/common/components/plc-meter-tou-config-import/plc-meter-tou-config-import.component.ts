import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  acceptExtensions = '.xml';
  data = '';
  errorMsg = '';

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private meterService: MeterUnitsService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: ['', Validators.required],
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {
    this.breadcrumbService.setPageName(this.i18n('Import TOU Configuration'));
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
    const successMessage = this.i18n(`Import xml file was successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        this.modal.close();
      },
      x => {
        this.errorMsg = x.statusText;
        console.log(x);
      } // error
    );
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  // properties - START
  get nameProperty() {
    return 'name';
  }

  get fileProperty() {
    return 'files';
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }
}

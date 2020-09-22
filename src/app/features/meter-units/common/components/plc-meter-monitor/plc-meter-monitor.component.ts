import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { RequestSetMonitor } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';

@Component({
  selector: 'app-plc-meter-monitor',
  templateUrl: './plc-meter-monitor.component.html'
})
export class PlcMeterMonitorComponent implements OnInit {
  form: FormGroup;
  deviceIdsParam = [];
  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];
  excludeIdsParam?: string[];

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private i18n: I18n,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.phase1NameProperty]: [null],
        [this.phase1TresholdProperty]: [null, [Validators.min(0)]],
        [this.phase2NameProperty]: [null],
        [this.phase2TresholdProperty]: [null],
        [this.phase3NameProperty]: [null],
        [this.phase3TresholdProperty]: [null]
      },
      {
        validators: [this.atLeastOneValue, this.validateFields]
      }
    );
  }

  ngOnInit() {}

  fillData(): RequestSetMonitor {
    const data = [];
    if (
      this.form.get(this.phase1NameProperty).value &&
      this.form.get(this.phase1NameProperty).value.length > 0 &&
      this.form.get(this.phase1TresholdProperty).value
    ) {
      data.push({ name: this.form.get(this.phase1NameProperty).value, threshold: this.form.get(this.phase1TresholdProperty).value });
    }

    if (
      this.form.get(this.phase2NameProperty).value &&
      this.form.get(this.phase2NameProperty).value.length > 0 &&
      this.form.get(this.phase2TresholdProperty).value
    ) {
      data.push({ name: this.form.get(this.phase2NameProperty).value, threshold: this.form.get(this.phase2TresholdProperty).value });
    }

    if (
      this.form.get(this.phase3NameProperty).value &&
      this.form.get(this.phase3NameProperty).value.length > 0 &&
      this.form.get(this.phase3TresholdProperty).value
    ) {
      data.push({ name: this.form.get(this.phase3NameProperty).value, threshold: this.form.get(this.phase3TresholdProperty).value });
    }
    const formData: RequestSetMonitor = {
      monitorObjects: data,
      deviceIds: this.deviceIdsParam,
      filter: this.filterParam,
      search: this.searchParam,
      excludeIds: this.excludeIdsParam
    };

    return formData;
  }

  // properties - START
  get phase1NameProperty() {
    return 'phase1Name';
  }

  get phase2NameProperty() {
    return 'phase2Name';
  }

  get phase3NameProperty() {
    return 'phase3Name';
  }

  get phase1TresholdProperty() {
    return 'phase1Treshold';
  }

  get phase2TresholdProperty() {
    return 'phase2Treshold';
  }

  get phase3TresholdProperty() {
    return 'phase3Treshold';
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    const values = this.fillData();
    const request = this.myGridService.setMonitor(values);
    const successMessage = this.i18n(`Meter Units set Monitor was successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        this.modal.close();
      },
      () => {} // error
    );
  }

  atLeastOneValue(form: FormGroup): ValidationErrors {
    return Object.keys(form.value).some(key => !!form.value[key]) ? null : { atLeastOneRequired: true };
  }

  validateFields(form: FormGroup): ValidationErrors {
    if (Object.keys(form.value).some(key => !!form.value[key])) {
      if (
        form.value.phase1Name &&
        form.value.phase1Name.length > 0 &&
        (form.value.phase1Treshold == null || form.value.phase1Treshold.toString().length === 0)
      ) {
        form.get('phase1Treshold').setErrors({ required: true });
        return { required: true };
      } else if (
        form.value.phase1Treshold &&
        form.value.phase1Treshold.length > 0 &&
        (!form.value.phase1Name || form.value.phase1Name.length === 0)
      ) {
        form.get('phase1Name').setErrors({ required: true });
        return { required: true };
      } else if (
        form.value.phase2Name &&
        form.value.phase2Name.length > 0 &&
        (!form.value.phase2Treshold || form.value.phase2Treshold.length === 0)
      ) {
        form.get('phase2Treshold').setErrors({ required: true });
        return { required: true };
      } else if (
        form.value.phase2Treshold &&
        form.value.phase2Treshold.length > 0 &&
        (!form.value.phase2Name || form.value.phase2Name.length === 0)
      ) {
        form.get('phase2Name').setErrors({ required: true });
        return { required: true };
      } else if (
        form.value.phase3Name &&
        form.value.phase3Name.length > 0 &&
        (!form.value.phase3Treshold || form.value.phase3Treshold.length === 0)
      ) {
        form.get('phase3Treshold').setErrors({ required: true });
        return { required: true };
      } else if (
        form.value.phase3Treshold &&
        form.value.phase3Treshold.length > 0 &&
        (!form.value.phase3Name || form.value.phase3Name.length === 0)
      ) {
        form.get('phase3Name').setErrors({ required: true });
        return { required: true };
      }
      return null;
    } else {
      form.get('phase1Name').setErrors(null);
      form.get('phase1Treshold').setErrors(null);
      form.get('phase2Name').setErrors(null);
      form.get('phase2Treshold').setErrors(null);
      form.get('phase3Name').setErrors(null);
      form.get('phase3Treshold').setErrors(null);
    }
  }
}

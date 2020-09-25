import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { RequestSetLimiter, LimiterDefinitions } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Observable } from 'rxjs/internal/Observable';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';

@Component({
  selector: 'app-plc-meter-limiter',
  templateUrl: './plc-meter-limiter.component.html'
})
export class PlcMeterLimiterComponent implements OnInit {
  form: FormGroup;
  deviceIdsParam = [];
  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];
  excludeIdsParam?: string[];
  registers$: Observable<Codelist<string>[]>;

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
        [this.registerProperty]: [null, [Validators.required]],
        [this.tresholdNormalProperty]: [null],
        [this.tresholdEmergencyProperty]: [null],
        [this.minOverTresholdDurationProperty]: [null],
        [this.minUnderTresholdDurationProperty]: [null]
      },
      {
        validators: [this.atLeastOneValue]
      }
    );
  }

  ngOnInit() {
    this.registers$ = this.myGridService.getLimiterRegisters({
      deviceIds: this.deviceIdsParam,
      filter: this.filterParam,
      search: this.searchParam,
      excludeIds: this.excludeIdsParam,
      /// for test ony that two devices are working on test environment '8EC1791C-E99C-499D-823A-D3F821B77097', '8E520D4A-3B9A-4F1B-B3DB-A6D95D8057F0'
      groupType: 10 // fixed id - defined in task LU-62 !!!
    });
  }

  fillData(): RequestSetLimiter {
    const data: LimiterDefinitions = {
      thresholdNormal: this.form.get(this.tresholdNormalProperty).value,
      thresholdEmergency: this.form.get(this.tresholdEmergencyProperty).value,
      minOverThresholdDuration: this.form.get(this.minOverTresholdDurationProperty).value,
      minUnderThresholdDuration: this.form.get(this.minUnderTresholdDurationProperty).value,
      registerGroupId: this.form.get(this.registerProperty).value.id
    };

    const formData: RequestSetLimiter = {
      limiterDefinitions: data,
      deviceIds: this.deviceIdsParam,
      filter: this.filterParam,
      search: this.searchParam,
      excludeIds: this.excludeIdsParam
    };

    return formData;
  }

  // properties - START

  get registerProperty() {
    return 'register';
  }

  get tresholdNormalProperty() {
    return 'tresholdNormal';
  }

  get tresholdEmergencyProperty() {
    return 'tresholdEmergency';
  }

  get minOverTresholdDurationProperty() {
    return 'minOverTresholdDuration';
  }

  get minUnderTresholdDurationProperty() {
    return 'minUnderTresholdDuration';
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    const values = this.fillData();
    const request = this.myGridService.setLimiter(values);
    const successMessage = this.i18n(`Meter Units set Limiter was successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        this.modal.close();
      },
      () => {} // error
    );
  }

  atLeastOneValue(form: FormGroup): ValidationErrors {
    return Object.keys(form.value).some(key => !!form.value[key] && key !== 'register') ? null : { atLeastOneRequired: true };
  }
}

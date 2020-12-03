import { DisplayGroup } from 'src/app/core/repository/interfaces/templating/display-group.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  RequestSetLimiter,
  LimiterDefinitions,
  ResponseCommonRegisterGroup
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { PlcMeterSetLimiterService } from '../../services/plc-meter-set-limiter.service';
import { RegisterGroup } from '../../../registers/interfaces/data-processing-request.interface';

@Component({
  selector: 'app-plc-meter-set-display-settings',
  templateUrl: './plc-meter-set-display-settings.component.html'
})
export class PlcMeterSetDisplaySettingsComponent implements OnInit {
  form: FormGroup;
  deviceIdsParam = [];
  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];
  excludeIdsParam?: string[];
  groupList$: Codelist<string>[];
  public selectedRowsCount: number;

  displayGroups: DisplayGroup[];

  selectedGroupId: string;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private setLimiterService: PlcMeterSetLimiterService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.groupListProperty]: [null, [Validators.required]]
      }
      // {
      //   validators: [this.atLeastOneValue]
      // }
    );
  }

  ngOnInit() {
    this.myGridService
      .getCommonRegisterGroup({
        deviceIds: this.deviceIdsParam,
        filter: this.filterParam,
        search: this.searchParam,
        excludeIds: this.excludeIdsParam,
        type: '11'
      })
      .subscribe((result: DisplayGroup[]) => {
        if (result && result.length > 0) {
          this.displayGroups = result;
          this.initGroupList();
        }
      });
  }

  initGroupList() {
    this.groupList$ = [];
    this.displayGroups.map(dg => this.groupList$.push({ id: dg.displayGroupId, value: dg.name }));
  }

  fillData(): RequestSetLimiter {
    // const data: LimiterDefinitions[] = [
    //   {
    //     thresholdNormal: this.form.get(this.tresholdNormalProperty).value,
    //     thresholdEmergency: this.form.get(this.tresholdEmergencyProperty).value,
    //     minOverThresholdDuration: this.form.get(this.minOverTresholdDurationProperty).value,
    //     minUnderThresholdDuration: this.form.get(this.minUnderTresholdDurationProperty).value,
    //     selectedGroupId: this.form.get(this.groupListProperty).value.value
    //   }
    // ];

    // const formData: RequestSetLimiter = {
    //   limiterDefinitions: data,
    //   deviceIds: this.deviceIdsParam,
    //   filter: this.filterParam,
    //   search: this.searchParam,
    //   excludeIds: this.excludeIdsParam
    // };

    // return formData;
    return null;
  }

  // properties - START

  get groupListProperty() {
    return 'groupList';
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    // const values = this.fillData();
    // const request = this.myGridService.setLimiter(values);
    // const successMessage = $localize`Meter Units set Limiter was successful`;
    // this.formUtils.saveForm(this.form, request, successMessage).subscribe(
    //   result => {
    //     this.modal.close();
    //   },
    //   () => {} // error
    // );
  }

  // atLeastOneValue(form: FormGroup): ValidationErrors {
  //   return Object.keys(form.value).some(key => !!form.value[key] && key !== 'register') ? null : { atLeastOneRequired: true };
  // }
}

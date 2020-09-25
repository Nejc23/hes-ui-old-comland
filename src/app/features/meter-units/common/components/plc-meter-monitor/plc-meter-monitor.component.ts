import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  RequestCommonRegisterGroup,
  RequestSetMonitor,
  ResponseCommonRegisterGroup
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { PlcMeterSetMonitorService } from '../../services/plc-meter-set-monitor.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-plc-meter-monitor',
  templateUrl: './plc-meter-monitor.component.html'
})
export class PlcMeterMonitorComponent implements OnInit {
  deviceIdsParam = [];
  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];
  excludeIdsParam?: string[];

  form: FormGroup;
  formTemplate: ResponseCommonRegisterGroup[];
  showError = true;

  constructor(
    private i18n: I18n,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private setMonitorService: PlcMeterSetMonitorService
  ) {}

  ngOnInit() {
    const formData: RequestCommonRegisterGroup = {
      type: 'MONITOR',
      deviceIds: this.deviceIdsParam,
      filter: this.filterParam,
      search: this.searchParam,
      excludeIds: this.excludeIdsParam
    };

    this.myGridService.getCommonRegisterGroup(formData).subscribe((result: ResponseCommonRegisterGroup[]) => {
      this.formTemplate = this.setMonitorService.getListOfRegisterDefinitionNames(result);
      this.form = this.setMonitorService.setForm(this.formTemplate);
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }

  onChangeField() {
    if (!this.setMonitorService.checkAtLeastOneThresholdExists(this.form, this.formTemplate)) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  onSet() {
    this.showError = false;
    if (!this.setMonitorService.checkAtLeastOneThresholdExists(this.form, this.formTemplate)) {
      this.showError = true;
      return;
    }
    const formData: RequestSetMonitor = {
      monitorObjects: this.setMonitorService.fillMonitorObjectDataFromForm(this.form, this.formTemplate),
      deviceIds: this.deviceIdsParam,
      filter: this.filterParam,
      search: this.searchParam,
      excludeIds: this.excludeIdsParam
    };

    const request = this.myGridService.setMonitor(formData);
    const successMessage = this.i18n(`Set Monitor was successful`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        this.modal.close();
      },
      () => {} // error
    );
  }
}

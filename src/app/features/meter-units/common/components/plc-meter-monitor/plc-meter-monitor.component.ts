import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  RequestCommonRegisterGroup,
  RequestSetMonitor,
  ResponseCommonRegisterGroup
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { PlcMeterSetMonitorService } from '../../services/plc-meter-set-monitor.service';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';

@Component({
  selector: 'app-plc-meter-monitor',
  templateUrl: './plc-meter-monitor.component.html'
})
export class PlcMeterMonitorComponent implements OnInit {
  deviceIdsParam = [];
  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];
  excludeIdsParam?: string[];
  actionName = '';

  form: FormGroup;
  formTemplate: ResponseCommonRegisterGroup[];
  showError = true;

  public selectedRowsCount: number;

  constructor(
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private setMonitorService: PlcMeterSetMonitorService,
    private modalService: ModalService
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
    const successMessage = `Set Monitor was successful`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.modal.close();
        const options: NgbModalOptions = {
          size: 'md'
        };
        const modalRef = this.modalService.open(StatusJobComponent, options);
        modalRef.componentInstance.requestId = result.requestId;
        modalRef.componentInstance.jobName = this.actionName;
        modalRef.componentInstance.deviceCount = result.deviceIds.length;
      },
      () => {} // error
    );
  }
}

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
import { PlcMeterSetMonitorService } from '../../services/plc-meter-set-monitor.service';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { TranslateService } from '@ngx-translate/core';
import { IActionRequestParams } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';

@Component({
  selector: 'app-plc-meter-monitor',
  templateUrl: './plc-meter-monitor.component.html'
})
export class PlcMeterMonitorComponent implements OnInit {
  params: IActionRequestParams;
  actionName = this.translate.instant('PLC-METER.SET-MONITOR');

  form: FormGroup;
  formTemplate: ResponseCommonRegisterGroup[];
  showError = true;

  public selectedRowsCount: number;

  constructor(
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private setMonitorService: PlcMeterSetMonitorService,
    private modalService: ModalService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const formData: RequestCommonRegisterGroup = {
      type: 'MONITOR',
      deviceIds: this.params.deviceIds,
      filter: this.params.filter,
      textSearch: this.params.textSearch,
      excludeIds: this.params.excludeIds,
      sort: []
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
      deviceIds: this.params.deviceIds,
      filter: this.params.filter,
      textSearch: this.params.textSearch,
      excludeIds: this.params.excludeIds,
      sort: []
    };

    const request = this.myGridService.setMonitor(formData);
    const successMessage = this.translate.instant('PLC-METER.SET-MONITOR-SUCCESSFUL');
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

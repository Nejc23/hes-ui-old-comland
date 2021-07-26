import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import {
  IActionRequestParams,
  IActionRequestSetDisconnectorMode
} from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';

@Component({
  selector: 'app-plc-meter-breaker-mode',
  templateUrl: './plc-meter-breaker-mode.component.html'
})
export class PlcMeterBreakerModeComponent implements OnInit {
  form: FormGroup;
  disconnectorModes: Codelist<number>[];
  actionRequest: IActionRequestParams;
  errMsg = '';
  actionName = '';

  selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private modalService: ModalService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.disconnectorModeProperty]: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.disconnectorModes = [
      { id: 0, value: this.translate.instant('PLC-METER.BREAKER.ALWAYS-CONNECTED') },
      { id: 1, value: this.translate.instant('PLC-METER.BREAKER.MANUAL-RECONN-ALLOWED') },
      { id: 2, value: this.translate.instant('PLC-METER.BREAKER.REMOTE-MANUAL-RECONN-ALLOWED') },
      { id: 3, value: this.translate.instant('PLC-METER.BREAKER.MANUAL-RECONN-ALLOWED-DISC-NOT') },
      { id: 4, value: this.translate.instant('PLC-METER.BREAKER.REMOTE-MANUAL-RECONN-ALLOWED-DISC-NOT') },
      { id: 5, value: this.translate.instant('PLC-METER.BREAKER.MANUAL-LOCAL-RECONN-ALLOWED') },
      { id: 6, value: this.translate.instant('PLC-METER.BREAKER.MANUAL-LOCAL-RECONN-ALLOWED-DISC-NOT') }
    ];
  }

  fillData(): IActionRequestSetDisconnectorMode {
    const formData: IActionRequestSetDisconnectorMode = {
      breakerMode: this.form.get(this.disconnectorModeProperty).value ? this.form.get(this.disconnectorModeProperty).value.id : null,
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds
    };

    return formData;
  }

  // properties - START
  get disconnectorModeProperty() {
    return 'disconnectorMode';
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    this.errMsg = '';
    const values = this.fillData();

    const request = this.myGridService.setDisconnectorMode(values);
    const successMessage = this.translate.instant('PLC-METER.BREAKER.BREAKER-MODE-SUCCESSFULLY');
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
      (err) => {
        // error
        this.errMsg = err.error.errors.breakerMode[0];
      }
    );
  }
}

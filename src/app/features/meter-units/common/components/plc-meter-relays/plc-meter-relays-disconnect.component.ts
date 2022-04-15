import { IActionRequestParams, IActionRequestRelays } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ResponseCommonRegisterGroup } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { PlcMeterSetLimiterService } from '../../services/plc-meter-set-limiter.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plc-meter-relays-disconnect',
  templateUrl: './plc-meter-relays-disconnect.component.html'
})
export class PlcMeterRelaysDisconnectComponent implements OnInit {
  form: FormGroup;
  actionRequest: IActionRequestParams;
  relays$: Codelist<string>[];
  actionName = this.translate.instant('PLC-METER.RELAY-DISCONNECT-SELECTED');

  public selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private setLimiterService: PlcMeterSetLimiterService,
    private modalService: ModalService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();
  }

  get relayProperty() {
    return 'relay';
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.relayProperty]: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.myGridService
      .getCommonRegisterGroup({
        deviceIds: this.actionRequest.deviceIds,
        filter: this.actionRequest.filter, // TODO: should be from this.actionRequest.
        textSearch: this.actionRequest.textSearch,
        excludeIds: this.actionRequest.excludeIds,
        sort: [],
        type: '19' // "RELAY"
      })
      .subscribe((result: ResponseCommonRegisterGroup[]) => {
        if (result && result.length > 0) {
          this.relays$ = this.setLimiterService.getListOfRegisterDefinitionNames(result);
        }
      });
  }

  // properties - START

  fillData(): IActionRequestRelays {
    const formData: IActionRequestRelays = {
      relayIds: [this.form.get(this.relayProperty).value ? this.form.get(this.relayProperty).value.value : null],
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

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    const values = this.fillData();
    const request = this.myGridService.postRelaysDisconnectDevice(values);
    const successMessage = this.translate.instant('COMMON.ACTION-IN-PROGRESS');
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

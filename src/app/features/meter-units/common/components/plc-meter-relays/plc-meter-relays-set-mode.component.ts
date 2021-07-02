import { IActionRequestParams, IActionRequestRelaysMode } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ResponseCommonRegisterGroup } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { PlcMeterSetLimiterService } from '../../services/plc-meter-set-limiter.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plc-meter-relays-set-mode',
  templateUrl: './plc-meter-relays-set-mode.component.html'
})
export class PlcMeterRelaysSetModeComponent implements OnInit {
  form: FormGroup;
  actionRequest: IActionRequestParams;

  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];

  relays$: Codelist<string>[];
  modes: Codelist<number>[];
  actionName = '';

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

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.relayProperty]: [null, [Validators.required]],
      [this.modeProperty]: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.myGridService
      .getCommonRegisterGroup({
        deviceIds: this.actionRequest.deviceIds,
        filter: this.filterParam, // TODO: should be from this.actionRequest.
        search: this.searchParam,
        excludeIds: this.actionRequest.excludeIds,
        type: '19' // "RELAY"
      })
      .subscribe((result: ResponseCommonRegisterGroup[]) => {
        if (result && result.length > 0) {
          this.relays$ = this.setLimiterService.getListOfRegisterDefinitionNames(result);
        }
      });

    this.modes = [
      { id: 0, value: this.translate.instant('PLC-METER.ALWAYS-CONNECTED') },
      { id: 1, value: this.translate.instant('PLC-METER.ONLY-MANUAL-RE-CONNECTION') },
      { id: 2, value: this.translate.instant('PLC-METER.REMOTE-AND-MANUAL-RE-CONNECTION') },
      { id: 3, value: this.translate.instant('PLC-METER.ONLY-MANUAL-RE-CONNECTION-ALLOWED') },
      { id: 4, value: this.translate.instant('PLC-METER.REMOTE-AND-MANUAL-RE-CONNECTION-MANUAL DISCONNECTION') },
      { id: 5, value: this.translate.instant('PLC-METER.MANUAL-AND-LOCAL-RE-CONNECTION') },
      { id: 6, value: this.translate.instant('PLC-METER.MANUAL-AND-LOCAL-RE-CONNECTION-MANUAL-DISCONNECTION') }
    ];
  }

  fillData(): IActionRequestRelaysMode {
    const formData: IActionRequestRelaysMode = {
      relayMode: [
        {
          relayGroupId: this.form.get(this.relayProperty).value ? this.form.get(this.relayProperty).value.value : null,
          relayMode: this.form.get(this.modeProperty).value ? this.form.get(this.modeProperty).value.id : null
        }
      ],
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

  get relayProperty() {
    return 'relay';
  }

  get modeProperty() {
    return 'mode';
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    const values = this.fillData();
    const request = this.myGridService.setRelaysMode(values);
    const successMessage = this.translate.instant('PLC-METER.SETTING-OF-RELAY-MODE');
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

  // atLeastOneValue(form: FormGroup): ValidationErrors {
  //   return Object.keys(form.value).some(key => !!form.value[key] && key !== 'register') ? null : { atLeastOneRequired: true };
  // }
}

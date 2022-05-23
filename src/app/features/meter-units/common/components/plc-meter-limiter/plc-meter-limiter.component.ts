import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  LimiterDefinitions,
  RequestSetLimiter,
  ResponseCommonRegisterGroup
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { PlcMeterSetLimiterService } from '../../services/plc-meter-set-limiter.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { IActionRequestParams } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';

@Component({
  selector: 'app-plc-meter-limiter',
  templateUrl: './plc-meter-limiter.component.html'
})
export class PlcMeterLimiterComponent implements OnInit {
  form: FormGroup;
  params: IActionRequestParams;
  registers$: Codelist<string>[];
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

  get registerProperty() {
    return 'register';
  }

  get tresholdNormalProperty() {
    return 'tresholdNormal';
  }

  get tresholdEmergencyProperty() {
    return 'tresholdEmergency';
  }

  // properties - START

  get minOverTresholdDurationProperty() {
    return 'minOverTresholdDuration';
  }

  get minUnderTresholdDurationProperty() {
    return 'minUnderTresholdDuration';
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
    this.myGridService
      .getCommonRegisterGroup({
        deviceIds: this.params.deviceIds,
        filter: this.params.filter,
        textSearch: this.params.textSearch,
        sort: [],
        excludeIds: this.params.excludeIds,
        type: '10'
      })
      .subscribe((result: ResponseCommonRegisterGroup[]) => {
        if (result && result.length > 0) {
          this.registers$ = this.setLimiterService.getListOfRegisterDefinitionNames(result);
        }
      });
  }

  fillData(): RequestSetLimiter {
    const data: LimiterDefinitions[] = [
      {
        thresholdNormal: this.form.get(this.tresholdNormalProperty).value,
        thresholdEmergency: this.form.get(this.tresholdEmergencyProperty).value,
        minOverThresholdDuration: this.form.get(this.minOverTresholdDurationProperty).value,
        minUnderThresholdDuration: this.form.get(this.minUnderTresholdDurationProperty).value,
        registerGroupId: this.form.get(this.registerProperty).value.value
      }
    ];

    const formData: RequestSetLimiter = {
      limiterDefinitions: data,
      deviceIds: this.params.deviceIds,
      filter: this.params.filter,
      textSearch: this.params.textSearch,
      sort: [],
      excludeIds: this.params.excludeIds
    };

    return formData;
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    const values = this.fillData();
    const request = this.myGridService.setLimiter(values);
    const successMessage = this.translate.instant('PLC-METER.METER-UNITS-SET-LIMITER');
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.modal.close();
        const options: NgbModalOptions = {
          size: 'md'
        };
        const modalRef = this.modalService.open(StatusJobComponent, options);
        modalRef.componentInstance.requestId = result.requestId;
        modalRef.componentInstance.jobName = this.translate.instant('PLC-METER.SET-LIMITER', {
          selectedRowsCount: result.deviceIds.length
        });
        modalRef.componentInstance.deviceCount = result.deviceIds.length;
      },
      () => {} // error
    );
  }

  atLeastOneValue(form: FormGroup): ValidationErrors {
    return Object.keys(form.value).some((key) => !!form.value[key] && key !== 'register') ? null : { atLeastOneRequired: true };
  }
}

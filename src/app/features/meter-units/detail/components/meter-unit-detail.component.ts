import { map } from 'rxjs/operators';
import { meterUnitVendors } from './../../../../core/repository/consts/meter-units.const';
import { meterUnitTypes } from 'src/app/core/repository/consts/meter-units.const';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { Observable, of } from 'rxjs';
import { Codelist } from './../../../../shared/repository/interfaces/codelists/codelist.interface';
import { MeterUnitDetailForm } from './../interfaces/meter-unit-form.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { Component, OnInit } from '@angular/core';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { MeterUnit } from 'src/app/core/repository/interfaces/meter-units/meter-unit.interface';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DcuForm } from 'src/app/features/data-concentrator-units/interfaces/dcu-form.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { SchedulerJobComponent } from 'src/app/features/jobs/components/scheduler-job/scheduler-job.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MeterUnitsTypeEnum } from '../../types/enums/meter-units-type.enum';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { RequestFilterParams, RequestTOUData } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { PlcMeterTouConfigComponent } from '../../common/components/plc-meter-tou-config/plc-meter-tou-config.component';
import { PlcMeterFwUpgradeComponent } from '../../common/components/plc-meter-fw-upgrade/plc-meter-fw-upgrade.component';
import { PlcMeterMonitorComponent } from '../../common/components/plc-meter-monitor/plc-meter-monitor.component';
import { PlcMeterLimiterComponent } from '../../common/components/plc-meter-limiter/plc-meter-limiter.component';
import { MeterUnitsPlcActionsService } from '../../types/services/meter-units-plc-actions.service';
import { guid } from '@progress/kendo-angular-common';

@Component({
  templateUrl: 'meter-unit-detail.component.html'
})
export class MeterUnitDetailComponent implements OnInit {
  private deviceId;
  private saveError;

  private messageActionInProgress = this.i18n(`Action in progress!`);
  private messageServerError = this.i18n(`Server error!`);

  private requestModel;

  public editMode = false;
  public data: MeterUnit;
  public form: FormGroup;
  public muStatuses$: Observable<Codelist<number>[]>;
  public muTypes$: Observable<Codelist<number>[]>;
  public muVendors$: Observable<Codelist<number>[]>;

  public muTemplates: Codelist<string>[];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private meterUnitsService: MeterUnitsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private codelistService: CodelistMeterUnitsRepositoryService,
    public i18n: I18n,
    private autoTemplateService: AutoTemplatesService,
    private modalService: ModalService,
    private bulkService: MyGridLinkService,
    private toast: ToastNotificationService,
    private plcActionsService: MeterUnitsPlcActionsService
  ) {
    breadcrumbService.setPageName('Meter Unit');
  }

  ngOnInit() {
    const meterUnitTypeId = 1;

    this.deviceId = this.route.params.subscribe(params => {
      this.deviceId = params.deviceId;
      this.requestModel = {
        deviceIds: [this.deviceId],
        filter: null,
        search: null,
        excludeIds: null
      };
    });

    this.muTypes$ = this.codelistService.meterUnitTypeCodelist();

    this.autoTemplateService.getTemplates().subscribe(templates => {
      this.muTemplates = templates.map(t => ({ id: t.templateId, value: t.name }));
    });

    // get MeterUnit
    this.getData();
  }

  setVendorsAndStatuses(typeId) {
    this.muStatuses$ = this.codelistService.meterUnitStatusCodelist(typeId); // PLC
    this.muVendors$ = this.codelistService.meterUnitVendorCodelist(typeId);
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.MU;
  }

  public editMeterUnit() {
    this.editMode = true;
  }

  public cancel() {
    this.editMode = false;
    this.getData();
  }

  saveMeterUnit() {
    const muFormData = this.fillData();
    console.log('muFormData on save', muFormData);
    const request = {}; // this.meterUnitService.updateMeterUnit(this.deviceId, dcuFormData);
    const successMessage = this.i18n(`Data Concentration Unit was updated successfully`);

    this.editMode = false;
    // try {
    //   this.formUtils.saveForm(this.form, request, successMessage).subscribe(
    //     result => {
    //       if (result) {
    //         this.editMode = false;
    //       }
    //     },
    //     errResult => {
    //       console.log('Error saving form: ', errResult);
    //       this.saveError = errResult && errResult.error ? errResult.error[0] : null;
    //     } // error
    //   );
    // } catch (error) {
    //   console.log('Edit-DCU Form Error:', error);
    // }
  }

  getData() {
    if (!this.deviceId || this.deviceId.length === 0) {
      this.form = this.createForm();
      return;
    }

    this.meterUnitsService.getMeterUnit(this.deviceId).subscribe((response: MeterUnit) => {
      this.data = response;
      console.log('getData()', this.data);

      this.form = this.createForm();

      this.setVendorsAndStatuses(this.data.typeId);
    });
  }

  // onTypeChanged(selectedType: Codelist<number>) {
  //   this.setVendorsAndStatuses(selectedType.id);

  //   // TODO clear fields if value not exists in lists
  //   // this.muVendors$ = of();
  //   // this.muStatuses$ = of();

  //   // this.form.get(this.vendorProperty).setValue(null);
  //   // this.form.get(this.statusProperty).setValue(null);
  // }

  fillData(): MeterUnitDetailForm {
    const formData: MeterUnitDetailForm = {
      deviceId: this.deviceId,
      name: this.form.get(this.nameProperty).value,
      type: this.form.get(this.typeProperty).value,
      vendor: this.form.get(this.vendorProperty).value,
      status: this.form.get(this.statusProperty).value,
      template: this.form.get(this.templateProperty).value,
      logicalDeviceName: this.form.get(this.logicalDeviceNameProperty).value,
      id5: this.form.get(this.id5Property).value
    };

    return formData;
  }

  get nameProperty() {
    return nameOf<MeterUnitDetailForm>(o => o.name);
  }

  get typeProperty() {
    return nameOf<MeterUnitDetailForm>(o => o.type);
  }

  get vendorProperty() {
    return nameOf<MeterUnitDetailForm>(o => o.vendor);
  }

  get statusProperty() {
    return nameOf<MeterUnitDetailForm>(o => o.status);
  }

  get templateProperty() {
    return nameOf<MeterUnitDetailForm>(o => o.template);
  }

  get logicalDeviceNameProperty() {
    return nameOf<MeterUnitDetailForm>(o => o.logicalDeviceName);
  }

  get id5Property() {
    return nameOf<MeterUnitDetailForm>(o => o.id5);
  }

  // actions - rights
  get actionMUBreakerStatus() {
    return ActionEnumerator.MUBreakerStatus;
  }
  get actionMUConnect() {
    return ActionEnumerator.MUConnect;
  }
  get actionMUDisconnect() {
    return ActionEnumerator.MUDisconnect;
  }

  get actionMUSetLimiter() {
    return ActionEnumerator.MUSetLimiter;
  }
  get actionMUTOU() {
    return ActionEnumerator.MUTOU;
  }

  get actionMUUpgrade() {
    return ActionEnumerator.MUUpgrade;
  }

  get actionMUReadJobs() {
    return ActionEnumerator.MUReadJobs;
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: [this.data ? this.data.name : null, Validators.required],
      // [this.idNumberProperty]: [this.data ? this.data.id : null, Validators.required],
      [this.statusProperty]: [
        this.data && this.data.statusId > 0 ? { id: this.data.statusId, value: this.data.statusValue } : null,
        [Validators.required]
      ],
      [this.typeProperty]: [
        this.data && this.data.typeId > 0 ? { id: this.data.typeId, value: this.data.typeValue } : null,
        [Validators.required]
      ],
      [this.vendorProperty]: [this.data && this.data.vendorId > 0 ? { id: this.data.vendorId, value: this.data.vendorValue } : null],
      [this.templateProperty]: [
        this.data.templateId.length > 0 ? { id: this.data.templateId, value: this.getTemplateValue(this.data.templateId) } : null,
        Validators.required
      ],
      [this.logicalDeviceNameProperty]: [this.data ? this.data.logicalDeviceName : null, Validators.required],
      [this.id5Property]: [this.data ? this.data.id5 : null, Validators.required]
    });
  }

  getTemplateValue(templateId: string) {
    templateId = templateId.toLowerCase();
    return this.muTemplates.find(t => t.id.toLowerCase() === templateId).value;
  }

  // --> Operations action click
  onBreakerStatus(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.breakerStatus, params, 1);
  }

  onActivateUpgrade(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.activateUpgrade, params, 1);
  }

  onConnect(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.connect, params, 1);
  }

  onDisconnect(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.disconnect, params, 1);
  }

  onClearFF(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.clearFF, params, 1);
  }

  // delete button click
  // TODO missing BE api !!
  onDelete(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.delete, params, 1);
  }

  // popup
  onScheduleReadJobs(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onScheduleReadJobs(params);
  }

  // popup
  onTou(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onTou(params);
  }

  // popup
  onUpgrade(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onUpgrade(params);
  }

  // popup
  onSetMonitor(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onSetMonitor(params);
  }

  // popup
  onSetLimiter(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onSetLimiter(params);
  }

  // popup
  onBreakerMode(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onBreakerMode(params);
  }
  // <-- end Operations action click (bulk or selected row)

  getBulkRequestParam(): RequestFilterParams {
    return {
      deviceIds: [this.deviceId],
      filter: null,
      search: null,
      excludeIds: null
    };
  }
}

import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MeterUnitDetailsForm } from '../interfaces/meter-unit-form.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { Component, OnInit } from '@angular/core';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { MeterUnitsTypeEnum } from '../../types/enums/meter-units-type.enum';
import { MeterUnitsPlcActionsService } from '../../types/services/meter-units-plc-actions.service';
import { MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';
import { Breadcrumb } from 'src/app/shared/breadcrumbs/interfaces/breadcrumb.interface';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { AddMuFormComponent } from '../../common/components/add-mu-form/add-mu-form.component';

@Component({
  templateUrl: 'meter-unit-details.component.html'
})
export class MeterUnitDetailsComponent implements OnInit {
  private deviceId;
  public saveError;

  private messageActionInProgress = $localize`Action in progress!`;
  private messageServerError = $localize`Server error!`;

  private requestModel;

  public data: MeterUnitDetails;
  public form: FormGroup;
  // public muStatuses: Codelist<number>[];
  // public muTypes: Codelist<number>[];
  // public muVendors: Codelist<number>[];
  // public muTemplates: Codelist<string>[];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private meterUnitsService: MeterUnitsService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private plcActionsService: MeterUnitsPlcActionsService,
    private codeList: CodelistMeterUnitsRepositoryService,
    private router: Router,
    private modalService: ModalService
  ) {
    breadcrumbService.setPageName($localize`Meter unit`);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.deviceId = params.deviceId;
      this.requestModel = {
        deviceIds: [this.deviceId],
        filter: null,
        search: null,
        excludeIds: null
      };
    });

    // get MeterUnit
    this.getData();
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.MU;
  }

  public editMeterUnit() {
    // this.editMode = true;
    const modalRef = this.modalService.open(AddMuFormComponent);

    const component: AddMuFormComponent = modalRef.componentInstance;
    modalRef.componentInstance.setFormEdit(this.data);

    modalRef.result
      .then((result) => {
        this.getData();
      })
      .catch(() => {});
  }

  getData() {
    if (!this.deviceId || this.deviceId.length === 0) {
      // this.form = this.createForm();
      return;
    }

    this.meterUnitsService.getMeterUnitFromConcentrator(this.deviceId).subscribe((response: MeterUnitDetails) => {
      this.data = response;
      this.setBreadcrumbs();
    });
  }

  fillData(): MeterUnitDetailsForm {
    return null;
  }

  get nameProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.name);
  }

  get idProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.deviceId);
  }

  get macProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.mac);
  }

  get typeProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.type);
  }

  get vendorProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.vendor);
  }

  get statusProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.status);
  }

  get templateProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.template);
  }

  get systitleProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.systitle);
  }

  get addressProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.address);
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

  get actionMUCiiState() {
    return ActionEnumerator.MUCiiState;
  }
  get actionMUCiiActivate() {
    return ActionEnumerator.MUCiiActivate;
  }
  get actionMUCiiDeactivate() {
    return ActionEnumerator.MUCiiDeactivate;
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

  get actionMUJobsAssignExisting() {
    return ActionEnumerator.MUJobsAssignExisting;
  }

  get actionMUReadJobs() {
    return ActionEnumerator.MUReadJobs;
  }

  get actionMUJobsTemplates() {
    return ActionEnumerator.MUJobsTemplates;
  }

  get actionMUSetDisplaySettings() {
    return ActionEnumerator.MUSetDisplaySettings;
  }

  get actionMUClearAlarms() {
    return ActionEnumerator.MUClearAlarms;
  }

  setBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: $localize`Meters`,
        params: {},
        url: null
      }
    ];

    breadcrumbs.push({
      label: $localize`Meter Unit`,
      params: {},
      url: null
    });

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  // --> Operations action click
  onDisconnectorStatus() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.breakerStatus, params, 1);
  }

  onActivateUpgrade() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.activateUpgrade, params, 1);
  }

  onConnect() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.connect, params, 1);
  }

  onDisconnect() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.disconnect, params, 1);
  }

  onCiiState() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.ciiState, params, 1);
  }

  onCiiActivate() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.ciiActivate, params, 1);
  }

  onCiiDeactivate() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.ciiDeactivate, params, 1);
  }

  onRelaysConnect(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysConnect(params, paramsLegacy, 1);
  }

  // popup
  onRelaysDisconnect(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysDisconnect(params, paramsLegacy, 1);
  }

  // popup
  onRelaysState(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysState(params, paramsLegacy, 1);
  }

  // popup
  onRelaysSetMode(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysSetMode(params, paramsLegacy, 1);
  }

  onClearFF() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.clearFF, params, 1);
  }

  // delete button click
  onDelete() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onDelete(params, 1, true);
  }

  // popup
  onScheduleReadJobs() {
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onScheduleReadJobs(params, 1);
  }

  // popup
  onJobsAssignExisting() {
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onJobsAssignExisting(params, 1);
  }

  // popup
  onJobsTemplates() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onJobsTemplates(params, 1);
  }

  // popup
  onTou() {
    // const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onTou(params, 1);
  }

  // popup
  onUpgrade() {
    // const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onUpgrade(params, 1);
  }

  // popup
  onSetMonitor() {
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onSetMonitor(params, 1);
  }

  // popup
  onSetLimiter() {
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onSetLimiter(params, 1);
  }

  // popup
  onDisconnectorMode() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onDisconnectorMode(params, 1);
  }

  onSetDisplaySettings() {
    const paramsOld = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);

    this.plcActionsService.onSetDisplaySettings(paramsOld, params, 1);
  }

  onClearAlarms() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.clearAlarms, params, 1);
  }

  // <-- end Operations action click (bulk or selected row)
}

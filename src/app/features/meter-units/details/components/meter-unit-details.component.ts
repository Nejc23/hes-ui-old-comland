import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MeterUnitDetailsForm } from '../interfaces/meter-unit-form.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { Component, OnInit } from '@angular/core';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
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
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: 'meter-unit-details.component.html'
})
export class MeterUnitDetailsComponent implements OnInit {
  private deviceId;
  public saveError;

  private requestModel;

  public data: MeterUnitDetails;
  public form: FormGroup;

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
        excludeIds: null,
        InitiateReading: false // TODO get data from BE
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
    const options: NgbModalOptions = {
      size: 'lg'
    };

    const modalRef = this.modalService.open(AddMuFormComponent, options);
    const component: AddMuFormComponent = modalRef.componentInstance;
    modalRef.componentInstance.setFormEdit(this.data, options);

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

  // permission rights

  get permissionMuManage() {
    return PermissionEnumerator.Manage_Meters;
  }
  get permissionManageJobs() {
    return PermissionEnumerator.Manage_Jobs;
  }
  get permissionManageAutoTemplates() {
    return PermissionEnumerator.Manage_Auto_Template_Rules;
  }
  get permissionFwUpgrade() {
    return PermissionEnumerator.Meter_FW_Upgrade;
  }
  get permissionDisconnectorConnect() {
    return PermissionEnumerator.Disconnector_Connect;
  }
  get permissionDisconnectorDisconnect() {
    return PermissionEnumerator.Disconnector_Disconnect;
  }
  get permissionDisconnectorGetState() {
    return PermissionEnumerator.Disconnector_Get_State;
  }
  get permissionDisconnectorSetMode() {
    return PermissionEnumerator.Disconnector_Set_Mode;
  }
  get permissionCiiActivate() {
    return PermissionEnumerator.CII_Activate;
  }
  get permissionCiiDeactivate() {
    return PermissionEnumerator.CII_Deactivate;
  }
  get permissionCiiState() {
    return PermissionEnumerator.CII_Get_State;
  }
  get permissionRelaysConnect() {
    return PermissionEnumerator.Relay_Connect;
  }
  get permissionRelaysDisconnect() {
    return PermissionEnumerator.Relay_Disconnect;
  }
  get permissionRelaysState() {
    return PermissionEnumerator.Relay_Get_State;
  }
  get permissionRelaysSetMode() {
    return PermissionEnumerator.Relay_Set_Mode;
  }
  get permissionTouUpload() {
    return PermissionEnumerator.TOU_Upload;
  }
  get permissionSetLimiter() {
    return PermissionEnumerator.Set_Limiter;
  }
  get permissionSetMonitor() {
    return PermissionEnumerator.Set_Monitor;
  }
  get permissionClearFF() {
    return PermissionEnumerator.Clear_FF;
  }
  get permissionSetDisplay() {
    return PermissionEnumerator.Set_Display;
  }
  get permissionClearAlarms() {
    return PermissionEnumerator.Clear_Alarms;
  }
  get permissionAssignTemplates() {
    return PermissionEnumerator.Assign_Templates;
  }
  get permissionReadMeter() {
    return PermissionEnumerator.Read_Meter;
  }
  get permissionSyncTime() {
    return PermissionEnumerator.Sync_Time;
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
    const actionName = 'Relay Connect';
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysConnect(params, paramsLegacy, 1, actionName);
  }

  // popup
  onRelaysDisconnect(selectedGuid: string) {
    const actionName = 'Relay Disconnect';
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysDisconnect(params, paramsLegacy, 1, actionName);
  }

  // popup
  onRelaysState(selectedGuid: string) {
    const actionName = 'Relay State';
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysState(params, paramsLegacy, 1, actionName);
  }

  // popup
  onRelaysSetMode(selectedGuid: string) {
    const actionName = 'Relay Mode';
    const params = this.plcActionsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysSetMode(params, paramsLegacy, 1, actionName);
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
    const actionName = 'TOU Upload';
    // const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onTou(params, 1, actionName);
  }

  // popup
  onUpgrade() {
    const actionName = 'Upload image';
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onUpgrade(params, 1, actionName);
  }

  // popup
  onSetMonitor() {
    const actionName = 'Set monitor';
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onSetMonitor(params, 1, actionName);
  }

  onReadMonitorThreshold() {
    const actionName = 'Read monitor thresholds';
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onReadMonitorThreshold(params, 1, actionName);
  }

  // popup
  onSetLimiter() {
    const actionName = 'Set Limiter';
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onSetLimiter(params, 1, actionName);
  }

  onReadLimiterThreshold() {
    const actionName = 'Read limiter thresholds';
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onReadLimiterThreshold(params, 1, actionName);
  }

  // popup
  onDisconnectorMode() {
    const actionName = 'Breaker Mode';
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onDisconnectorMode(params, 1, actionName);
  }

  onSetDisplaySettings() {
    const actionName = 'Set Display Settings';

    const paramsOld = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);

    this.plcActionsService.onSetDisplaySettings(paramsOld, params, 1, actionName);
  }

  onClearAlarms() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.clearAlarms, params, 1);
  }

  onSyncTime() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.syncTime, params, 1);
  }
}

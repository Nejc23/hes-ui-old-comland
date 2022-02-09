import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MeterUnitDetailsForm } from '../interfaces/meter-unit-form.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { MeterUnitsTypeEnum } from '../../types/enums/meter-units-type.enum';
import { MeterUnitsPlcActionsService } from '../../types/services/meter-units-plc-actions.service';
import { DeviceState, MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ReferenceType } from '../../../../core/repository/interfaces/meter-units/reference-type.enum';
import { PermissionService } from '../../../../core/permissions/services/permission.service';
import { MeterUnitsTypeGridEventEmitterService } from '../../types/services/meter-units-type-grid-event-emitter.service';
import { MeterUnitsTypeGridService } from '../../types/services/meter-units-type-grid.service';

@Component({
  templateUrl: 'meter-unit-details.component.html',
  styleUrls: ['./meter-unit-details.component.scss']
})
export class MeterUnitDetailsComponent implements OnInit {
  public saveError;
  public data: MeterUnitDetails;
  public detailsForm: FormGroup;
  public routerLinkUrl = '/meterUnits';
  communicationForm: FormGroup;

  plcAndMbusProtocols = ['DC450G3', 'AC750', 'AmeraDC', 'multiUtilityParent', 'Unknown'];
  isPlcDevice = false;
  openEdit = false;
  saveData = false;
  basicDetails = false;
  DeviceStateEnum = DeviceState;

  private deviceId;
  private requestModel;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private meterUnitsService: MeterUnitsService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private plcActionsService: MeterUnitsPlcActionsService,
    private codeList: CodelistMeterUnitsRepositoryService,
    private router: Router,
    private modalService: ModalService,
    private translate: TranslateService,
    private elRef: ElementRef,
    private permissionService: PermissionService,
    private eventService: MeterUnitsTypeGridEventEmitterService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService
  ) {
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
    this.eventService.eventEmitterRefreshDevices.subscribe({
      next: () => {
        this.getData();
      }
    });
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.MU;
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

  // permission rights

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

  getData() {
    this.meterUnitsService.getMeterUnitFromConcentrator(this.deviceId).subscribe((response: MeterUnitDetails) => {
      this.saveData = false;
      this.data = response;
      this.breadcrumbService.setPageName(this.data.name ? this.data.name : this.data.serialNumber);
      if (this.plcAndMbusProtocols.find((val) => val.toLowerCase() === this.data.driver?.toLowerCase())) {
        this.isPlcDevice = true;
      }
      this.createForm();
      this.closeSlideOut();
    });
  }

  createForm() {
    this.detailsForm = this.formBuilder.group({
      name: this.data.name,
      serialNumber: this.data.serialNumber,
      templateName: this.data.templateName,
      //  deviceState: this.data.deviceState,
      //   protocolType: this.translate.instant('PROTOCOL.' + this.data.protocolType),
      manufacturer: this.data.manufacturer,
      //   ip: this.data.ip,
      //   port: this.data.port,
      externalId: this.data.externalId
    });

    if (this.isPlcDevice) {
      this.communicationForm = this.formBuilder.group({
        protocolType: this.translate.instant('PROTOCOL.' + this.data.protocolType?.toUpperCase())
      });
    } else {
      this.communicationForm = this.formBuilder.group({
        protocolType: this.translate.instant('PROTOCOL.' + this.data.protocolType?.toUpperCase()),
        hostname: this.data.hostname,
        port: this.data.port,
        referencingType: this.data.referencingType.toLowerCase() === ReferenceType.COSEM_SHORT_NAME.toLowerCase(),
        communicationType: this.data.hdlcInformation ? 'HDLC' : 'WRAPPER'
      });
    }
  }

  editButtonClicked(basicDetails?: boolean) {
    this.basicDetails = basicDetails;
    this.openEdit = true;
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

  onRelaysConnect() {
    const actionName = this.translate.instant('PLC-METER.RELAY-CONNECT');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onRelaysConnect(params, paramsLegacy, 1, actionName);
  }

  // popup
  onRelaysDisconnect() {
    const actionName = this.translate.instant('PLC-METER.RELAY-DISCONNECT');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onRelaysDisconnect(params, paramsLegacy, 1, actionName);
  }

  // popup
  onRelaysState() {
    const actionName = this.translate.instant('PLC-METER.RELAY-STATE');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onRelaysState(params, paramsLegacy, 1, actionName);
  }

  // popup
  onRelaysSetMode() {
    const actionName = this.translate.instant('PLC-METER.RELAY-MODE');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
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
    const actionName = this.translate.instant('PLC-METER.TOU-UPLOAD');
    // const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onTou(params, 1, actionName);
  }

  // popup
  onUpgrade() {
    const actionName = this.translate.instant('PLC-METER.UPLOAD-IMAGE');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onUpgrade(params, 1, actionName);
  }

  // popup
  onSetMonitor() {
    const actionName = this.translate.instant('PLC-METER.SET-MONITOR');
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onSetMonitor(params, 1, actionName);
  }

  onReadMonitorThreshold() {
    const actionName = this.translate.instant('PLC-METER.READ-MONITOR-THRESHOLDS');
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onReadMonitorThreshold(params, 1, actionName);
  }

  // popup
  onSetLimiter() {
    const actionName = this.translate.instant('PLC-METER.SET-LIMITER');
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onSetLimiter(params, 1, actionName);
  }

  onReadLimiterThreshold() {
    const actionName = this.translate.instant('PLC-METER.READ-LIMITER-THRESHOLDS');
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onReadLimiterThreshold(params, 1, actionName);
  }

  // popup
  onDisconnectorMode() {
    const actionName = this.translate.instant('PLC-METER.BREAKER-MODE');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onDisconnectorMode(params, 1, actionName);
  }

  onSetDisplaySettings() {
    const actionName = this.translate.instant('PLC-METER.SET-DISPLAY-SETTINGS');

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

  onReadMeter() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onReadRegisters(params, 1);
  }

  onEnable() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.enableMeter, params, 1);
  }

  onDisable() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.disableMeter, params, 1);
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  closeSlideOut() {
    //  this.saveData = false;
    this.openEdit = false;
  }

  update() {
    this.saveData = true;
  }

  isEditVisible() {
    return this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters);
  }

  saveDataEvent(event: boolean) {
    this.saveData = false;
    if (event) {
      this.getData();
    }
  }
}

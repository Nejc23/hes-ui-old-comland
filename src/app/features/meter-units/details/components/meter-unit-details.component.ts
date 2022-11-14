import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { MeterUnitDetailsForm } from '../interfaces/meter-unit-form.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { MeterUnitsTypeEnum } from '../../types/enums/meter-units-type.enum';
import { MeterUnitsPlcActionsService } from '../../types/services/meter-units-plc-actions.service';
import { DeviceState, MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';
import { TranslateService } from '@ngx-translate/core';
import { ReferenceType } from '../../../../core/repository/interfaces/meter-units/reference-type.enum';
import { PermissionService } from '../../../../core/permissions/services/permission.service';
import { DeviceMetaDataDto } from '../../../../api/concentrator-inventory/models/device-meta-data-dto';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { MeterPropertyService } from '../../../../api/concentrator-inventory/services';
import { EventManagerService } from '../../../../core/services/event-manager.service';
import { process } from '@progress/kendo-data-query';
import { Observable, Subscription } from 'rxjs';
import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';
import { TemplateDto } from 'src/app/api/templating/template-dto';
import { Codelist } from '../../../../shared/repository/interfaces/codelists/codelist.interface';

@Component({
  templateUrl: 'meter-unit-details.component.html',
  styleUrls: ['./meter-unit-details.component.scss']
})
export class MeterUnitDetailsComponent implements OnInit, OnDestroy {
  public saveError;
  public data: MeterUnitDetails;
  public detailsForm: FormGroup;
  public routerLinkUrl = '/meterUnits';
  communicationForm: FormGroup;
  subscriptions: Array<Subscription> = [];

  plcAndMbusProtocols = ['DC450G3', 'AC750', 'AmeraDC', 'multiUtilityParent', 'Unknown'];
  isPlcDevice = false;
  openEdit = false;
  basicDetails = false;
  DeviceStateEnum = DeviceState;
  extraDetailsVisible = false;
  loadingMetadata = false;

  deviceId;
  deviceMetadata: Array<DeviceMetaDataDto> = [];
  stateToolTipMessage = '';
  templateDto: TemplateDto;
  loading = false;

  private requestModel;
  deviceMediums$: Observable<Codelist<number>[]>;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private meterUnitsService: MeterUnitsService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private plcActionsService: MeterUnitsPlcActionsService,
    private translate: TranslateService,
    private elRef: ElementRef,
    private permissionService: PermissionService,
    private meterPropertyService: MeterPropertyService,
    private eventsService: EventManagerService,
    private templatingService: TemplatingService
  ) {
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
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.MU;
  }

  get nameProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.name);
  }

  get firstInstalledDateProperty() {
    return nameOf<MeterUnitDetailsForm>((o) => o.firstInstalledDate);
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

  get lastCommunication() {
    return nameOf<MeterUnitDetailsForm>((o) => o.lastCommunication);
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

  get permissionUpdateShortNames() {
    return PermissionEnumerator.Update_Short_Names;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.eventsService.getCustom('RefreshMetadataEvent').subscribe(() => {
        this.getMetadata();
      })
    );

    this.subscriptions.push(
      this.eventsService.getCustom('RefreshMeterDetailsPage').subscribe((id) => {
        this.getData(id);
        this.closeSlideOut();
      })
    );
    // get MeterUnit
    this.getData(this.deviceId);
  }

  getData(deviceId: string) {
    this.loading = true;
    this.meterUnitsService.getMeterUnitFromConcentrator(deviceId).subscribe((response: MeterUnitDetails) => {
      this.data = response;
      this.loading = false;
      this.breadcrumbService.setPageName(this.data.name ? this.data.name : this.data.serialNumber);
      if (this.plcAndMbusProtocols.find((val) => val.toLowerCase() === this.data.driver?.toLowerCase())) {
        this.isPlcDevice = true;
      }
      this.createForm();
      this.getMetadata();
      this.closeSlideOut();
      if (response.stateChanged && response.stateChangedBy) {
        this.stateToolTipMessage = this.translate.instant('PLC-METER.STATE-CHANGED-TOOLTIP', {
          changedOn: moment(response.stateChanged).format(environment.dateDisplayFormat),
          changedAt: moment(response.stateChanged).format(environment.timeFormat),
          changedBy: response.stateChangedBy
        });
      }
      if (this.data.templateId) {
        this.templatingService.getTemplateDetail(this.data.templateId).subscribe((templateDto) => {
          this.templateDto = templateDto;
        });
      }
    });
  }

  getMetadata() {
    this.loadingMetadata = true;
    this.meterPropertyService.meterDeviceIdMetadataGet({ deviceId: this.deviceId }).subscribe((res) => {
      this.deviceMetadata = res;
      // sort data same as grid
      this.deviceMetadata = process(this.deviceMetadata, {
        sort: [{ field: 'property', dir: 'asc' }]
      }).data;
      this.loadingMetadata = false;
    });
  }

  createForm() {
    this.detailsForm = this.formBuilder.group({
      name: this.data.name,
      firstInstalledDate:
        moment(this.data.firstInstallDate).format(environment.dateDisplayFormat) +
        ' ' +
        moment(this.data.firstInstallDate).format(environment.timeFormat),
      serialNumber: this.data.serialNumber,
      template: [
        [
          this.data.templateName,
          moment(this.data.templateActiveFrom).format(environment.dateDisplayFormat) +
            ' ' +
            moment(this.data.templateActiveFrom).format(environment.timeFormat)
        ]
      ],
      manufacturer: this.data.manufacturer,
      lastCommunication: this.data.lastCommunication
        ? moment(this.data.lastCommunication).format(environment.dateDisplayFormat) +
          ' ' +
          moment(this.data.lastCommunication).format(environment.timeFormat)
        : null,
      medium: this.data.medium,
      externalId: this.data.externalId,
      deviceId: this.data.deviceId
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

  editCustomProperties() {
    this.extraDetailsVisible = true;
  }

  closeExtraDetails() {
    this.extraDetailsVisible = false;
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
    this.plcActionsService.onRelaysConnect(params, 1, actionName);
  }

  // popup
  onRelaysDisconnect() {
    const actionName = this.translate.instant('PLC-METER.RELAY-DISCONNECT');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onRelaysDisconnect(params, 1, actionName);
  }

  // popup
  onRelaysState() {
    const actionName = this.translate.instant('PLC-METER.RELAY-STATE');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onRelaysState(params, 1, actionName);
  }

  // popup
  onRelaysSetMode() {
    const actionName = this.translate.instant('PLC-METER.RELAY-MODE');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onRelaysSetMode(params, 1, actionName);
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
    const params = this.plcActionsService.getOperationRequestParam('', this.requestModel, 0, []);
    this.plcActionsService.onScheduleReadJobs(params, 1);
  }

  // popup
  onScheduleMeterTimeSyncJobs() {
    const params = this.plcActionsService.getOperationRequestParam('', this.requestModel, 0, []);
    this.plcActionsService.onScheduleMeterTimeSyncJobs(params, 1);
  }

  // popup
  onJobsAssignExisting() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1, []);
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
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onSetMonitor(params, 1, actionName);
  }

  onReadMonitorThreshold() {
    const actionName = this.translate.instant('PLC-METER.READ-MONITOR-THRESHOLDS');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onReadMonitorThreshold(params, 1, actionName);
  }

  // popup
  onSetLimiter() {
    const actionName = this.translate.instant('PLC-METER.SET-LIMITER');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onSetLimiter(params, 1, actionName);
  }

  onReadLimiterThreshold() {
    const actionName = this.translate.instant('PLC-METER.READ-LIMITER-THRESHOLDS');
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
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
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.onSetDisplaySettings(params, 1, actionName);
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
    this.eventsService.emitCustom('CloseSlideOut', true);
    this.openEdit = false;
  }

  update() {
    console.log('SaveButtonClicked on modal');
    this.eventsService.emitCustom('SaveButtonClicked', true);
  }

  isEditVisible() {
    return this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters);
  }

  onUpdateShortNames() {
    const params = this.plcActionsService.getOperationRequestParam(this.deviceId, this.requestModel, 1);
    this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.updateShortNames, params, 1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

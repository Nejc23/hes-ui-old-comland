import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MeterUnitDetailsForm } from '../interfaces/meter-unit-form.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { Component, OnInit } from '@angular/core';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { MeterUnitsTypeEnum } from '../../types/enums/meter-units-type.enum';
import { MeterUnitsPlcActionsService } from '../../types/services/meter-units-plc-actions.service';
import { MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';
import { Breadcrumb } from 'src/app/shared/breadcrumbs/interfaces/breadcrumb.interface';

@Component({
  templateUrl: 'meter-unit-details.component.html'
})
export class MeterUnitDetailsComponent implements OnInit {
  private deviceId;
  public saveError;

  private messageActionInProgress = $localize`Action in progress!`;
  private messageServerError = $localize`Server error!`;

  private requestModel;

  public editMode = false;
  public data: MeterUnitDetails;
  public form: FormGroup;
  // public muStatuses: Codelist<number>[];
  // public muTypes: Codelist<number>[];
  // public muVendors: Codelist<number>[];
  // public muTemplates: Codelist<string>[];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private meterUnitsService: MeterUnitsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private plcActionsService: MeterUnitsPlcActionsService,
    private codeList: CodelistMeterUnitsRepositoryService
  ) {
    breadcrumbService.setPageName('Meter Unit');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.deviceId = params.deviceId;
      this.requestModel = {
        deviceIds: [this.deviceId],
        filter: null,
        search: null,
        excludeIds: null
      };
    });

    // this.codelistService.meterUnitTypeCodelist().subscribe(params => {
    //   this.muTypes = params;
    //   console.log('returned type list', this.muTypes);
    //   this.setFormType();
    // });

    // this.autoTemplateService.getTemplates().subscribe(templates => {
    //   this.muTemplates = templates.map(t => ({ id: t.templateId, value: t.name }));
    // });

    // get MeterUnit
    this.getData();
  }

  // setVendorsAndStatuses(typeId) {
  //   this.codelistService.meterUnitStatusCodelist(typeId).subscribe(params => {
  //     this.muStatuses = params;
  //   }); // PLC

  //   this.codelistService.meterUnitVendorCodelist(typeId).subscribe(params => {
  //     this.muVendors = params;
  //     this.setFormVendor();
  //   });
  // }

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
    this.saveError = null;

    const muFormData = this.fillData();
    const request = this.meterUnitsService.updateMuFromForm(muFormData);
    const successMessage = $localize`Meter Unit was updated successfully`;

    try {
      this.formUtils.saveForm(this.form, request, successMessage).subscribe(
        (result) => {
          this.editMode = false;
        },
        (errResult) => {
          console.log('Error saving form: ', errResult);
          this.saveError = errResult && errResult.error ? errResult.error[0] : null;
        } // error
      );
    } catch (error) {
      console.log('Edit-MU Form Error:', error);
    }
  }

  getData() {
    if (!this.deviceId || this.deviceId.length === 0) {
      this.form = this.createForm();
      return;
    }

    this.meterUnitsService.getMeterUnit(this.deviceId).subscribe((response: MeterUnitDetails) => {
      this.data = response;
      console.log('getMeterUnit returned:', this.data);
      // this.setVendorsAndStatuses(this.data.type);

      this.form = this.createForm();
      // this.setFormType();
      // this.setFormVendor();

      this.setBreadcrumbs();
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

  fillData(): MeterUnitDetailsForm {
    const formData: MeterUnitDetailsForm = {
      name: this.form.get(this.nameProperty).value,
      id: this.form.get(this.idProperty).value,
      address: this.form.get(this.addressProperty).value,

      deviceId: this.deviceId,
      type: this.data.type,
      vendor: this.data.manufacturer,
      status: this.data.state,
      template: this.data.templateName,
      systitle: this.data.systitle,
      mac: this.data.mac
    };

    return formData;
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

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: [this.data ? this.data.name : null, Validators.required],
      // [this.idNumberProperty]: [this.data ? this.data.id : null, Validators.required],
      [this.statusProperty]: [this.data ? this.data.state : null],
      [this.typeProperty]: [this.data ? this.data.type : null],
      [this.vendorProperty]: [this.data ? this.data.manufacturer : null],
      [this.templateProperty]: [this.data ? this.data.templateName : null],
      [this.systitleProperty]: [this.data ? this.data.systitle : null],
      [this.idProperty]: [this.data ? this.data.serialNumber : null],
      [this.macProperty]: [this.data ? this.data.mac : null],
      [this.addressProperty]: [this.data ? this.data.address : null]
    });
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

  // setFormType() {
  //   if (this.data) {
  //     if (this.muTypes) {
  //       const selectedType = this.muTypes.find(s => s.id === this.data.type);
  //       this.form.get(this.typeProperty).setValue(selectedType);
  //     }
  //   }
  // }

  // setFormVendor() {
  //   if (this.data) {
  //     if (this.muTypes) {
  //       const selectedType = this.muVendors.find(s => s.value.toLowerCase() === this.data.manufacturer.toLowerCase());
  //       this.form.get(this.vendorProperty).setValue(selectedType);
  //     }
  //   }
  // }

  // getTemplateValue(templateId: string) {
  //   templateId = templateId.toLowerCase();
  //   return this.muTemplates.find(t => t.id.toLowerCase() === templateId).value;
  // }

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
  // TODO missing BE api !!
  onDelete() {
    //   const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    //   this.plcActionsService.bulkOperation(MeterUnitsTypeEnum.delete, params, 1);
  }

  // popup
  onScheduleReadJobs() {
    const params = this.plcActionsService.getRequestFilterParam(this.deviceId, this.requestModel);
    this.plcActionsService.onScheduleReadJobs(params, 1);
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

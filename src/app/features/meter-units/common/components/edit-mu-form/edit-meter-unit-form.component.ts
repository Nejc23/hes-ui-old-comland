import { MuUpdateForm, MuUpdatePlcForm } from 'src/app/features/meter-units/types/interfaces/mu-update-form.interface';
import { MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';
import { ToastNotificationService } from '../../../../../core/toast-notification/services/toast-notification.service';
import { MuHdlcInformation } from '../../../../../core/repository/interfaces/meter-units/mu-hdlc-information.interface';
import { MeterUnitsService } from '../../../../../core/repository/services/meter-units/meter-units.service';
import { RadioOption } from '../../../../../shared/forms/interfaces/radio-option.interface';
import {
  AuthenticationTypeEnum,
  MuAdvancedInformation
} from '../../../../../core/repository/interfaces/meter-units/mu-advanced-information.interface';
import { MuWrapperInformation } from '../../../../../core/repository/interfaces/meter-units/mu-wrapper-information.interface';
import { AutoTemplatesService } from '../../../../../core/repository/services/auto-templates/auto-templates.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { MuForm } from '../../../types/interfaces/mu-form.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';
import { GetDefaultInformationResponse } from 'src/app/core/repository/interfaces/templating/get-default-information.request.interface';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { map } from 'rxjs/operators';
import { ReferenceType } from '../../../../../core/repository/interfaces/meter-units/reference-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-meter-unit-form',
  templateUrl: './edit-meter-unit-form.component.html'
})
export class EditMeterUnitFormComponent implements OnInit, OnChanges {
  @ViewChild(TabStripComponent) public tabstrip: TabStripComponent;

  form: FormGroup;
  @Input() data: MeterUnitDetails;
  @Input() plcDevice = false;
  @Output() savedDataEvent = new EventEmitter<boolean>();
  @Input() saveData = false;
  @Input() basicDetails = false;

  manufacturers: Codelist<number>[];
  templates: Codelist<string>[];
  connectionTypes: Codelist<number>[] = [{ id: 1, value: this.translate.instant('FORM.IP') }];
  defaultConnectionType = this.connectionTypes[0];
  shortNameSelected = false;

  communicationTypes: RadioOption[] = [
    { value: '1' as string, label: this.translate.instant('FORM.WRAPPER') },
    { value: '0' as string, label: this.translate.instant('FORM.HDLC') }
  ];
  defaultCommunicationType = this.communicationTypes[0];

  communicationTypeSelected: RadioOption = null;

  authenticationTypes: Codelist<string>[] = [
    { id: AuthenticationTypeEnum.NONE, value: this.translate.instant('FORM.NONE') },
    { id: AuthenticationTypeEnum.LOW, value: this.translate.instant('FORM.LOW') },
    { id: AuthenticationTypeEnum.HIGH, value: this.translate.instant('FORM.HIGH') },
    { id: AuthenticationTypeEnum.HIGH_GMAC, value: this.translate.instant('FORM.HIGH-GMAC') }
  ];

  isConnectionTypeIp = this.defaultConnectionType?.id === 1;
  isTemplateSelected = false;

  isWrapperSelected = false;
  isHdlcSelected = false;
  isGatewayEnabled = false;

  templateDefaultValues: GetDefaultInformationResponse;
  opened = false;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private autoTemplateService: AutoTemplatesService,
    private templatingService: TemplatingService,
    private muService: MeterUnitsService,
    private jobsSelectGridService: JobsSelectGridService,
    private toast: ToastNotificationService,
    private codelistServiceMu: CodelistMeterUnitsRepositoryService,
    private translate: TranslateService
  ) {}

  get nameProperty() {
    return nameOf<MuForm>((o) => o.name);
  }

  get serialNumberProperty() {
    return nameOf<MuForm>((o) => o.serialNumber);
  }

  get manufacturerProperty() {
    return nameOf<MuForm>((o) => o.manufacturer);
  }

  get templateProperty() {
    return nameOf<MuForm>((o) => o.template);
  }

  get templateStringProperty() {
    return 'templateString';
  }

  get connectionTypeProperty() {
    return nameOf<MuForm>((o) => o.connectionType);
  }

  get ipProperty() {
    return nameOf<MuForm>((o) => o.ip);
  }

  get portProperty() {
    return nameOf<MuForm>((o) => o.port);
  }

  get communicationTypeProperty() {
    return nameOf<MuForm>((o) => o.communicationType);
  }

  get wrapperClientAddressProperty() {
    return nameOf<MuWrapperInformation>((o) => o.clientAddress);
  }

  get wrapperServerAddressProperty() {
    return nameOf<MuWrapperInformation>((o) => o.serverAddress);
  }

  get wrapperPublicClientAddressProperty() {
    return nameOf<MuWrapperInformation>((o) => o.publicClientAddress);
  }

  get wrapperPublicServerAddressProperty() {
    return nameOf<MuWrapperInformation>((o) => o.publicServerAddress);
  }

  get wrapperPhysicalAddressProperty() {
    return nameOf<MuWrapperInformation>((o) => o.physicalAddress);
  }

  get wrapperIsGatewayProperty() {
    return nameOf<MuWrapperInformation>((o) => o.isGateWay);
  }

  get advancedStartWithReleaseProperty() {
    return nameOf<MuAdvancedInformation>((o) => o.startWithRelease);
  }

  get advancedLdnAsSystitleProperty() {
    return nameOf<MuAdvancedInformation>((o) => o.ldnAsSystitle);
  }

  get authenticationTypeProperty() {
    return nameOf<MuForm>((o) => o.authenticationType);
  }

  get clientLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.clientLow);
  }

  get serverLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.serverLow);
  }

  get clientHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.clientHigh);
  }

  get serverHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.serverHigh);
  }

  get publicClientLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.publicClientLow);
  }

  get publicServerLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.publicServerLow);
  }

  get publicClientHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.publicClientHigh);
  }

  get publicServerHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.publicServerHigh);
  }

  get protocolProperty() {
    return nameOf<MeterUnitDetails>((o) => o.protocolType);
  }

  get referenceTypeProperty() {
    return nameOf<MuForm>((o) => o.referencingType);
  }

  get externalIdProperty() {
    return nameOf<MuForm>((o) => o.externalId);
  }

  get isDlms() {
    return this.data.driver?.toLowerCase() === 'dlms';
  }

  ngOnInit() {
    this.form = this.setFormEdit();
    //  this.communicationTypeChanged(this.defaultCommunicationType);
    this.codelistServiceMu
      .meterUnitVendorCodelist(null)
      .pipe(map((items) => items.filter((item) => item.value.toLowerCase() !== 'unknown')))
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers;
        const manufacturer = this.manufacturers.find((t) => this.data.manufacturer.toLowerCase() === t.value.toLowerCase());
        this.form.get(this.manufacturerProperty).setValue(manufacturer);
      });

    this.autoTemplateService.getTemplates().subscribe((temps) => {
      this.templates = temps
        .map((t) => {
          return { id: t.templateId, value: t.name };
        })
        .sort((a, b) => {
          return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        });

      const template = this.templates.find((t) => this.data.templateName.toLowerCase() === t.value.toLowerCase());
      this.form.get(this.templateProperty).setValue(template);
      this.isTemplateSelected = template && template.id ? true : false;
    });
  }

  ngOnChanges() {
    if (this.saveData) {
      this.update();
    }
  }

  createForm(): FormGroup {
    const communicationType = this.getCommunicationType(this.data);
    let authenticationType = this.authenticationTypes.find(
      (type) => type.id == this.data?.advancedInformation?.authenticationType?.toLowerCase()
    );
    if (!authenticationType) {
      authenticationType = this.authenticationTypes[1];
    }

    return this.formBuilder.group({
      [this.nameProperty]: [this.data?.name],
      [this.serialNumberProperty]: [{ value: this.data?.serialNumber, disabled: true }, Validators.required],
      [this.manufacturerProperty]: [null, Validators.required],
      [this.templateProperty]: [{ value: null, disabled: true }, Validators.required],
      [this.templateStringProperty]: [{ value: this.data?.templateName, disabled: true }],
      [this.connectionTypeProperty]: [this.defaultConnectionType, Validators.required],

      [this.ipProperty]: [
        { value: this.data?.ip, disabled: this.plcDevice },
        this.plcDevice ? null : [Validators.required, Validators.pattern(/(\d{1,3}\.){3}\d{1,3}/)]
      ],
      [this.portProperty]: [{ value: this.data?.port, disabled: this.plcDevice }, Validators.required],
      [this.communicationTypeProperty]: [communicationType?.value, Validators.required],

      [this.protocolProperty]: [{ value: this.translate.instant('PROTOCOL.' + this.data.protocolType), disabled: true }],

      // wrapper
      [this.wrapperClientAddressProperty]: [this.data?.wrapperInformation?.clientAddress, Validators.required],
      [this.wrapperServerAddressProperty]: [this.data?.wrapperInformation?.serverAddress, Validators.required],
      [this.wrapperPublicClientAddressProperty]: [this.data?.wrapperInformation?.publicClientAddress, Validators.required],
      [this.wrapperPublicServerAddressProperty]: [this.data?.wrapperInformation?.publicServerAddress, Validators.required],
      [this.wrapperIsGatewayProperty]: [this.data?.wrapperInformation?.isGateWay],
      [this.wrapperPhysicalAddressProperty]: [this.data?.wrapperInformation?.physicalAddress, Validators.required],

      // hdlc
      [this.clientLowProperty]: [this.data?.hdlcInformation?.clientLow, Validators.required],
      [this.serverLowProperty]: [this.data?.hdlcInformation?.serverLow, Validators.required],
      [this.clientHighProperty]: [this.data?.hdlcInformation?.clientHigh, Validators.required],
      [this.serverHighProperty]: [this.data?.hdlcInformation?.serverHigh, Validators.required],
      [this.publicClientLowProperty]: [this.data?.hdlcInformation?.publicClientLow, Validators.required],
      [this.publicServerLowProperty]: [this.data?.hdlcInformation?.publicServerLow, Validators.required],
      [this.publicClientHighProperty]: [this.data?.hdlcInformation?.publicClientHigh, Validators.required],
      [this.publicServerHighProperty]: [this.data?.hdlcInformation?.publicServerHigh, Validators.required],

      // advanced
      [this.advancedStartWithReleaseProperty]: [this.data?.advancedInformation?.startWithRelease],
      [this.advancedLdnAsSystitleProperty]: [this.data?.advancedInformation?.ldnAsSystitle],
      [this.authenticationTypeProperty]: [authenticationType, Validators.required],
      [this.externalIdProperty]: [this.data?.externalId]
    });
  }

  getCommunicationType(muDetails: MeterUnitDetails): RadioOption {
    if (!muDetails) {
      return this.defaultCommunicationType;
    }

    // edit
    let communicationType = this.defaultCommunicationType;
    if (muDetails.driver?.toLowerCase() !== 'dlms') {
      communicationType = null;
    } else if (muDetails.hdlcInformation) {
      communicationType = this.communicationTypes[1];
    }
    this.communicationTypeChanged(communicationType, false);

    return communicationType;
  }

  onConnectionTypeChanged(value: Codelist<number>) {
    this.isConnectionTypeIp = value && value.id === 1 ? true : false;
    this.setConnectionTypeControls();
  }

  setConnectionTypeControls() {
    if (this.isConnectionTypeIp) {
      this.form.get(this.ipProperty).enable();
      this.form.get(this.portProperty).enable();
    } else {
      this.form.get(this.ipProperty).disable();
      this.form.get(this.portProperty).disable();
    }
  }

  templateChanged(value: Codelist<string>) {
    this.isTemplateSelected = value && value.id ? true : false;
  }

  setDefaultFormValues() {
    const wrapperInformation = this.templateDefaultValues?.wrapperInformation?.wrapperInformation;
    if (wrapperInformation && this.isWrapperSelected) {
      this.form.get(this.communicationTypeProperty).patchValue(this.communicationTypes[0].value);

      this.setDefaultValue(this.wrapperClientAddressProperty, wrapperInformation.clientAddress);
      this.setDefaultValue(this.wrapperServerAddressProperty, wrapperInformation.serverAddress);

      this.setDefaultValue(this.wrapperPublicClientAddressProperty, wrapperInformation.publicClientAddress);
      this.setDefaultValue(this.wrapperPublicServerAddressProperty, wrapperInformation.publicServerAddress);

      this.setDefaultValue(this.wrapperPhysicalAddressProperty, wrapperInformation.physicalAddress);
    }

    const hdlcInformation = this.templateDefaultValues?.hdlcInformation?.hdlcInformation;
    if (hdlcInformation && this.isHdlcSelected) {
      this.form.get(this.communicationTypeProperty).patchValue(this.communicationTypes[1].value);
      this.setDefaultValue(this.clientLowProperty, hdlcInformation.clientLow);
      this.setDefaultValue(this.clientHighProperty, hdlcInformation.clientHigh);
      this.setDefaultValue(this.serverLowProperty, hdlcInformation.serverLow);
      this.setDefaultValue(this.serverHighProperty, hdlcInformation.serverHigh);
      this.setDefaultValue(this.publicClientLowProperty, hdlcInformation.publicClientLow);
      this.setDefaultValue(this.publicClientHighProperty, hdlcInformation.publicClientHigh);
      this.setDefaultValue(this.publicServerLowProperty, hdlcInformation.publicServerLow);
      this.setDefaultValue(this.publicServerHighProperty, hdlcInformation.publicServerHigh);
    }

    const advancedInformation = this.templateDefaultValues?.advancedInformation?.advancedInformation;
    if (advancedInformation) {
      if (advancedInformation.authenticationType) {
        this.form.get(this.authenticationTypeProperty).setValue(advancedInformation.authenticationType);
      }
      this.setDefaultValue(this.advancedLdnAsSystitleProperty, advancedInformation.ldnAsSystitle);
      this.setDefaultValue(this.advancedStartWithReleaseProperty, advancedInformation.startWithRelease);
    }
  }

  setDefaultValue(propertyName, value: any) {
    if (value === null) {
      return;
    }

    const formField = this.form.get(propertyName);
    if (formField.value === null || !formField.value) {
      formField.setValue(value);
    }
  }

  communicationTypeChanged(value: RadioOption, getDefaultValues: boolean = true) {
    this.communicationTypeSelected = value;
    this.isWrapperSelected = value ? +value?.value === 1 : false;
    this.isHdlcSelected = value ? +value?.value === 0 : false;
    if (!this.isHdlcSelected) {
      this.shortNameSelected = false;
    }
    if (this.form) {
      this.setFormControls();
    }
  }

  setFormControls() {
    this.setWrapperControls();
    this.setHdlcControls();
  }

  setWrapperControls() {
    if (this.isWrapperSelected) {
      this.form.get(this.wrapperClientAddressProperty).enable();
      this.form.get(this.wrapperServerAddressProperty).enable();
      this.form.get(this.wrapperPublicClientAddressProperty).enable();
      this.form.get(this.wrapperPublicServerAddressProperty).enable();
      this.form.get(this.wrapperIsGatewayProperty).enable();

      if (this.isGatewayEnabled) {
        this.form.get(this.wrapperPhysicalAddressProperty).enable();
      } else {
        this.form.get(this.wrapperPhysicalAddressProperty).disable();
      }
    } else {
      this.form.get(this.wrapperClientAddressProperty).disable();
      this.form.get(this.wrapperServerAddressProperty).disable();
      this.form.get(this.wrapperPublicClientAddressProperty).disable();
      this.form.get(this.wrapperPublicServerAddressProperty).disable();
      this.form.get(this.wrapperIsGatewayProperty).disable();
      this.form.get(this.wrapperPhysicalAddressProperty).disable();
    }
  }

  setHdlcControls() {
    if (this.isHdlcSelected) {
      this.form.get(this.clientLowProperty).enable();
      this.form.get(this.serverLowProperty).enable();
      this.form.get(this.clientHighProperty).enable();
      this.form.get(this.serverHighProperty).enable();
      this.form.get(this.publicClientLowProperty).enable();
      this.form.get(this.publicServerLowProperty).enable();
      this.form.get(this.publicClientHighProperty).enable();
      this.form.get(this.publicServerHighProperty).enable();
    } else {
      this.form.get(this.clientLowProperty).disable();
      this.form.get(this.serverLowProperty).disable();
      this.form.get(this.clientHighProperty).disable();
      this.form.get(this.serverHighProperty).disable();
      this.form.get(this.publicClientLowProperty).disable();
      this.form.get(this.publicServerLowProperty).disable();
      this.form.get(this.publicClientHighProperty).disable();
      this.form.get(this.publicServerHighProperty).disable();
    }
  }

  disableAdvancedControls() {
    this.form.get(this.authenticationTypeProperty).disable();
    this.form.get(this.advancedLdnAsSystitleProperty).disable();
    this.form.get(this.advancedStartWithReleaseProperty).disable();
  }

  update() {
    this.saveData = false;
    this.setFormControls();

    if (!this.isDlms) {
      this.disableAdvancedControls();
      this.form.get(this.communicationTypeProperty).disable();
    }
    this.selectTabWithErrors();

    let muFormData;
    let request;

    if (this.plcDevice) {
      muFormData = this.fillUpdatePlcData();
      request = this.muService.updateMuPlcForm(muFormData);
    } else {
      muFormData = this.fillUpdateData();
      request = this.muService.updateMuForm(muFormData);
    }

    const successMessage = this.translate.instant('PLC-METER.METER-UNIT-UPDATED');

    try {
      this.formUtils.saveForm(this.form, request, '').subscribe(
        (result) => {
          this.toast.successToast(successMessage);
          this.savedDataEvent.emit(true);
        },
        (errResult) => {
          if (errResult?.error?.length > 0 || Array.isArray(errResult.error)) {
            for (const error of errResult.error) {
              this.toast.errorToast(error);
            }
          }
          this.selectTabWithErrors();
        } // error
      );
    } catch (error) {
      this.selectTabWithErrors();
    }
  }

  selectTabWithErrors() {
    if (this.form.valid) {
      return;
    }

    if (
      this.form.get(this.nameProperty).invalid ||
      this.form.get(this.serialNumberProperty).invalid ||
      this.form.get(this.manufacturerProperty).invalid ||
      this.form.get(this.templateProperty).invalid ||
      this.form.get(this.connectionTypeProperty).invalid ||
      this.form.get(this.ipProperty).invalid ||
      this.form.get(this.communicationTypeProperty).invalid ||
      this.form.get(this.portProperty).invalid
    ) {
      this.tabstrip.selectTab(0); // Basic
    } else {
      this.tabstrip.selectTab(1); // Communication (jobs tab is not visible)
    }
    this.savedDataEvent.emit(false);
  }

  fillData(): MuForm {
    const selectedJobs = this.jobsSelectGridService.getSessionSettingsSelectedRows();

    let wrapperInformation: MuWrapperInformation = null;
    if (this.isWrapperSelected) {
      wrapperInformation = {
        clientAddress: this.form.get(this.wrapperClientAddressProperty).value,
        serverAddress: this.form.get(this.wrapperServerAddressProperty).value,
        publicClientAddress: this.form.get(this.wrapperPublicClientAddressProperty).value,
        publicServerAddress: this.form.get(this.wrapperPublicServerAddressProperty).value,
        physicalAddress: this.form.get(this.wrapperPhysicalAddressProperty).value,
        isGateWay: this.form.get(this.wrapperIsGatewayProperty).value
      };
    }

    let hdlcInformation: MuHdlcInformation = null;
    if (this.isHdlcSelected) {
      hdlcInformation = {
        clientLow: this.form.get(this.clientLowProperty).value,
        clientHigh: this.form.get(this.clientHighProperty).value,
        serverLow: this.form.get(this.serverLowProperty).value,
        serverHigh: this.form.get(this.serverHighProperty).value,
        publicClientLow: this.form.get(this.publicClientLowProperty).value,
        publicClientHigh: this.form.get(this.publicClientHighProperty).value,
        publicServerLow: this.form.get(this.publicServerLowProperty).value,
        publicServerHigh: this.form.get(this.publicServerHighProperty).value
      };
    }

    return {
      name: this.form.get(this.nameProperty).value,
      serialNumber: this.form.get(this.serialNumberProperty).value,
      manufacturer: this.form.get(this.manufacturerProperty).value,
      template: this.form.get(this.templateProperty).value,
      connectionType: this.form.get(this.connectionTypeProperty).value,
      ip: this.form.get(this.ipProperty).value,
      port: this.form.get(this.portProperty).value,
      communicationType: +this.form.get(this.communicationTypeProperty).value,
      jobIds: selectedJobs, // session selected jobs
      authenticationType: this.form.get(this.authenticationTypeProperty).value.id,
      advancedInformation: {
        authenticationType: this.form.get(this.authenticationTypeProperty).value.value,
        ldnAsSystitle: this.form.get(this.advancedLdnAsSystitleProperty).value ?? false,
        startWithRelease: this.form.get(this.advancedStartWithReleaseProperty).value ?? false
      },
      wrapperInformation,
      hdlcInformation,
      referencingType: this.shortNameSelected ? ReferenceType.COSEM_SHORT_NAME : ReferenceType.COSEM_LOGICAL_NAME,
      externalId: this.form.get(this.externalIdProperty).value
    };
  }

  fillUpdateData(): MuUpdateForm {
    let wrapperInformation: MuWrapperInformation = null;
    if (this.isWrapperSelected) {
      wrapperInformation = {
        clientAddress: this.form.get(this.wrapperClientAddressProperty).value,
        serverAddress: this.form.get(this.wrapperServerAddressProperty).value,
        publicClientAddress: this.form.get(this.wrapperPublicClientAddressProperty).value,
        publicServerAddress: this.form.get(this.wrapperPublicServerAddressProperty).value,
        physicalAddress: this.form.get(this.wrapperPhysicalAddressProperty).value,
        isGateWay: this.form.get(this.wrapperIsGatewayProperty).value
      };
    }

    let hdlcInformation: MuHdlcInformation = null;
    if (this.isHdlcSelected) {
      hdlcInformation = {
        clientLow: this.form.get(this.clientLowProperty).value,
        clientHigh: this.form.get(this.clientHighProperty).value,
        serverLow: this.form.get(this.serverLowProperty).value,
        serverHigh: this.form.get(this.serverHighProperty).value,
        publicClientLow: this.form.get(this.publicClientLowProperty).value,
        publicClientHigh: this.form.get(this.publicClientHighProperty).value,
        publicServerLow: this.form.get(this.publicServerLowProperty).value,
        publicServerHigh: this.form.get(this.publicServerHighProperty).value
      };
    }

    let advancedInformation = null;
    if (this.isDlms) {
      advancedInformation = {
        authenticationType: this.form.get(this.authenticationTypeProperty).value.id,
        ldnAsSystitle: this.form.get(this.advancedLdnAsSystitleProperty).value ?? false,
        startWithRelease: this.form.get(this.advancedStartWithReleaseProperty).value ?? false
      };
    }

    return {
      deviceId: this.data.deviceId,
      name: this.form.get(this.nameProperty).value,
      manufacturer: this.form.get(this.manufacturerProperty).value,
      ip: this.form.get(this.ipProperty).value,
      port: this.form.get(this.portProperty).value,
      authenticationType: this.form.get(this.authenticationTypeProperty).value.id,
      communicationType: this.isDlms ? +this.form.get(this.communicationTypeProperty).value : null,
      advancedInformation,
      wrapperInformation,
      hdlcInformation,

      serialNumber: this.data.serialNumber,
      template: this.form.get(this.templateProperty).value,
      connectionType: this.form.get(this.connectionTypeProperty).value,
      driver: this.isDlms ? 2 : 0,
      referencingType: this.shortNameSelected ? ReferenceType.COSEM_SHORT_NAME : ReferenceType.COSEM_LOGICAL_NAME,
      externalId: this.form.get(this.externalIdProperty).value
    };
  }

  fillUpdatePlcData(): MuUpdatePlcForm {
    return {
      deviceId: this.data.deviceId,
      name: this.form.get(this.nameProperty).value,
      externalId: this.form.get(this.externalIdProperty).value
    };
  }

  setFormEdit() {
    if (this.data.referencingType?.toLowerCase() === ReferenceType.COSEM_SHORT_NAME.toLowerCase()) {
      this.shortNameSelected = true;
    }
    this.form = this.createForm();
    this.isGatewayEnabled = this.data.wrapperInformation?.isGateWay;
    return this.form;
  }

  gatewayChanged(value: any) {
    this.isGatewayEnabled = value;
    this.setFormControls();
  }

  onShortNameChanges(event: boolean) {
    this.shortNameSelected = !!event;
  }

  toggle() {
    this.opened = !this.opened;
  }
}

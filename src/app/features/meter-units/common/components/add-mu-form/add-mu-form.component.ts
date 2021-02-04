import { ToastNotificationService } from './../../../../../core/toast-notification/services/toast-notification.service';
import { MuHdlcInformation } from './../../../../../core/repository/interfaces/meter-units/mu-hdlc-information.interface';
import { MeterUnitsService } from './../../../../../core/repository/services/meter-units/meter-units.service';
import { RadioOption } from './../../../../../shared/forms/interfaces/radio-option.interface';
import { MuAdvancedInformation } from './../../../../../core/repository/interfaces/meter-units/mu-advanced-information.interface';
import { MuWrapperInformation } from './../../../../../core/repository/interfaces/meter-units/mu-wrapper-information.interface';
import { AutoTemplatesService } from './../../../../../core/repository/services/auto-templates/auto-templates.service';
import { CodelistRepositoryService } from './../../../../../core/repository/services/codelists/codelist-repository.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { JobsSelectComponent } from 'src/app/features/jobs/jobs-select/components/jobs-select.component';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { MuForm } from '../../../types/interfaces/mu-form.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';
import { GetDefaultInformationResponse } from 'src/app/core/repository/interfaces/templating/get-default-information.request.interface';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { TouchListener } from '@ag-grid-community/core';

@Component({
  templateUrl: './add-mu-form.component.html'
})
export class AddMuFormComponent implements OnInit {
  @ViewChild(JobsSelectComponent) jobsSelect: JobsSelectComponent;
  @ViewChild(TabStripComponent) public tabstrip: TabStripComponent;

  tabTitleBasic = $localize`Basic`;
  tabTitleJobs = $localize`Jobs`;
  tabTitleCommunication = $localize`Communication`;
  tabTitleAdvanced = $localize`Advanced`;
  tabTitleCustomProperties = $localize`Custom properties`;

  form: FormGroup;

  manufacturers: Codelist<number>[];
  templates: Codelist<string>[];
  connectionTypes: Codelist<number>[] = [{ id: 1, value: $localize`IP` }];

  communicationTypes: RadioOption[] = [
    { value: 1 as number, label: $localize`Wrapper` },
    { value: 2 as number, label: $localize`HDLC` }
  ];

  communicationTypeSelected: RadioOption = null;

  authenticationTypes: Codelist<number>[] = [
    { id: 0, value: $localize`None` },
    { id: 1, value: $localize`Low` },
    { id: 2, value: $localize`High` },
    { id: 5, value: $localize`High with GMAC` }
  ];

  private defaultAuthenticationType = this.authenticationTypes[1];

  isConnectionTypeIp = false;
  isTemplateSelected = false;

  isWrapperSelected = false;
  isHdlcSelected = false;

  templateDefaultValues: GetDefaultInformationResponse;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private codelistService: CodelistRepositoryService,
    private autoTemplateService: AutoTemplatesService,
    private templatingService: TemplatingService,
    private muService: MeterUnitsService,
    private jobsSelectGridService: JobsSelectGridService,
    private toast: ToastNotificationService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.codelistService.dcuVendorCodelist().subscribe((manufacturers) => {
      this.manufacturers = manufacturers;
    });

    this.autoTemplateService.getTemplates().subscribe((temps) => {
      this.templates = temps
        .map((t) => {
          return { id: t.templateId, value: t.name };
        })
        .sort((a, b) => {
          return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        });
    });
  }

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

  get isHlsProperty() {
    return nameOf<MuForm>((o) => o.isHls);
  }

  get wrapperLlsClientProperty() {
    return nameOf<MuWrapperInformation>((o) => o.llsClient);
  }

  get wrapperLlsServerProperty() {
    return nameOf<MuWrapperInformation>((o) => o.llsServer);
  }

  // get wrapperPasswordProperty() {
  //   return nameOf<MuWrapperInformation>((o) => o.password);
  // }

  get wrapperHlsClientProperty() {
    return nameOf<MuWrapperInformation>((o) => o.hlsClient);
  }

  get wrapperHlsServerProperty() {
    return nameOf<MuWrapperInformation>((o) => o.hlsServer);
  }

  get wrapperPublicClientProperty() {
    return nameOf<MuWrapperInformation>((o) => o.publicClient);
  }

  get wrapperPublicServerProperty() {
    return nameOf<MuWrapperInformation>((o) => o.publicServer);
  }

  get wrapperPhysicalAddressProperty() {
    return nameOf<MuWrapperInformation>((o) => o.physicalAddress);
  }

  get isGatewayProperty() {
    return nameOf<MuForm>((o) => o.isGateway);
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

  get llsClientLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.llsClientLow);
  }

  get llsServerLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.llsServerLow);
  }

  get llsClientHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.llsClientHigh);
  }

  get llsServerHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.llsServerHigh);
  }

  get passwordProperty() {
    return nameOf<MuForm>((o) => o.password);
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

  get hlsClientLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.hlsClientLow);
  }

  get hlsServerLowProperty() {
    return nameOf<MuHdlcInformation>((o) => o.hlsServerLow);
  }

  get hlsClientHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.hlsClientHigh);
  }

  get hlsServerHighProperty() {
    return nameOf<MuHdlcInformation>((o) => o.hlsServerHigh);
  }

  get isShortNameProperty() {
    return nameOf<MuForm>((o) => o.isShortName);
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: ['', Validators.required],
      [this.serialNumberProperty]: ['', Validators.required],
      [this.manufacturerProperty]: [null, Validators.required],
      [this.templateProperty]: [null, Validators.required],
      [this.connectionTypeProperty]: [null, Validators.required],
      [this.ipProperty]: ['', [Validators.required, Validators.pattern(/(\d{1,3}\.){3}\d{1,3}/)]],
      [this.portProperty]: [null],
      [this.communicationTypeProperty]: [null, Validators.required],
      [this.isHlsProperty]: [false],

      // wrapper
      [this.wrapperLlsClientProperty]: [null, Validators.required],
      [this.wrapperLlsServerProperty]: [null, Validators.required],
      // [this.wrapperPasswordProperty]: [null, Validators.required],

      [this.wrapperPublicClientProperty]: [null, Validators.required],
      [this.wrapperPublicServerProperty]: [null, Validators.required],

      [this.wrapperHlsClientProperty]: [null, Validators.required],
      [this.wrapperHlsServerProperty]: [null, Validators.required],

      [this.isGatewayProperty]: [false],
      [this.wrapperPhysicalAddressProperty]: [null, Validators.required],

      // hdlc
      [this.llsClientLowProperty]: [null, Validators.required],
      [this.llsServerLowProperty]: [null, Validators.required],
      [this.llsClientHighProperty]: [null, Validators.required],
      [this.llsServerHighProperty]: [null, Validators.required],
      [this.passwordProperty]: [null, Validators.required],
      [this.publicClientLowProperty]: [null, Validators.required],
      [this.publicServerLowProperty]: [null, Validators.required],
      [this.publicClientHighProperty]: [null, Validators.required],
      [this.publicServerHighProperty]: [null, Validators.required],
      [this.hlsClientLowProperty]: [null, Validators.required],
      [this.hlsServerLowProperty]: [null, Validators.required],
      [this.hlsClientHighProperty]: [null, Validators.required],
      [this.hlsServerHighProperty]: [null, Validators.required],
      [this.isShortNameProperty]: [false],

      // advanced
      [this.advancedStartWithReleaseProperty]: [false],
      [this.advancedLdnAsSystitleProperty]: [false],
      [this.authenticationTypeProperty]: [this.defaultAuthenticationType, Validators.required]
    });
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

    if (this.isTemplateSelected) {
      this.templatingService.getDefaultValues(value.id).subscribe((values) => {
        this.templateDefaultValues = values;
        this.setDefaultFormValues();
      });
    }
  }

  setDefaultFormValues() {
    const wrapperInformation = this.templateDefaultValues?.wrapperInformation?.wrapperInformation;
    if (wrapperInformation && this.isWrapperSelected) {
      this.setDefaultValue(this.wrapperLlsClientProperty, wrapperInformation.llsClient);
      this.setDefaultValue(this.wrapperLlsServerProperty, wrapperInformation.llsServer);

      this.setDefaultValue(this.wrapperHlsClientProperty, wrapperInformation.hlsClient);
      this.setDefaultValue(this.wrapperHlsServerProperty, wrapperInformation.hlsServer);

      this.setDefaultValue(this.wrapperPublicClientProperty, wrapperInformation.publicClient);
      this.setDefaultValue(this.wrapperPublicServerProperty, wrapperInformation.publicServer);

      this.setDefaultValue(this.passwordProperty, wrapperInformation.password);
      this.setDefaultValue(this.wrapperPhysicalAddressProperty, wrapperInformation.physicalAddress);
    }

    const hdlsInformation = this.templateDefaultValues?.hdlcInformation?.hdlcInformation;
    if (hdlsInformation && this.isHdlcSelected) {
      this.setDefaultValue(this.llsClientLowProperty, hdlsInformation.llsClientLow);
      this.setDefaultValue(this.llsClientHighProperty, hdlsInformation.llsClientHigh);
      this.setDefaultValue(this.llsServerLowProperty, hdlsInformation.llsServerLow);
      this.setDefaultValue(this.llsServerHighProperty, hdlsInformation.llsServerHigh);
      this.setDefaultValue(this.passwordProperty, hdlsInformation.password);
      this.setDefaultValue(this.publicClientLowProperty, hdlsInformation.publicClientLow);
      this.setDefaultValue(this.publicClientHighProperty, hdlsInformation.publicClientHigh);
      this.setDefaultValue(this.publicServerLowProperty, hdlsInformation.publicServerLow);
      this.setDefaultValue(this.publicServerHighProperty, hdlsInformation.publicServerHigh);
      this.setDefaultValue(this.hlsClientLowProperty, hdlsInformation.hlsClientLow);
      this.setDefaultValue(this.hlsClientHighProperty, hdlsInformation.hlsClientHigh);
      this.setDefaultValue(this.hlsServerLowProperty, hdlsInformation.hlsServerLow);
      this.setDefaultValue(this.hlsServerHighProperty, hdlsInformation.hlsServerHigh);
    }

    const advancedInformation = this.templateDefaultValues?.advancedInformation?.advancedInformation;
    if (advancedInformation) {
      if (advancedInformation.authenticationType) {
        const formField = this.form.get(this.authenticationTypeProperty);
        const authenticationType = this.authenticationTypes.find((at) => at.id === advancedInformation.authenticationType);
        if (formField.value === this.defaultAuthenticationType && authenticationType) {
          formField.setValue(authenticationType);
        }
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

  communicationTypeChanged(value: RadioOption) {
    this.communicationTypeSelected = value;
    this.isWrapperSelected = +value.value === 1;
    this.isHdlcSelected = +value.value === 2;
    this.setFormControls();
    this.setDefaultFormValues();
  }

  setFormControls() {
    this.setWrapperControls();
    this.setHdlcControls();
  }

  setWrapperControls() {
    this.form.get(this.wrapperLlsClientProperty).disable();
    this.form.get(this.wrapperLlsServerProperty).disable();
    // this.form.get(this.wrapperPasswordProperty).disable();
    this.form.get(this.wrapperHlsClientProperty).disable();
    this.form.get(this.wrapperHlsServerProperty).disable();
    this.form.get(this.wrapperPublicClientProperty).disable();
    this.form.get(this.wrapperPublicServerProperty).disable();
    // this.form.get(this.isGatewayProperty).disable();
    this.form.get(this.wrapperPhysicalAddressProperty).disable();

    if (this.isWrapperSelected) {
      this.form.get(this.wrapperLlsClientProperty).enable();
      this.form.get(this.wrapperLlsServerProperty).enable();
      // this.form.get(this.wrapperPasswordProperty).enable();
      this.form.get(this.wrapperHlsClientProperty).enable();
      this.form.get(this.wrapperHlsServerProperty).enable();
      this.form.get(this.wrapperPublicClientProperty).enable();
      this.form.get(this.wrapperPublicServerProperty).enable();
      this.form.get(this.isGatewayProperty).enable();
      this.form.get(this.wrapperPhysicalAddressProperty).enable();
    }
  }

  setHdlcControls() {
    this.form.get(this.llsClientLowProperty).disable();
    this.form.get(this.llsServerLowProperty).disable();
    this.form.get(this.llsClientHighProperty).disable();
    this.form.get(this.llsServerHighProperty).disable();
    this.form.get(this.publicClientLowProperty).disable();
    this.form.get(this.publicServerLowProperty).disable();
    this.form.get(this.publicClientHighProperty).disable();
    this.form.get(this.publicServerHighProperty).disable();
    this.form.get(this.hlsClientLowProperty).disable();
    this.form.get(this.hlsServerLowProperty).disable();
    this.form.get(this.hlsClientHighProperty).disable();
    this.form.get(this.hlsServerHighProperty).disable();

    if (this.isHdlcSelected) {
      this.form.get(this.llsClientLowProperty).enable();
      this.form.get(this.llsServerLowProperty).enable();
      this.form.get(this.llsClientHighProperty).enable();
      this.form.get(this.llsServerHighProperty).enable();
      this.form.get(this.publicClientLowProperty).enable();
      this.form.get(this.publicServerLowProperty).enable();
      this.form.get(this.publicClientHighProperty).enable();
      this.form.get(this.publicServerHighProperty).enable();
      this.form.get(this.hlsClientLowProperty).enable();
      this.form.get(this.hlsServerLowProperty).enable();
      this.form.get(this.hlsClientHighProperty).enable();
      this.form.get(this.hlsServerHighProperty).enable();
    }
  }

  add() {
    const muFormData = this.fillData();
    const request = this.muService.createMuForm(muFormData);
    const successMessage = $localize`Meter unit has been added successfully`;

    try {
      this.formUtils.saveForm(this.form, request, '').subscribe(
        (result) => {
          this.toast.successToast(successMessage);
          this.modal.close();
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
      this.form.get(this.communicationTypeProperty).invalid
    ) {
      this.tabstrip.selectTab(0); // Basic
    } else {
      this.tabstrip.selectTab(2); // Communication
    }
  }

  fillData(): MuForm {
    const selectedJobs = this.jobsSelectGridService.getSessionSettingsSelectedRows();

    let wrapperInformation: MuWrapperInformation = null;
    if (this.isWrapperSelected) {
      wrapperInformation = {
        llsClient: this.form.get(this.wrapperLlsClientProperty).value,
        llsServer: this.form.get(this.wrapperLlsServerProperty).value,
        password: this.form.get(this.passwordProperty).value,
        publicClient: this.form.get(this.wrapperPublicClientProperty).value,
        publicServer: this.form.get(this.wrapperPublicServerProperty).value,
        hlsClient: this.form.get(this.wrapperHlsClientProperty).value,
        hlsServer: this.form.get(this.wrapperHlsServerProperty).value,
        physicalAddress: this.form.get(this.wrapperPhysicalAddressProperty).value
      };
    }

    let hdlcInformation: MuHdlcInformation = null;
    if (this.isHdlcSelected) {
      hdlcInformation = {
        llsClientLow: this.form.get(this.llsClientLowProperty).value,
        llsClientHigh: this.form.get(this.llsClientHighProperty).value,
        llsServerLow: this.form.get(this.llsServerLowProperty).value,
        llsServerHigh: this.form.get(this.llsServerHighProperty).value,
        password: this.form.get(this.passwordProperty).value,
        publicClientLow: this.form.get(this.publicClientLowProperty).value,
        publicClientHigh: this.form.get(this.publicClientHighProperty).value,
        publicServerLow: this.form.get(this.publicServerLowProperty).value,
        publicServerHigh: this.form.get(this.publicServerHighProperty).value,
        hlsClientLow: this.form.get(this.hlsClientLowProperty).value,
        hlsClientHigh: this.form.get(this.hlsClientHighProperty).value,
        hlsServerLow: this.form.get(this.hlsServerLowProperty).value,
        hlsServerHigh: this.form.get(this.hlsServerHighProperty).value
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
      communicationType: this.form.get(this.communicationTypeProperty).value,
      isHls: this.form.get(this.isHlsProperty).value,
      isGateway: this.form.get(this.isGatewayProperty).value,
      jobIds: selectedJobs, // session selected jobs
      isShortName: this.form.get(this.isShortNameProperty).value,
      password: this.form.get(this.passwordProperty).value,
      authenticationType: this.form.get(this.authenticationTypeProperty).value,
      advancedInformation: {
        authenticationType: this.form.get(this.authenticationTypeProperty).value,
        ldnAsSystitle: this.form.get(this.advancedLdnAsSystitleProperty).value,
        startWithRelease: this.form.get(this.advancedStartWithReleaseProperty).value
      },
      wrapperInformation,
      hdlcInformation
    };
  }

  cancel() {
    this.modal.close();
  }

  onTabSelect(e) {
    if (this.jobsSelect) {
      this.jobsSelect.sizeColumnsToFit();
    }
  }

  onDismiss() {
    this.modal.dismiss();
  }
}

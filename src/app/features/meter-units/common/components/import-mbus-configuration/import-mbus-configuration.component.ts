import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { RemoveEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { TranslateService } from '@ngx-translate/core';
import { ModuleConfigurationCommon } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { GridColumn, GridColumnType, GridRowAction } from '../../../../../shared/data-table/data-table.component';
import { ImportMbusConfigurationModalComponent } from './import-mbus-configuration-modal/import-mbus-configuration-modal.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { ModalConfirmComponent } from '../../../../../shared/modals/components/modal-confirm.component';
import { PermissionEnumerator } from '../../../../../core/permissions/enumerators/permission-enumerator.model';
import { PermissionService } from '../../../../../core/permissions/services/permission.service';

@Component({
  selector: 'app-import-mbus',
  templateUrl: './import-mbus-configuration.component.html'
})
export class ImportMbusConfigurationComponent implements OnInit {
  form: FormGroup;

  configurationsData = [];
  configurationsLoading = true;

  configurationRowActionConfiguration: Array<GridRowAction> = [
    {
      actionName: 'delete',
      iconName: 'delete-icon'
    },
    {
      actionName: 'details',
      iconName: 'eye-icon'
    }
  ];

  configurationsColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'configurationId',
      type: GridColumnType.BOLD_TEXT,
      translationKey: 'GRID.ID',
      width: 200
    },
    {
      field: 'manufacturer',
      translationKey: 'FORM.MANUFACTURER',
      width: 150
    },
    {
      field: 'type',
      translationKey: 'FORM.TYPE',
      width: 100
    },
    {
      field: 'channelId',
      translationKey: 'FORM.CHANNEL-ID',
      width: 100
    },
    {
      field: 'modified',
      translationKey: 'FORM.MODIFIED',
      width: 250,
      type: GridColumnType.DATE_TIME
    },
    {
      field: 'createdBy',
      translationKey: 'FORM.CREATED-BY',
      width: 250,
      icon: 'user-icon'
    }
  ];

  commonForm: FormGroup;
  noConfig = false;
  configRequiredText = this.translate.instant('COMMON.REQUIRED');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');
  successMessage = this.translate.instant('COMMON.IMPORT-SUCCESSFUL');
  uploadDropSubtitle = this.translate.instant('COMMON.IMPORT-SUBTITLE');
  clearData = false;
  deviceIdsParam = [];
  public files: Array<any>;
  allowedExt = ['json'];
  acceptExtensions = ['.json'];
  base64files = [];
  fileValid = false;
  loading = false;

  slideOutOpened = false;
  detailsData: any; // todo type
  jsonData = {};

  selectedIds = [];
  managePermissions = true;
  disableForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private gridLinkService: MyGridLinkService,
    private toast: ToastNotificationService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private elRef: ElementRef,
    private modalService: ModalService,
    private permissionService: PermissionService
  ) {
    this.resetForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  createCommonForm(): FormGroup {
    return this.formBuilder.group({
      commonSetting: [{ value: false, disabled: this.disableForm }, Validators.required],
      changePrimaryAddressOnUninstall: [{ value: false, disabled: this.disableForm }, Validators.required],
      autoInstallOnReboot: [{ value: false, disabled: this.disableForm }, Validators.required],
      deleteLPOnInstallation: [{ value: false, disabled: this.disableForm }, Validators.required],
      installationPeriodChannel1: [{ value: 12600, disabled: this.disableForm }, Validators.required],
      installationPeriodChannel2: [{ value: 12600, disabled: this.disableForm }, Validators.required],
      installationPeriodChannel3: [{ value: 0, disabled: this.disableForm }, Validators.required],
      installationPeriodChannel4: [{ value: 0, disabled: this.disableForm }, Validators.required]
    });
  }

  ngOnInit() {
    this.managePermissions = this.permissionService.hasAccess(this.permissionManageConfiguration);
    if (!this.managePermissions) {
      this.configurationRowActionConfiguration = this.configurationRowActionConfiguration.filter((item) => item.actionName !== 'delete');
      this.disableForm = true;
    }
    this.clearData = false;
    this.base64files = [];
    this.breadcrumbService.setPageName(this.translate.instant('MENU.IMPORT-MBUS-CONFIGURATION'));
    this.commonForm = this.createCommonForm();

    this.getData();
  }

  public selected(e: SelectEvent): void {
    this.clearData = false;
    const that = this;
    console.log(e.files);

    e.files.forEach((file, index) => {
      if (!file.validationErrors) {
        const reader = new FileReader();

        reader.onload = function (ev) {
          reader.readAsBinaryString(e.files[index].rawFile);
          reader.onload = function (event) {
            that.base64files.push(btoa(event.target.result.toString()));
          };
        };
        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  public removed(e: RemoveEvent): void {
    this.base64files = [];
  }

  clear() {
    this.clearData = true;
    this.resetForm();
  }

  save() {
    let response: Observable<any> = new Observable();
    const body = {
      fileContents: this.base64files
    };
    response = this.gridLinkService.postImportModuleConfigurationChannelSpecific(body);
    this.loading = true;
    response.subscribe(
      (value) => {
        this.loading = false;
        this.toast.successToast(this.successMessage);
        this.resetForm();
      },
      (e) => {
        this.loading = false;
        this.toast.errorToast(this.messageServerError);
      }
    );
  }

  resetForm() {
    this.files = [];
    this.form = this.createForm();
    this.base64files = [];
  }

  get fileProperty() {
    return 'files';
  }

  isFileValid(event: boolean) {
    this.fileValid = event;
  }

  getData() {
    this.configurationsLoading = true;
    this.gridLinkService.getModuleConfigurationCommon().subscribe((res: ModuleConfigurationCommon) => {
      this.configurationsLoading = false;
      this.patchForm(res);
    });

    this.gridLinkService.getModuleConfigurationChannelSpecific().subscribe((res: Array<any>) => {
      res.forEach((item) => {
        item.manufacturer = this.translateManufacturer(item.manufacturer);
        item.type = this.translateType(item.type);
      });
      this.configurationsData = res;
    });
  }

  patchForm(data: ModuleConfigurationCommon) {
    this.commonForm.get('autoInstallOnReboot').patchValue(data.autoInstallOnReboot);
    this.commonForm.get('deleteLPOnInstallation').patchValue(data.deleteLPOnInstallation);
    this.commonForm.get('changePrimaryAddressOnUninstall').patchValue(data.changePrimaryAddressOnUninstall);

    this.commonForm.get('installationPeriodChannel1').patchValue(data.installationPeriodChannel1);
    this.commonForm.get('installationPeriodChannel2').patchValue(data.installationPeriodChannel2);
    this.commonForm.get('installationPeriodChannel3').patchValue(data.installationPeriodChannel3);
    this.commonForm.get('installationPeriodChannel4').patchValue(data.installationPeriodChannel4);
  }

  updateCommonFields() {
    const payload: ModuleConfigurationCommon = {
      changePrimaryAddressOnUninstall: this.commonForm.get('changePrimaryAddressOnUninstall').value,
      autoInstallOnReboot: this.commonForm.get('autoInstallOnReboot').value,
      deleteLPOnInstallation: this.commonForm.get('deleteLPOnInstallation').value,

      installationPeriodChannel1: this.commonForm.get('installationPeriodChannel1').value,
      installationPeriodChannel2: this.commonForm.get('installationPeriodChannel2').value,
      installationPeriodChannel3: this.commonForm.get('installationPeriodChannel3').value,
      installationPeriodChannel4: this.commonForm.get('installationPeriodChannel4').value
    };
    this.gridLinkService.updateModuleConfigurationCommon(payload).subscribe((res) => {
      this.toast.successToast(this.translate.instant('Configuration updated'));
    });
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  calculateHeight() {
    return window.innerHeight - 280;
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'details') {
      this.openDetails(event.rowData);
    }
    if (event.actionName === 'delete') {
      this.selectedIds = [event.id];
      this.openDeleteConfigurationsModal();
    }
  }

  selectionChanged(event: any) {
    this.selectedIds = event;
  }

  openDetails(data: any) {
    this.gridLinkService.getModuleConfigurationChannelSpecificById(data.id).subscribe((res) => {
      this.detailsData = res;
      this.slideOutOpened = true;
      this.jsonData = JSON.parse(this.detailsData.json);
    });
  }

  closeSlideOut() {
    this.slideOutOpened = false;
  }

  openImportConfigurationModal() {
    const modalRef = this.modalService.open(ImportMbusConfigurationModalComponent);

    modalRef.result.then(
      (data) => {
        modalRef.close();
        this.getData();
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  openDeleteConfigurationsModal() {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;

    component.modalTitle = this.translate.instant('COMMON.DELETE-CONFIGURATION');
    component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEMS-CONFIGURATION-CONFIRMATION');
    component.warningIcon = true;

    modalRef.result.then(
      (data) => {
        this.gridLinkService.deleteModuleConfigurationChannelSpecific({ ids: this.selectedIds }).subscribe((res) => {
          this.toast.successToast(this.translate.instant('TOU-CONFIG.DELETE-ITEM-SUCCESS-CONFIGURATION'));
          this.getData();
          this.selectedIds = [];
        });
        modalRef.close();
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  get permissionManageConfiguration() {
    return PermissionEnumerator.Manage_MBus_Configuration;
  }

  get permissionViewConfig() {
    return PermissionEnumerator.View_MBus_Configuration;
  }

  translateManufacturer(manufacturer: number) {
    let translation = this.translate.instant('M-BUS-MANUFACTURER.UNKNOWN');
    if (this.hasTranslation('M-BUS-MANUFACTURER.' + manufacturer.toString(16).toUpperCase())) {
      translation = this.translate.instant('M-BUS-MANUFACTURER.' + manufacturer.toString(16).toUpperCase());
    }
    return translation;
  }

  translateType(type: number) {
    let translation = this.translate.instant('M-BUS-TYPE.UNKNOWN');
    if (this.hasTranslation('M-BUS-TYPE.' + type.toString(16).toUpperCase())) {
      translation = this.translate.instant('M-BUS-TYPE.' + type.toString(16).toUpperCase());
    }
    return translation;
  }

  hasTranslation(key: string): boolean {
    const translation = this.translate.instant(key);
    return translation !== key && translation !== '';
  }

  checkFields() {
    return !this.commonForm.valid || !this.checkInputs();
  }

  checkInputs() {
    return (
      this.checkValues(this.commonForm.get('installationPeriodChannel1').value) &&
      this.checkValues(this.commonForm.get('installationPeriodChannel2').value) &&
      this.checkValues(this.commonForm.get('installationPeriodChannel3').value) &&
      this.checkValues(this.commonForm.get('installationPeriodChannel4').value)
    );
  }

  checkValues(number: number): boolean {
    return number === 0 || number >= 300;
  }
}

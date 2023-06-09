import { SchedulerJobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DcuForm } from '../../interfaces/dcu-form.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { JobsSelectComponent } from 'src/app/features/jobs/jobs-select/components/jobs-select.component';
import { TranslateService } from '@ngx-translate/core';
import { ValidateHostnameRequest } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-update-request.interface';

@Component({
  selector: 'app-add-dcu-form',
  templateUrl: './add-dcu-form.component.html'
})
export class AddDcuFormComponent implements OnInit {
  form: FormGroup;

  dcuTypes: Codelist<number>[];
  dcuVendors: Codelist<number>[];
  dcuTags: Codelist<number>[];
  saveError: string;
  loading = false;

  public credentialsVisible = false;

  gridApi;

  @ViewChild(JobsSelectComponent) jobsSelect: JobsSelectComponent;
  @ViewChild(TabStripComponent) public tabstrip: TabStripComponent;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private jobsService: SchedulerJobsService,
    private toast: ToastNotificationService,
    private jobsSelectGridService: JobsSelectGridService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();
  }

  get nameProperty() {
    return nameOf<DcuForm>((o) => o.name);
  }

  get idNumberProperty() {
    return nameOf<DcuForm>((o) => o.serialNumber);
  }

  get externalIdProperty() {
    return nameOf<DcuForm>((o) => o.externalId);
  }

  get hostname() {
    return nameOf<DcuForm>((o) => o.hostname);
  }

  get userNameProperty() {
    return nameOf<DcuForm>((o) => o.userName);
  }

  get passwordProperty() {
    return nameOf<DcuForm>((o) => o.password);
  }

  get confirmPasswordProperty() {
    return nameOf<DcuForm>((o) => o.confirmPassword);
  }

  get typeProperty() {
    return nameOf<DcuForm>((o) => o.type);
  }

  get vendorProperty() {
    return nameOf<DcuForm>((o) => o.manufacturer);
  }

  get tagsProperty() {
    return nameOf<DcuForm>((o) => o.tags);
  }

  get firmwareAppProperty() {
    return nameOf<DcuForm>((o) => o.firmwareApp);
  }

  get firmwareBaseProperty() {
    return nameOf<DcuForm>((o) => o.firmwareBase);
  }

  ngOnInit() {
    this.codelistService.dcuTypeCodelist().subscribe((res) => {
      this.dcuTypes = res;
      // due to token issues call api synchronous
      this.codelistService.dcuVendorCodelist().subscribe((res) => {
        this.dcuVendors = res;
      });

      this.codelistService.dcuTagCodelist().subscribe((res) => {
        this.dcuTags = res;
      });
    });
    this.setCredentialsControls(this.credentialsVisible);
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: ['', Validators.required],
      [this.idNumberProperty]: ['', Validators.required],
      [this.hostname]: ['', Validators.required],
      [this.typeProperty]: [null, Validators.required],
      [this.userNameProperty]: [null, Validators.required],
      [this.vendorProperty]: [null, Validators.required],
      [this.tagsProperty]: [null],
      [this.externalIdProperty]: [null]
    });
  }

  fillData(): DcuForm {
    const formData: DcuForm = {
      id: null,
      name: this.form.get(this.nameProperty).value,
      serialNumber: this.form.get(this.idNumberProperty).value,
      hostname: this.form.get(this.hostname).value,
      tags: this.form.get(this.tagsProperty).value,
      type: this.form.get(this.typeProperty).value,
      manufacturer: this.form.get(this.vendorProperty).value,
      externalId: this.form.get(this.externalIdProperty).value
    };

    if (this.credentialsVisible) {
      formData.userName = this.form.get(this.userNameProperty).value;
    }

    return formData;
  }

  prepareAddedDcu(newId: string): DataConcentratorUnitsList {
    const formData = this.fillData();
    const data: DataConcentratorUnitsList = {
      concentratorId: newId,
      externalId: formData.externalId,
      name: formData.name,
      type: formData.type.value,
      vendor: formData.manufacturer.value,
      id: formData.serialNumber,
      hostname: formData.hostname,
      jobStatus: '',
      lastCommunication: '',
      meters: 0,
      metersPercent: 0,
      metersUp: false,
      readStatusColor: '',
      readStatusTimeStamp: '',
      status: 'INACTIVE',
      tags: null,
      hasActiveJob: true
    };

    return data;
  }

  save(addNew: boolean) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const dcuFormData = this.fillData();
    const request = this.dcuService.createDcu(dcuFormData);
    const successMessage = this.translate.instant('DCU.DCU-ADDED-SUCCESSFULLY');

    const selectedRows = this.jobsSelectGridService.getSessionSettingsSelectedRows();
    try {
      this.formUtils.saveForm(this.form, request, '').subscribe(
        (result) => {
          if (result) {
            this.eventService.addNewDcuToList(this.prepareAddedDcu(result));
            this.loading = false;
            if (selectedRows && selectedRows.length > 0) {
              this.jobsService.createDeviceJobs(result, selectedRows).subscribe(
                () => {
                  this.showSuccessAndTryCloseForm(successMessage, addNew);
                },
                (errResult) => {
                  const resultErrMessage = errResult.error ? errResult.error : null;
                  const errMessage = this.translate.instant('DCU.ERROR-SCHEDULER', { errorMessage: resultErrMessage });
                  this.loading = false;
                  this.toast.successToast(successMessage);
                  this.toast.errorToast(errMessage);

                  console.log('errResult block on error');
                  this.closeOrResetForm(addNew);
                }
              );
            } else {
              this.tabstrip.selectTab(0);
              this.showSuccessAndTryCloseForm(successMessage, addNew);
            }
          }
        },
        (errResult) => {
          console.log('this.tabstrip', this.tabstrip);
          this.saveError = errResult && errResult.error ? errResult.error[0] : null;
          this.tabstrip.selectTab(0);
          this.loading = false;
        } // error
      );
    } catch (error) {
      this.loading = false;
      this.tabstrip.selectTab(0);
    }
  }

  showSuccessAndTryCloseForm(successMessage: string, addNew: boolean) {
    this.toast.successToast(successMessage);
    this.closeOrResetForm(addNew);
  }

  closeOrResetForm(addNew: boolean) {
    if (addNew) {
      this.form.reset();
      this.tabstrip.selectTab(0);

      this.jobsSelectGridService.clearSessionSettingsSelectedRows();
      this.jobsSelect.selectRows();
    } else {
      this.modal.close();
    }
  }

  cancel() {
    this.eventService.layoutChange(null);
    this.modal.close();
  }

  onDismiss() {
    this.modal.dismiss();
  }

  public onVendorChanged(value) {
    this.form.get(this.vendorProperty).setValue(value);
  }

  public onTypeChanged(value) {
    this.form.get(this.typeProperty).setValue(value);
    if (value && value.id) {
      // Credentials are visible just for AC750
      this.credentialsVisible = value.id === 2;
    }

    this.setCredentialsControls(this.credentialsVisible);
  }

  setCredentialsControls(credentialsVisible: boolean) {
    // Disable fields just for form validation. Disabled fields are also not validated in custom matchPasswordsValidator.
    if (credentialsVisible) {
      this.form.get(this.userNameProperty).enable();
      this.form.get(this.passwordProperty).enable();
      this.form.get(this.confirmPasswordProperty).enable();
    } else {
      this.form.get(this.userNameProperty).disable();
      this.form.get(this.passwordProperty).disable();
      this.form.get(this.confirmPasswordProperty).disable();
    }
  }

  public onTabSelect(e) {
    this.jobsSelect.sizeColumnsToFit();
  }

  validateHostname() {
    const request: ValidateHostnameRequest = {
      hostname: this.form.get(this.hostname).value
    };
    this.dcuService.validateHostname(request).subscribe((isValid) => {
      if (!isValid) {
        this.form.get(this.hostname).setErrors({ invalidHostname: true });
      }
    });
  }
}

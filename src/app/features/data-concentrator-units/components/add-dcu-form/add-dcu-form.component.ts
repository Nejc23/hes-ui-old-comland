import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DcuForm } from '../../interfaces/dcu-form.interface';
import { Observable } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { JobsSelectComponent } from 'src/app/features/jobs/jobs-select/components/jobs-select.component';
@Component({
  selector: 'app-add-dcu-form',
  templateUrl: './add-dcu-form.component.html'
})
export class AddDcuFormComponent implements OnInit {
  form: FormGroup;

  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  dcuVendors: Codelist<number>[];
  dcuTags$: Observable<Codelist<number>[]>;
  saveError: string;

  public credentialsVisible = false;

  gridApi;

  @ViewChild(JobsSelectComponent) jobsSelect: JobsSelectComponent;
  @ViewChild(TabStripComponent) public tabstrip: TabStripComponent;

  getTabTitleBasic = $localize`Basic`;
  getTabTitleJobs = $localize`Jobs`;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private jobsService: JobsService,
    private toast: ToastNotificationService,
    private jobsSelectGridService: JobsSelectGridService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();

    this.dcuVendors$.subscribe((values) => {
      this.dcuVendors = values;
    });

    this.dcuTags$ = this.codelistService.dcuTagCodelist();
    this.setCredentialsControls(this.credentialsVisible);
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: ['', Validators.required],
      [this.idNumberProperty]: ['', Validators.required],
      [this.ipProperty]: ['', [Validators.required, Validators.pattern(/(\d{1,3}\.){3}\d{1,3}/)]],
      [this.typeProperty]: [null, Validators.required],
      [this.userNameProperty]: [null, Validators.required],
      [this.vendorProperty]: [null, Validators.required],
      [this.tagsProperty]: [null]
    });
  }

  fillData(): DcuForm {
    const formData: DcuForm = {
      id: null,
      name: this.form.get(this.nameProperty).value,
      serialNumber: this.form.get(this.idNumberProperty).value,
      ip: this.form.get(this.ipProperty).value,
      tags: this.form.get(this.tagsProperty).value,
      type: this.form.get(this.typeProperty).value,
      manufacturer: this.form.get(this.vendorProperty).value
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
      name: formData.name,
      type: formData.type.value,
      vendor: formData.manufacturer.value,
      id: formData.serialNumber,
      ip: formData.ip,
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
    const dcuFormData = this.fillData();
    const request = this.dcuService.createDcu(dcuFormData);

    const successMessage = $localize`Data Concentration Unit was added successfully`;

    const selectedRows = this.jobsSelectGridService.getSessionSettingsSelectedRows();
    try {
      this.formUtils.saveForm(this.form, request, '').subscribe(
        (result) => {
          if (result) {
            this.eventService.addNewDcuToList(this.prepareAddedDcu(result));

            if (selectedRows && selectedRows.length > 0) {
              this.jobsService.createDeviceJobs(result, selectedRows).subscribe(
                () => {
                  this.showSuccessAndTryCloseForm(successMessage, addNew);
                },
                (errResult) => {
                  const resultErrMessage = errResult.error ? errResult.error : null;
                  const errMessage = $localize`Error adding scheduler.` + ` ` + resultErrMessage;

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
        } // error
      );
    } catch (error) {
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

  get nameProperty() {
    return nameOf<DcuForm>((o) => o.name);
  }

  get idNumberProperty() {
    return nameOf<DcuForm>((o) => o.serialNumber);
  }

  get ipProperty() {
    return nameOf<DcuForm>((o) => o.ip);
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

  onDismiss() {
    this.modal.dismiss();
  }

  public onVendorChanged(value) {
    this.form.get(this.vendorProperty).setValue(value);
  }

  public onTypeChanged(value) {
    this.form.get(this.typeProperty).setValue(value);
    if (value && value.id) {
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
}

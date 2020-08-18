import { ScheduleDevice } from 'src/app/core/repository/interfaces/jobs/schedule-device.interface';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { EnsureModuleLoadedOnceGuard } from './../../../../core/ensureModuleLoadedOnceGuard';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DcuForm } from '../../interfaces/dcu-form.interface';
import { Observable } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import * as moment from 'moment';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { matchPasswordsValidator } from 'src/app/shared/validators/passwords-match-validator';

@Component({
  selector: 'app-add-dcu-form',
  templateUrl: './add-dcu-form.component.html'
})
export class AddDcuFormComponent implements OnInit {
  form: FormGroup;

  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  dcuTags$: Observable<Codelist<number>[]>;
  saveError: string;
  discoveryJobs: Codelist<string>[];

  public credentialsVisible = false;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private jobsService: JobsService,
    private toast: ToastNotificationService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();
    this.dcuTags$ = this.codelistService.dcuTagCodelist();
    this.codelistService.jobsDiscoveryJobsCodelist().subscribe(
      dj => {
        this.discoveryJobs = dj.map(j => ({ id: j.id, value: `${j.value} - ${moment(j.nextRun).fromNow()}` }));
      },
      () => {} // error
    );

    this.setCredentialsControls(this.credentialsVisible);
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.nameProperty]: ['', Validators.required],
        [this.idNumberProperty]: ['', Validators.required],
        [this.ipProperty]: ['', [Validators.required, Validators.pattern(/(\d{1,3}\.){3}\d{1,3}/)]],
        [this.typeProperty]: [null, Validators.required],
        [this.userNameProperty]: [null, Validators.required],
        [this.passwordProperty]: [null],
        [this.confirmPasswordProperty]: [null],
        [this.vendorProperty]: [null, Validators.required],
        [this.discoveryJobProperty]: [null],
        [this.tagsProperty]: [null]
      },
      { updateOn: 'blur', validators: matchPasswordsValidator(this.passwordProperty, this.confirmPasswordProperty) }
    );
  }

  fillData(): DcuForm {
    const formData: DcuForm = {
      id: null,
      name: this.form.get(this.nameProperty).value,
      idNumber: this.form.get(this.idNumberProperty).value,
      ip: this.form.get(this.ipProperty).value,
      tags: this.form.get(this.tagsProperty).value,
      type: this.form.get(this.typeProperty).value,
      vendor: this.form.get(this.vendorProperty).value
    };

    if (this.credentialsVisible) {
      formData.userName = this.form.get(this.userNameProperty).value;
      formData.password = this.form.get(this.passwordProperty).value;
    }

    const selectedDiscoveryJob = this.form.get(this.discoveryJobProperty).value as Codelist<string>;
    if (selectedDiscoveryJob) {
      formData.discoveryJob = selectedDiscoveryJob;
    }

    return formData;
  }

  prepareAddedDcu(newId: string): DataConcentratorUnitsList {
    const formData = this.fillData();
    const data: DataConcentratorUnitsList = {
      concentratorId: newId,
      name: formData.name,
      type: formData.type.value,
      vendor: formData.vendor.value,
      id: formData.idNumber,
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
    console.log('Save clicked!');

    const dcuFormData = this.fillData();
    const request = this.dcuService.createDcu(dcuFormData);

    const successMessage = this.i18n(`Data Concentration Unit was added successfully`);

    try {
      this.formUtils.saveForm(this.form, request, '').subscribe(
        result => {
          if (result) {
            this.eventService.addNewDcuToList(this.prepareAddedDcu(result));

            if (dcuFormData.discoveryJob && dcuFormData.discoveryJob.id) {
              this.jobsService.createScheduleDevice(result, dcuFormData.discoveryJob.id).subscribe(
                () => {
                  this.showSuccessAndTryCloseForm(successMessage, addNew);
                },
                errResult => {
                  console.log('Error adding ScheduleDevice: ', errResult);
                  const resultErrMessage = errResult.error ? errResult.error : null;
                  const errMessage = this.i18n('Error adding new Schedule Device. ') + resultErrMessage;

                  this.toast.successToast(successMessage);
                  this.toast.errorToast(errMessage);

                  this.closeOrResetForm(addNew);
                }
              );
            } else {
              this.showSuccessAndTryCloseForm(successMessage, addNew);
            }
          }
        },
        errResult => {
          console.log('Error saving form: ', errResult);
          this.saveError = errResult && errResult.error ? errResult.error[0] : null;
        } // error
      );
    } catch (error) {
      console.log('Add-DCU Form Error:', error);
    }
  }

  showSuccessAndTryCloseForm(successMessage: string, addNew: boolean) {
    this.toast.successToast(successMessage);
    this.closeOrResetForm(addNew);
  }

  closeOrResetForm(addNew: boolean) {
    if (addNew) {
      this.form.reset();
    } else {
      this.modal.close();
    }
  }

  cancel() {
    this.eventService.layoutChange(null);
    this.modal.close();
  }

  get nameProperty() {
    return nameOf<DcuForm>(o => o.name);
  }

  get idNumberProperty() {
    return nameOf<DcuForm>(o => o.idNumber);
  }

  get ipProperty() {
    return nameOf<DcuForm>(o => o.ip);
  }

  get userNameProperty() {
    return nameOf<DcuForm>(o => o.userName);
  }

  get passwordProperty() {
    return nameOf<DcuForm>(o => o.password);
  }

  get confirmPasswordProperty() {
    return nameOf<DcuForm>(o => o.confirmPassword);
  }

  get typeProperty() {
    return nameOf<DcuForm>(o => o.type);
  }

  get vendorProperty() {
    return nameOf<DcuForm>(o => o.vendor);
  }

  get discoveryJobProperty() {
    return nameOf<DcuForm>(o => o.discoveryJob);
  }

  get tagsProperty() {
    return nameOf<DcuForm>(o => o.tags);
  }

  // public credentialsVisible(refControl): boolean
  // {
  //   console.log('refControl', refControl);

  //   const typeValue = this.form.get(this.typeProperty).value;
  //   let ctrVisible = false;

  //   console.log('credentialsVisible, typeValue=', typeValue);

  //   if (typeValue !== null && typeValue.id !== undefined)
  //   {
  //     ctrVisible = typeValue.id === 2;
  //   }

  //   console.log('credentialsVisible=', ctrVisible);
  //   return ctrVisible;
  // }

  onDismiss() {
    this.modal.dismiss();
  }

  public onTypeChanged(value) {
    if (value !== null && value.id) {
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
}

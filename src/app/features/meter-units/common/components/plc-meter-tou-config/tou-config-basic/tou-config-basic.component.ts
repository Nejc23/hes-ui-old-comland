import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { EventManagerService } from 'src/app/core/services/event-manager.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TouWizardMode } from 'src/app/enums/tou-configuration/TouWizardModeEnum';
import { TouConfigurationHelper } from 'src/app/features/helpers/tou-configuration.helper';
import { UnsavedChangesModal } from 'src/app/features/helpers/unsaved-changes-modal';
import { TouBasicConfigurationClient } from 'src/app/models/tou-configuration/TouBasicConfigurationClient';
import { TouConfigService } from '../../../services/tou-config.service';
import { StepModel, TouWizardService } from '../../../services/wizard.service';
import { TouConfigErrorHandler } from '../tou-config-error-handler/tou-config-error-handler';

@Component({
  selector: 'app-tou-config-basic',
  templateUrl: './tou-config-basic.component.html',
  styleUrls: ['./tou-config-basic.component.scss']
})
export class TouConfigBasicComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  datePickerForm: FormGroup;

  tomorrow = moment().add(1, 'day').startOf('day').toDate();

  unSaved = true;
  editMode = false;

  constructor(
    private wizardService: TouWizardService,
    private fb: FormBuilder,
    private touService: TouConfigService,
    private translate: TranslateService,
    private eventsService: EventManagerService,
    private touConfigHelper: TouConfigurationHelper,
    private toast: ToastNotificationService,
    private touConfigErrorHelper: TouConfigErrorHandler,
    private unsavedChangesModal: UnsavedChangesModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.touService.getTouConfig().basic.id, this.isEditMode() ? Validators.required : null],
      externalId: [this.touService.getTouConfig().basic.externalId, Validators.required],
      description: [this.touService.getTouConfig().basic.description, Validators.required],
      activationDate: [this.touService.getTouConfig().basic.activationEnabled]
    });
    this.datePickerForm = this.fb.group({
      startDate: [
        this.touService.getTouConfig().basic.startDate
          ? moment(this.touService.getTouConfig().basic.startDate).add('hour', 1).set('minutes', 0).toDate()
          : this.tomorrow,
        Validators.required
      ],
      endDate: [
        this.touService.getTouConfig().basic.startDate
          ? moment(this.touService.getTouConfig().basic.startDate).add('hour', 1).set('minutes', 0).toDate()
          : this.tomorrow,
        Validators.required
      ],
      activationEnabled: [
        this.touService.getTouConfig().basic.activationEnabled ? this.touService.getTouConfig().basic.activationEnabled : false
      ]
    });

    // Set TOU Wizard step initial completeness states (check-mark or red circle in the wizard navigation menu)
    // In edit mode mark all steps are completed so they will be clickable
    if (this.isEditMode()) {
      this.eventsService.emitCustom('EnableAllWizardSteps', true);
    } else {
      const touConfig = this.touService.getTouConfig();
      this.updateWizardStepCompleteness(
        2,
        touConfig.days?.units.length > 0 &&
          touConfig.days?.units.filter((x) => x.units && x.units.length > 0 && x.externalId && x.description).length ===
            touConfig.days.units.length
      );
      this.updateWizardStepCompleteness(
        3,
        touConfig.weeks?.units.length > 0 &&
          touConfig.weeks?.units.filter((x) => x.units && x.units.length > 0 && x.externalId && x.description).length ===
            touConfig.weeks.units.length
      );
      this.updateWizardStepCompleteness(
        4,
        touConfig.seasons?.units.length > 0 &&
          touConfig.seasons?.units.filter((x) => x.units && x.units.length > 0 && x.externalId && x.description).length ===
            touConfig.seasons.units.length
      );
    }
  }

  ngAfterViewInit() {
    if (this.isEditMode()) {
      if (this.form.get('externalId').errors) {
        this.form.get('externalId').markAsDirty(); // show error on tou id
      }
      if (this.datePickerForm.get('startDate').errors) {
        this.datePickerForm.get('startDate').markAsDirty(); // show error on dt picker
      }
    }
  }

  updateBasic() {
    const basicData = this.getBasicDataFromForm();
    const updateDto = this.touConfigHelper.castTouConfigClientBasicToConfigUpdateDto(basicData);

    this.touService.updateBasicConfiguration(this.touService.touConfigurationClient.basic.id, updateDto).subscribe(
      () => {
        this.touService.touConfigurationClient.basic = basicData;
        this.form.markAsPristine();
        this.datePickerForm.markAsPristine();
        this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
      },
      (err: HttpErrorResponse) => {
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  nextStep() {
    if (this.isEditMode()) {
      this.navigateToNextStep();
    } else {
      this.saveAndNavigateToNextStep();
    }
  }

  saveAndNavigateToNextStep() {
    const basicData = this.getBasicDataFromForm();
    this.touService.saveBasicStep(basicData);
    this.navigateToNextStep();
  }

  navigateToNextStep() {
    this.wizardService.setCurrentStep({ stepIndex: 1, completed: true });
    this.wizardService.moveToNextStep();
  }

  getBasicDataFromForm(): TouBasicConfigurationClient {
    const basicData: TouBasicConfigurationClient = {
      id: this.form.get('id').value,
      externalId: this.form.get('externalId').value,
      description: this.form.get('description').value,
      activationEnabled: this.datePickerForm.get('activationEnabled')?.value ?? false,
      startDate: ''
    };
    if (basicData.activationEnabled) {
      basicData.startDate = this.datePickerForm.get('startDate')?.value ?? '';
    }

    return basicData;
  }

  isActivationDateEnabled() {
    return this.datePickerForm.get('activationEnabled').value === true;
  }

  isEditMode() {
    return this.touService.touWizardMode == TouWizardMode.EDIT;
  }

  onDatePickerValueChange() {
    this.datePickerForm.markAsDirty();
  }

  isValid() {
    let isFormValid = this.form.valid;
    if (this.isActivationDateEnabled()) {
      isFormValid = isFormValid && this.datePickerForm.valid;
    }
    this.updateWizardStepCompleteness(1, isFormValid);
    return isFormValid;
  }

  hasUnsavedChanges() {
    return this.isEditMode() && (this.form.dirty || this.datePickerForm.dirty);
  }

  updateBasicTitle() {
    if (!this.hasUnsavedChanges()) {
      return 'TOU-CONFIG.NO-CHANGES';
    }
    return '';
  }

  updateWizardStepCompleteness(stepIndex: number, completed: boolean) {
    const step: StepModel = {
      stepIndex: stepIndex,
      completed: completed
    };
    this.eventsService.emitCustom('UpdateWizardStepCompleteness', step);
  }

  canDeactivate(): Promise<any> | boolean {
    if (this.hasUnsavedChanges()) {
      return this.unsavedChangesModal.showModal((): void => {});
    } else {
      return true;
    }
  }
}

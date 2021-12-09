import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { EventManagerService } from 'src/app/core/services/event-manager.service';
import { TouBasicConfigurationClient, TouConfigService } from '../../../services/tou-config.service';
import { StepModel, TouWizardService } from '../../../services/wizard.service';
import { of } from 'rxjs';
import { ModalConfirmComponent } from '../../../../../../shared/modals/components/modal-confirm.component';
import { ModalService } from '../../../../../../core/modals/services/modal.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tou-config-basic',
  templateUrl: './tou-config-basic.component.html',
  styleUrls: ['./tou-config-basic.component.scss']
})
export class TouConfigBasicComponent implements OnInit {
  form: FormGroup;
  datePickerForm: FormGroup;

  tomorrow = moment().add(1, 'day').set('minute', 0).set('hour', 0).set('second', 0).toDate();
  unSaved = true;
  editMode = false;

  constructor(
    private wizardService: TouWizardService,
    private fb: FormBuilder,
    private touService: TouConfigService,
    private modalService: ModalService,
    private translate: TranslateService,
    private eventsService: EventManagerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.touService.getTouConfig().basic.id, Validators.required],
      description: [this.touService.getTouConfig().basic.description, Validators.required],
      activationDate: [this.touService.getTouConfig().basic.activationEnabled]
    });
    this.datePickerForm = this.fb.group({
      startDate: [
        this.touService.getTouConfig().basic.startDate
          ? moment(this.touService.getTouConfig().basic.startDate).set('hour', 1).toDate()
          : this.tomorrow,
        Validators.required
      ],
      endDate: [
        this.touService.getTouConfig().basic.startDate
          ? moment(this.touService.getTouConfig().basic.startDate).set('hour', 1).toDate()
          : this.tomorrow,
        Validators.required
      ],
      activationEnabled: [
        this.touService.getTouConfig().basic.activationEnabled ? this.touService.getTouConfig().basic.activationEnabled : false
      ]
    });

    // Set TOU Wizard steps initial state for completeness
    const touConfig = this.touService.getTouConfig();
    this.updateWizardStepCompleteness(
      2,
      touConfig.days?.units.length > 0 && touConfig.days?.units.filter((x) => x.unit && x.unit.length > 0).length > 0
    );
    this.updateWizardStepCompleteness(
      3,
      touConfig.weeks?.units.length > 0 && touConfig.weeks?.units.filter((x) => x.unit && x.unit.length > 0).length > 0
    );
    this.updateWizardStepCompleteness(
      4,
      touConfig.seasons?.units.length > 0 && touConfig.seasons?.units.filter((x) => x.unit && x.unit.length > 0).length > 0
    );
    this.updateWizardStepCompleteness(5, touConfig.specialDays?.length > 0);
  }

  nextStep() {
    const basicData: TouBasicConfigurationClient = {
      id: this.form.get('id').value,
      description: this.form.get('description').value,
      startDate: this.datePickerForm.get('activationEnabled').value ? this.datePickerForm.get('startDate').value : '',
      activationEnabled: this.datePickerForm.get('activationEnabled').value
    };
    this.touService.saveBasicStep(basicData);
    this.wizardService.setCurrentStep({ stepIndex: 1, completed: true });
    this.wizardService.moveToNextStep();
  }

  isActivationDateEnabled() {
    return this.datePickerForm.get('activationEnabled').value === true;
  }

  isValid() {
    let isFormValid = this.form.valid;
    if (this.isActivationDateEnabled()) {
      isFormValid = isFormValid && this.datePickerForm.valid;
    }
    this.updateWizardStepCompleteness(1, isFormValid);
    return isFormValid;
  }

  updateWizardStepCompleteness(stepIndex: number, completed: boolean) {
    const step: StepModel = {
      stepIndex: stepIndex,
      completed: completed
    };
    this.eventsService.emitCustom('UpdateWizardStepCompleteness', step);
  }

  canDeactivate(): Promise<any> | boolean {
    if (this.editMode) {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;

      component.modalTitle = this.translate.instant('TOU-CONFIG.LEAVE-PAGE');
      component.modalBody = this.translate.instant('TOU-CONFIG.LEAVE-PAGE-TEXT');

      return of(
        modalRef.result.then(() => {
          return true;
        })
      ).toPromise();
    } else {
      return true;
    }
  }
}

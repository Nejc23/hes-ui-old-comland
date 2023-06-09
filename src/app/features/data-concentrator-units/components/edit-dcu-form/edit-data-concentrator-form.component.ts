import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DcuForm, EditDcuForm } from '../../interfaces/dcu-form.interface';
import { Subscription } from 'rxjs';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidateHostnameRequest } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-update-request.interface';
import { EventManagerService } from '../../../../core/services/event-manager.service';

@Component({
  selector: 'app-edit-data-concentrator-form',
  templateUrl: './edit-data-concentrator-form.component.html'
})
export class EditDataConcentratorFormComponent implements OnDestroy {
  @Input() form: FormGroup;
  @Input() concentratorId = '';
  @Output() savedDataEvent = new EventEmitter<boolean>();
  @Input() saveData = false;

  saveError: string;
  subscription: Subscription;

  @Input() credentialsVisible = false;
  opened = false;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    private formUtils: FormsUtilsService,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private translate: TranslateService,
    private eventsService: EventManagerService
  ) {
    this.subscription = this.eventsService.getCustom('EditConcentratorButtonClicked').subscribe(() => {
      this.saveDcu();
    });
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

  get statusProperty() {
    return nameOf<DcuForm>((o) => o.status);
  }

  get vendorProperty() {
    return nameOf<DcuForm>((o) => o.manufacturer);
  }

  get tagsProperty() {
    return nameOf<DcuForm>((o) => o.tags);
  }

  fillData(): EditDcuForm {
    const formData: EditDcuForm = {
      id: this.concentratorId,
      externalId: this.form.get(this.externalIdProperty).value,
      name: this.form.get(this.nameProperty).value,
      serialNumber: this.form.get(this.idNumberProperty).value,
      hostname: this.form.get(this.hostname).value,
      manufacturer: this.form.get(this.vendorProperty).value
    };
    if (this.credentialsVisible) {
      formData.userName = this.form.get(this.userNameProperty).value;
    }
    return formData;
  }

  saveDcu() {
    const dcuFormData = this.fillData();
    const request = this.dcuService.updateDcu(this.concentratorId, dcuFormData);
    const successMessage = this.translate.instant('DCU.DCU-UPDATED-SUCCESSFULLY');

    try {
      this.formUtils.saveForm(this.form, request, successMessage).subscribe(
        (result) => {
          if (result) {
            this.savedDataEvent.emit(true);
          }
        },
        (errResult) => {
          console.log('Error saving form: ', errResult);
          this.saveError = errResult && errResult.error ? errResult.error[0] : null;
        }
      );
    } catch (error) {
      console.log('Edit-DCU Form Error:', error);
    }
  }

  toggle() {
    this.opened = !this.opened;
  }

  validateHostname() {
    const request: ValidateHostnameRequest = {
      hostname: this.form.get(this.hostname).value
    };

    if (request.hostname) {
      this.dcuService.validateHostname(request).subscribe((isValid) => {
        if (!isValid) {
          this.form.get(this.hostname).setErrors({ invalidHostname: true });
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DcuForm, EditDcuForm } from '../../interfaces/dcu-form.interface';
import { Observable } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { JobsSelectComponent } from 'src/app/features/jobs/jobs-select/components/jobs-select.component';

@Component({
  selector: 'app-edit-dcu-form',
  templateUrl: './edit-dcu-form.component.html'
})
export class EditDcuFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() concentratorId = '';

  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  dcuVendors: Codelist<number>[];
  dcuTags$: Observable<Codelist<number>[]>;
  saveError: string;

  @Input() credentialsVisible = false;

  @ViewChild(JobsSelectComponent) jobsSelect: JobsSelectComponent;
  @ViewChild(TabStripComponent) public tabstrip: TabStripComponent;

  opened = false;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private eventService: DataConcentratorUnitsGridEventEmitterService
  ) {}

  ngOnInit() {
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();

    this.dcuVendors$.subscribe((values) => {
      this.dcuVendors = values;
    });

    this.dcuTags$ = this.codelistService.dcuTagCodelist();
  }

  fillData(): EditDcuForm {
    const formData: EditDcuForm = {
      id: this.concentratorId,
      externalId: this.form.get(this.externalIdProperty).value,
      name: this.form.get(this.nameProperty).value,
      serialNumber: this.form.get(this.idNumberProperty).value,
      ip: this.form.get(this.ipProperty).value,
      port: this.form.get(this.portProperty).value,
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
    const successMessage = $localize`Data Concentration Unit was updated successfully`;

    try {
      this.formUtils.saveForm(this.form, request, successMessage).subscribe(
        (result) => {
          if (result) {
            this.modal.close();
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

  get externalIdProperty() {
    return nameOf<DcuForm>((o) => o.externalId);
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

  get statusProperty() {
    return nameOf<DcuForm>((o) => o.status);
  }

  get vendorProperty() {
    return nameOf<DcuForm>((o) => o.manufacturer);
  }

  get tagsProperty() {
    return nameOf<DcuForm>((o) => o.tags);
  }

  get portProperty() {
    return nameOf<DcuForm>((o) => o.port);
  }

  onDismiss() {
    this.modal.dismiss();
  }

  toggle() {
    this.opened = !this.opened;
  }
}
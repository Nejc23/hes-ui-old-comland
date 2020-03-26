import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-add-dcu-form',
  templateUrl: './add-dcu-form.component.html'
})
export class AddDcuFormComponent implements OnInit {
  form: FormGroup;

  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  dcuTags$: Observable<Codelist<number>[]>;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private eventService: DataConcentratorUnitsGridEventEmitterService
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();
    this.dcuTags$ = this.codelistService.dcuTagCodelist();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: ['', Validators.required],
      [this.idNumberProperty]: ['', Validators.required],
      [this.ipProperty]: ['', Validators.required],
      [this.typeProperty]: [null, Validators.required],
      [this.vendorProperty]: [null, Validators.required],
      [this.tagsProperty]: [null]
    });
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
    return formData;
  }

  save(addNew: boolean) {
    console.log('Save clicked!');
    this.formUtils.touchElementsAndValidate(this.form).subscribe(result => {
      if (result) {
        this.dcuService.createDcu(this.fillData());
        if (addNew) {
          this.form.reset();
        }
      }
    });
  }

  cancel() {
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

  get typeProperty() {
    return nameOf<DcuForm>(o => o.type);
  }

  get vendorProperty() {
    return nameOf<DcuForm>(o => o.vendor);
  }

  get tagsProperty() {
    return nameOf<DcuForm>(o => o.tags);
  }

  onDismiss() {
    this.modal.dismiss();
  }
}

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

  save() {
    console.log('Save clicked!');
    // TODO
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

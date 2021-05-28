import { PermissionService } from 'src/app/core/permissions/services/permission.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { DcuForm } from '../../interfaces/dcu-form.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { Observable } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { ActivatedRoute } from '@angular/router';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnit } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-unit.interface';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { ModalService } from '../../../../core/modals/services/modal.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EditDcuFormComponent } from '../../components/edit-dcu-form/edit-dcu-form.component';

@Component({
  selector: 'app-data-concentrator-detail',
  templateUrl: './data-concentrator-detail.component.html'
})
export class DataConcentratorDetailComponent implements OnInit, OnDestroy {
  form: FormGroup;
  editForm: FormGroup;

  saveError: string;
  edit = false;
  public credentialsVisible = false;
  concentratorId = '';
  data: DataConcentratorUnit;

  dcuStatuses$: Observable<Codelist<number>[]>;
  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private formUtils: FormsUtilsService,
    private codelistService: CodelistRepositoryService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private breadcrumbService: BreadcrumbService,
    private permissionService: PermissionService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setPageName($localize`Data concentrator unit`);
    this.concentratorId = this.route.snapshot.paramMap.get('id');
    this.dcuStatuses$ = this.codelistService.dcuStatusCodelist();
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();

    // get DCU
    this.getData();
  }

  ngOnDestroy() {}

  getData() {
    if (this.concentratorId.length > 0) {
      this.dataConcentratorUnitsService.getDataConcentratorUnit(this.concentratorId).subscribe((response: DataConcentratorUnit) => {
        this.data = response;
        this.form = this.createForm();
        this.editForm = this.createEditForm();
        this.credentialsVisible = this.data && this.data.typeId === 2;
        this.setCredentialsControls(this.credentialsVisible);
      });
    } else {
      this.form = this.createForm();
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.nameProperty]: [this.data ? this.data.name : null, Validators.required],
        [this.serialNumberProperty]: [this.data ? this.data.serialNumber : null, Validators.required],
        [this.externalIdProperty]: [this.data ? this.data.externalId : null],
        [this.statusProperty]: [this.data ? { id: this.data.statusId, value: this.data.statusValue } : null, [Validators.required]],
        [this.typeProperty]: [
          this.data && this.data.typeId > 0 ? { id: this.data.typeId, value: this.data.typeValue } : null,
          [Validators.required]
        ],
        [this.vendorProperty]: [this.data ? { id: this.data.manufacturerId, value: this.data.manufacturerValue } : null],
        [this.ipProperty]: [this.data ? this.data.ip : null],
        [this.portProperty]: [this.data ? this.data.port : null],
        [this.addressProperty]: [this.data ? this.data.address : null],
        [this.tagsProperty]: [this.data ? this.data.tags : null],
        [this.userNameProperty]: [this.data ? this.data.username : null],
        [this.macProperty]: [this.data ? this.data.mac : null]
      },
      { updateOn: 'blur' }
    );
  }

  createEditForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: [this.data ? this.data.name : null, Validators.required],
      [this.serialNumberProperty]: [this.data ? this.data.serialNumber : null, Validators.required],
      [this.externalIdProperty]: [this.data ? this.data.externalId : null],
      [this.typeProperty]: [this.data && this.data.typeId > 0 ? { id: this.data.typeId, value: this.data.typeValue } : null],
      [this.vendorProperty]: [this.data ? { id: this.data.manufacturerId, value: this.data.manufacturerValue } : null],
      [this.ipProperty]: [this.data ? this.data.ip : null],
      [this.portProperty]: [this.data ? this.data.port : null],
      [this.addressProperty]: [this.data ? this.data.address : null],
      [this.macProperty]: [this.data ? this.data.mac : null],
      [this.userNameProperty]: [this.data ? this.data.username : null]
    });
  }

  get nameProperty() {
    return nameOf<DcuForm>((o) => o.name);
  }

  get serialNumberProperty() {
    return nameOf<DcuForm>((o) => o.serialNumber);
  }

  get ipProperty() {
    return nameOf<DcuForm>((o) => o.ip);
  }

  get portProperty() {
    return nameOf<DcuForm>((o) => o.port);
  }

  get userNameProperty() {
    return nameOf<DcuForm>((o) => o.userName);
  }

  get typeProperty() {
    return nameOf<DcuForm>((o) => o.type);
  }

  get vendorProperty() {
    return nameOf<DcuForm>((o) => o.manufacturer);
  }

  get statusProperty() {
    return nameOf<DcuForm>((o) => o.status);
  }

  get addressProperty() {
    return nameOf<DcuForm>((o) => o.address);
  }

  get tagsProperty() {
    return nameOf<DcuForm>((o) => o.tags);
  }

  get macProperty() {
    return nameOf<DcuForm>((o) => o.mac);
  }

  get latitudeProperty() {
    return nameOf<DcuForm>((o) => o.latitude);
  }

  get longitudeProperty() {
    return nameOf<DcuForm>((o) => o.longitude);
  }

  get externalIdProperty() {
    return nameOf<DcuForm>((o) => o.externalId);
  }

  fillData(): DcuForm {
    const formData: DcuForm = {
      id: this.concentratorId,
      name: this.form.get(this.nameProperty).value,
      serialNumber: this.form.get(this.serialNumberProperty).value,
      externalId: this.form.get(this.externalIdProperty).value,
      ip: this.form.get(this.ipProperty).value,
      port: this.form.get(this.portProperty).value,
      tags: this.form.get(this.tagsProperty).value,
      type: this.form.get(this.typeProperty).value,
      manufacturer: this.form.get(this.vendorProperty).value,
      status: this.form.get(this.statusProperty).value,
      mac: this.form.get(this.macProperty).value,
      address: this.form.get(this.addressProperty).value,
      latitude: null, // this.form.get(this.latitudeProperty).value,
      longitude: null // this.form.get(this.longitudeProperty).value,
    };

    if (this.credentialsVisible) {
      formData.userName = this.form.get(this.userNameProperty).value;
    }

    return formData;
  }

  editDcu() {
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef = this.modalService.open(EditDcuFormComponent, options);
    const component: EditDcuFormComponent = modalRef.componentInstance;
    component.concentratorId = this.concentratorId;
    component.form = this.editForm;
    component.credentialsVisible = this.credentialsVisible;

    modalRef.result
      .then((data) => {
        this.getData();
      })
      .catch(() => {});
  }

  saveDcu() {
    const dcuFormData = this.fillData();
    const request = this.dataConcentratorUnitsService.updateDcu(this.concentratorId, dcuFormData);
    const successMessage = $localize`Data Concentration Unit was updated successfully`;

    try {
      this.formUtils.saveForm(this.form, request, successMessage).subscribe(
        (result) => {
          if (result) {
            this.getData();
          }
        },
        (errResult) => {
          console.log('Error saving form: ', errResult);
          this.saveError = errResult && errResult.error ? errResult.error[0] : null;
        } // error
      );
    } catch (error) {
      console.log('Edit-DCU Form Error:', error);
    }
  }

  setCredentialsControls(credentialsVisible: boolean) {
    // Disable fields just for form validation. Disabled fields are also not validated in custom matchPasswordsValidator.
    if (credentialsVisible) {
      this.form.get(this.userNameProperty).enable();
    } else {
      this.form.get(this.userNameProperty).disable();
    }
  }

  get permissionEdit() {
    return PermissionEnumerator.Manage_Concentrators;
  }
}

import { OnInit, Component } from '@angular/core';

import ArrayStore from 'devextreme/data/array_store';
import { FilterFormService, DcuType, Status } from '../services/filter-form.service';
import { FormGroup, FormBuilder, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Observable, of } from 'rxjs';
import { DcuFilter } from '../../../interfaces/dcu-filter.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { data } from 'jquery';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html'
})
export class FilterFormComponent implements OnInit {
  form: FormGroup;
  items = ['Javascript', 'Typescript'];

  dcuStatuses$: Observable<Codelist<number>[]>;
  dcuStatuses: Codelist<number>[] = [];
  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  dcuFilters$: Observable<DcuFilter[]>;
  dcuTags$: Observable<Codelist<number>[]>;
  dcuTags: Codelist<number>[];

  currentStatuses: Codelist<number>[];
  currentTypes: Codelist<number>[];
  currentVendorId: number;
  currentTags: Codelist<number>[];

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    private tmpFilterService: FilterFormService,
    public fb: FormBuilder
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();
    this.dcuFilters$ = this.dcuService.getDcuFilter();
    this.dcuFilters$.subscribe(x => {
      // TODO: read selected filter from local storage
      this.form.get('filters').setValue(x);
      this.form.get(this.statusesProperty).setValue(x[1].statuses);
      this.form.get(this.typesProperty).setValue(x[1].types);
      this.form.get(this.tagsProperty).setValue(x[1].tags);
      this.form.get(this.vendorProperty).setValue(x[1].vendor);
    });

    this.dcuStatuses$ = this.codelistService.dcuStatusCodelist();
    this.dcuStatuses$.subscribe(y => (this.dcuStatuses = y));

    this.dcuTags$ = this.codelistService.dcuTagCodelist();
    this.dcuTags$.subscribe(y => (this.dcuTags = y));
  }

  createForm(): FormGroup {
    console.log('createForm()');
    return this.fb.group({
      ['statuses']: [[]],
      ['tags']: [[]],
      ['types']: [[]],
      ['filters']: [[]], //[this.data],
      ['vendor']: [null]
    });
  }

  get statusesProperty() {
    return 'statuses';
  }

  get tagsProperty() {
    return 'tags';
  }

  get typesProperty() {
    return 'types';
  }

  get filtersProperty() {
    return 'filters';
  }

  get vendorProperty() {
    return 'vendor';
  }

  save() {
    console.log(this.form.value);
  }

  change() {
    console.log(this.form.get('types').value);
  }
}

import { OnInit, Component } from '@angular/core';

import ArrayStore from 'devextreme/data/array_store';
import { FilterFormService, DcuType, Status, DcuFilter } from '../services/filter-form.service';
import { FormGroup, FormBuilder, FormArray, ValidatorFn, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html'
})
export class FilterFormComponent implements OnInit {
  form: FormGroup;
  dataSource: any;
  userId: number;

  items = ['Javascript', 'Typescript'];

  statuses: Status[] = [];

  dcuTypes$: DcuType[] = [];

  dcuFilters$: DcuFilter[] = [];

  tags = [
    { id: 1, value: 'tag5' },
    { id: 3, value: 'jru' }
  ];

  constructor(private service: FilterFormService, public fb: FormBuilder) {
    this.form = this.createForm();
    this.userId = 1; // TODO: get current user
    this.dataSource = new ArrayStore({
      data: service.getProducts(),
      key: 'Id'
    });
  }

  ngOnInit() {
    // this.form = this.createForm();
    this.statuses = this.service.getStatus();
    this.dcuTypes$ = this.service.getDcuTypes();
    this.dcuFilters$ = this.service.getDcuFilters(this.userId);
  }

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: [[]], // {value: 'Item1', id: 0, extra: 0}
      ['tag']: [[]],
      ['type']: [[]],
      ['types']: [[]],
      ['filters']: [[]]
    });
  }

  get searchProperty() {
    return 'content';
  }

  get tagProperty() {
    return 'tag';
  }

  get typesProperty() {
    return 'types';
  }

  save() {
    console.log(this.form.value);
  }

  change() {
    console.log(this.form.get('types').value);
  }
}

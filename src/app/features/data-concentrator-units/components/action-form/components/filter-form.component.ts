import { OnInit, Component } from '@angular/core';

import ArrayStore from 'devextreme/data/array_store';
import { FilterFormService, DcuType, Status } from '../services/filter-form.service';
import { FormGroup, FormBuilder, FormArray, ValidatorFn, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html'
})
export class FilterFormComponent implements OnInit {
  form: FormGroup;
  dataSource: any;

  items = ['Javascript', 'Typescript'];

  statuses: Status[] = [];

  dcuTypes$: DcuType[] = [];

  tags = [
    { id: 1, value: 'tag5' },
    { id: 3, value: 'jru' }
  ];

  constructor(private service: FilterFormService, public fb: FormBuilder) {
    this.form = this.createForm();
    this.dataSource = new ArrayStore({
      data: service.getProducts(),
      key: 'Id'
    });
  }

  ngOnInit() {
    //this.form = this.createForm();
    this.statuses = this.service.getStatus();
    this.dcuTypes$ = this.service.getDcuTypes();
  }

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: [[]], // {value: 'Item1', id: 0, extra: 0}
      ['tag']: [[]],
      ['type']: [[]],
      ['types']: [[]]
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

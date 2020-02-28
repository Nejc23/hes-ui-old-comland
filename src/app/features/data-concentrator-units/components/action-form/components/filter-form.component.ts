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

  dcuTypes: DcuType[] = [];

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
    this.dcuTypes = this.service.getDcuTypes();
    this.addCheckboxes();
  }

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: [[]], // {value: 'Item1', id: 0, extra: 0}
      ['tag']: [[]],
      ['type']: [[]],
      ['types']: new FormArray([], minSelectedCheckboxes(1))
    });
  }

  getControls() {
    return (this.form.get('types') as FormArray).controls;
  }

  private addCheckboxes() {
    this.dcuTypes.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.get('types') as FormArray).push(control);
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

  onCheckChanged($event: any) {
    console.log($event);
    //
  }
}

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls.map(control => control.value).reduce((prev, next) => (next ? prev + next : prev), 0);

    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}

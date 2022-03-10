import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { Codelist } from '../../../../../shared/repository/interfaces/codelists/codelist.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;
  form: FormGroup;
  // todo get from BE
  exportTypes: Codelist<number>[] = [
    { id: 1, value: 'CCB Billing 1' },
    { id: 2, value: 'CCB Billing  2' },
    { id: 3, value: 'CCB Billing  3' }
  ]; //this.translate.instant('')

  constructor(private formBuilder: FormBuilder) {
    this.form = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      exportType: this.exportTypes[0],
      location: '',
      upload: false,
      startDate: [moment().subtract(1, 'month').set('minute', 0).set('hours', 0).set('second', 0), Validators.required],
      endDate: [moment().set('minute', 0).set('hours', 0).set('second', 0), Validators.required]
    });
  }

  ngOnInit() {}

  dateChanged() {}
}

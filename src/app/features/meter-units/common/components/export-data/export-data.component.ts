import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {
  form: FormGroup;
  @Input() params;

  //todo get from BE + translate this.translate.instant('')
  exportTypes: Array<any> = [
    { id: 'CCB Billing 1', value: 'LP1: A+, LP1: A+_T0, LP1: A+_T1, LP1: A+_T2', apiId: 'CCB1' }, // apiId = jobId
    { id: 'CCB Billing 2', value: 'LP1: A+, LP1: A+_T0 ', apiId: 'CCB2' },
    { id: 'Monthly Billing 1', value: 'BV1: A+, BV1: A+_T0, BV1: A+_T1, BV1: A+_T2', apiId: 'MONTHLY' },
    { id: 'Events', value: 'All events for a given period', apiId: 'EVENTS' }
  ];

  constructor(private formBuilder: FormBuilder, private translate: TranslateService) {
    this.form = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      exportType: this.exportTypes[0], // jobId
      location: '',
      upload: false,
      startDate: [moment().subtract(1, 'month').set('minute', 0).set('hours', 0).set('second', 0), Validators.required],
      endDate: [moment().set('minute', 0).set('hours', 0).set('second', 0), Validators.required],
      startTime: ['00:00'],
      endTime: ['00:00']
    });
  }

  // id (jobId)
  // time range /  startDate -endData
  ngOnInit() {}

  dateChanged() {}
}

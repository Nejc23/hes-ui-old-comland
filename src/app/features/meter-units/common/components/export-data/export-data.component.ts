import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IActionRequestParams } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { environment } from 'src/environments/environment';
import { MyGridLinkService } from '../../../../../core/repository/services/myGridLink/myGridLink.service';

export interface ExportDataPayload extends IActionRequestParams {
  startDate: string;
  endDate: string;
  location?: string;
  upload: boolean;
  jobId: string;
}

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {
  form: FormGroup;
  @Input() params;
  payload: ExportDataPayload;
  //MOCK todo get from BE
  exportTypes: Array<any> = [];
  invalidRange = false;
  maxDateRange = environment.exportDataMaxRange;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private myGridService: MyGridLinkService,
    private modal: NgbActiveModal
  ) {
    this.form = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      exportType: [], // jobId
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
  ngOnInit() {
    this.myGridService.getDataExportJobs().subscribe((jobs) => {
      this.exportTypes = jobs
        .map((j) => {
          return { id: j.description, value: j.value, apiId: j.jobId };
        })
        .sort((a, b) => {
          return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        });

      if (this.exportTypes && this.exportTypes[0]) {
        this.form.controls['exportType'].setValue(this.exportTypes[0]);
      }
    });
  }

  dateChanged() {
    this.checkIfDatesValid(this.form.get('startDate').value, this.form.get('endDate').value);
  }

  onDismiss() {
    this.modal.dismiss();
  }

  onConfirm() {
    this.payload = {
      startDate: this.form.get('startDate').value,
      endDate: this.form.get('endDate').value,
      upload: this.form.get('upload').value,
      jobId: this.form.get('exportType').value.apiId,
      location: this.form.get('location').value,
      deviceIds: this.params.deviceIds,
      pageNumber: this.params.pageNumber,
      pageSize: this.params.pageSize,
      sort: this.params.sort,
      textSearch: this.params.textSearch,
      filter: this.params.filter
    };
    console.log('payload:');
    console.log(this.payload);
  }

  checkIfDatesValid(startDate: Date, endDate: Date) {
    this.invalidRange = moment(endDate).diff(moment(startDate), 'months', true) > this.maxDateRange;
    return this.invalidRange;
  }
}

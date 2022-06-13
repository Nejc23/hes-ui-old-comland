import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IActionRequestParams } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { environment } from 'src/environments/environment';
import { MyGridLinkService } from '../../../../../core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from '../../../../../core/toast-notification/services/toast-notification.service';
import { Observable } from 'rxjs';
import { dateServerFormat } from '../../../../../shared/forms/consts/date-format';

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
  exportTypes: Array<any> = [];
  reportTypes: Array<any> = []; // todo
  invalidRange = false;
  maxDateRange = environment.exportDataMaxRange;
  loading = false;
  reportTab = false;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private myGridService: MyGridLinkService,
    private modal: NgbActiveModal,
    private toast: ToastNotificationService
  ) {
    this.form = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      exportType: [], // jobId
      reportType: [],
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
    this.loading = true;
    this.getDataExportJobs();
  }

  dateChanged() {
    this.checkIfDatesValid(this.form.get('startDate').value, this.form.get('endDate').value);
  }

  onDismiss() {
    this.modal.dismiss();
  }

  onConfirm() {
    this.loading = true;
    const startDate = moment(this.form.controls.startDate.value, environment.dateDisplayFormat)
      .set('seconds', 0)
      .set('milliseconds', 0)
      .format(dateServerFormat);
    const endDate = moment(this.form.controls.endDate.value, environment.dateDisplayFormat)
      .set('seconds', 0)
      .set('milliseconds', 0)
      .format(dateServerFormat);

    this.payload = {
      startDate: startDate,
      endDate: endDate,
      upload: this.form.get('upload').value,
      jobId: !this.reportTab ? this.form.get('exportType').value.apiId : this.form.get('reportType').value.apiId,
      location: this.form.get('location').value,
      deviceIds: this.params.deviceIds,
      pageNumber: this.params.pageNumber,
      pageSize: this.params.pageSize,
      sort: this.params.sort,
      textSearch: this.params.textSearch,
      filter: this.params.filter
    };

    const response: Observable<any> = this.myGridService.triggerDataExportJob(this.payload);

    response.subscribe(
      (value) => {
        this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
        this.modal.dismiss();
        this.loading = false;
      },
      (e) => {
        this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
        this.loading = false;
      }
    );

    console.log('payload:');
    console.log(this.payload);
  }

  checkIfDatesValid(startDate: Date, endDate: Date) {
    this.invalidRange = moment(endDate).diff(moment(startDate), 'months', true) > this.maxDateRange;
    return this.invalidRange;
  }

  selectedTab(event: any) {
    this.reportTab = event.index === 1;
  }

  getDataExportJobs() {
    this.myGridService.getDataExportJobs().subscribe(
      (jobs) => {
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
        this.getDataReportJobs();
        this.loading = false;
      },
      (e) => {
        this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
        this.loading = false;
      }
    );
  }

  getDataReportJobs() {
    this.myGridService.getDataExportJobs(false).subscribe(
      (jobs) => {
        this.reportTypes = jobs
          .map((j) => {
            return { id: j.description, value: j.value, apiId: j.jobId };
          })
          .sort((a, b) => {
            return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
          });

        if (this.reportTypes && this.reportTypes[0]) {
          this.form.controls['reportType'].setValue(this.reportTypes[0]);
        }
        this.loading = false;
      },
      (e) => {
        this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
        this.loading = false;
      }
    );
  }
}

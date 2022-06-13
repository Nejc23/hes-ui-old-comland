import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { IActionRequestJobsAssignExisting } from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';

@Component({
  selector: 'app-plc-meter-jobs-assign-existing',
  templateUrl: './plc-meter-jobs-assign-existing.component.html'
})
export class PlcMeterJobsAssignExistingComponent {
  form: FormGroup;
  actionRequest: IActionRequestParams;
  errMsg = '';
  noJobsSelected = false;

  selectedRowsCount: number;
  loading = false;
  selectionRequiredText = this.translate.instant('JOB.AT-LEAST-ONE-JOB');

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private jobsSelectGridService: JobsSelectGridService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.jobsSelectedProperty]: [null, [Validators.required]]
    });
  }

  fillData(): IActionRequestJobsAssignExisting {
    const selectedJobs = this.jobsSelectGridService.getSessionSettingsSelectedRows();

    const formData: IActionRequestJobsAssignExisting = {
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      includedIds: this.actionRequest.deviceIds,
      excludedIds: this.actionRequest.excludeIds,
      scheduleJobIds: selectedJobs
    };

    return formData;
  }

  // properties - START
  get jobsSelectedProperty() {
    return 'jobsSelected';
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onAssignExisting() {
    this.errMsg = '';
    const values = this.fillData();

    if (!values.scheduleJobIds || values.scheduleJobIds.length === 0) {
      this.noJobsSelected = true;
    } else {
      this.form.get(this.jobsSelectedProperty).setValue(values.scheduleJobIds);
    }

    const request = this.myGridService.postJobsAssignExisting(values);
    const successMessage = this.translate.instant('JOB.EXISTING-JOBS-ASSIGNED');
    this.loading = true;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.loading = false;
        console.log(result);
        this.modal.close();
      },
      (err) => {
        // error
        this.loading = false;
      }
    );
  }

  jobSelectionChanged() {
    this.noJobsSelected = false;
  }
}

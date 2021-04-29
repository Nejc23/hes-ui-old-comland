import { AddJobParams } from './../../interfaces/add-job-params.interace';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobTypeEnumeration } from '../../enums/job-type.enum';

@Component({
  templateUrl: './add-job.component.html',
  selector: 'app-add-job'
})
export class AddJobComponent {
  @Input() jobParams: AddJobParams;
  @Output() addJob: EventEmitter<JobTypeEnumeration> = new EventEmitter<JobTypeEnumeration>();

  doAddJob() {
    this.addJob.emit(this.jobParams.jobType);
  }
}

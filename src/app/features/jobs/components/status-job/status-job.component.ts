import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusJobProgress } from '../../interfaces/status-job-progress.interface';
import { ConcentratorManagementService } from '../../../../core/repository/services/concentrator-managment/concentrator-management.service';

@Component({
  selector: 'app-status-job',
  templateUrl: './status-job.component.html'
})
export class StatusJobComponent implements OnInit {
  @Input() deviceId: string;

  statusJobProgress: StatusJobProgress = {
    deviceCount: 4,
    successCount: 1,
    failCount: 1,
    progress: 50.0
  };

  constructor(private modal: NgbActiveModal, private concentratorManagementService: ConcentratorManagementService) {}

  ngOnInit() {
    this.concentratorManagementService.getActiveJobs(this.deviceId).subscribe((res) => {
      console.log(res);
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }
}

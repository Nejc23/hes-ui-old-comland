import { ModalService } from './../../../../core/modals/services/modal.service';
import { Component } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { SchedulerJobsEventEmitterService } from '../../services/scheduler-jobs-event-emitter.service';
import { MeterTypeRoute } from 'src/app/shared/base-template/enums/meter-type.enum';

@Component({
  selector: 'app-grid-cell-device-count',
  templateUrl: './grid-cell-device-count.component.html'
})
export class GridCellDeviceCountComponent {
  public params: any;

  constructor(
    private i18n: I18n,
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: MeterUnitsService,
    private eventService: SchedulerJobsEventEmitterService
  ) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    // console.log('params: ', params);
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  public setToolTip(): string {
    return 'tester';
  }

  public isDeviceCountVisible(): boolean {
    return this.params.node.data.deviceCount > 0;
  }

  public showAllDevices(): void {
    console.log('params: ', this.params);
    window.open(`${window.location.origin}/schedulerJobs/${this.params.node.data.id}`);
  }
}

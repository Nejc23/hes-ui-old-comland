import { Component } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';

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
    private service: MeterUnitsService
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
}

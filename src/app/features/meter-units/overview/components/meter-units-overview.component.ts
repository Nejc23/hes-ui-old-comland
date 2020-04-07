import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormBuilder } from '@angular/forms';
import { headerTitleMU } from '../../consts/static-text.const';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { PlcMeterReadScheduleComponent } from '../../components/plc-meter-read-schedule/plc-meter-read-schedule.component';

@Component({
  selector: 'app-meter-units-overview',
  templateUrl: './meter-units-overview.component.html'
})
export class MeterUnitsOverviewComponent implements OnInit {
  constructor(private sidebarService: SidebarService, private i18n: I18n, private modalService: ModalService, public fb: FormBuilder) {
    this.sidebarService.headerTitle = headerTitleMU;
  }

  ngOnInit() {}

  scheduleRead() {
    console.log('Scheduling read!');
    const modalRef = this.modalService.open(PlcMeterReadScheduleComponent);
    modalRef.result.then().catch(() => {});
  }
}

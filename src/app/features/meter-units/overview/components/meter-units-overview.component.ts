import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';

@Component({
  selector: 'app-meter-units-overview',
  templateUrl: './meter-units-overview.component.html'
})
export class MeterUnitsOverviewComponent {
  constructor(private sidebarService: SidebarService, public fb: FormBuilder) {
    this.sidebarService.headerTitle = `Meter Units`;
  }
}

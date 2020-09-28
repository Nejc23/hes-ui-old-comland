import { RegisterStatistics } from './../../interfaces/data-processing-request.interface';
import { Component, Input } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
@Component({
  templateUrl: 'registers-statistics.component.html',
  selector: 'app-registers-statistics'
})
export class RegistersStatisticsComponent {
  @Input() data: RegisterStatistics;

  constructor(public i18n: I18n) {}
}

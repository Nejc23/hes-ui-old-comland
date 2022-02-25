import { RegisterStatistics } from './../../interfaces/data-processing-request.interface';
import { Component, Input } from '@angular/core';

@Component({
  templateUrl: 'registers-statistics.component.html',
  selector: 'app-registers-statistics'
})
export class RegistersStatisticsComponent {
  @Input() data: RegisterStatistics;
  @Input() showNormalizedValues = false;

  constructor() {}
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-plc-meter-schedule-read',
  templateUrl: './plc-meter-schedule-read.component.html'
})
export class PlcMeterScheduleReadComponent implements OnInit {
  form: FormGroup;

  constructor(
    private meterService: MeterUnitsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      /*
        [this.nMinutesProperty]: [0],
        [this.nHoursProperty]: [0],
        [this.timeEveryDayProperty]: [null],
        [this.daysOfTheWeekProperty]: [null],
        [this.daysOfTheMonthProperty]: [null],
        [this.registerListProperty]: [null]
        */
    });
  }

  ngOnInit() {}
}

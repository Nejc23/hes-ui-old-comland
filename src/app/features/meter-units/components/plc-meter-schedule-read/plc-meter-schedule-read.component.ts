import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      [this.test1Property]: ['', Validators.required],
      [this.test2Property]: ['', Validators.required]
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

  save(addNew: boolean) {
    console.log('Save clicked!');
    /*
    const request = this.dcuService.createDcu(this.fillData());
    const successMessage = this.i18n(`Data Concentration Unit was added successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        if (result) {
          if (addNew) {
            this.form.reset();
          }
        }
      },
      () => {} // error
    );
*/
  }

  cancel() {
    this.modal.close();
  }

  get test1Property() {
    return 'test1';
  }

  get test2Property() {
    return 'test2';
  }

  onDismiss() {
    this.modal.dismiss();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';

@Component({
  selector: 'app-plc-meter-schedule-read',
  templateUrl: './plc-meter-schedule-read.component.html'
})
export class PlcMeterScheduleReadComponent implements OnInit {
  form: FormGroup;
  readOptions: RadioOption[] = [
    { value: 1, label: this.i18n('Every N minute(s)') },
    { value: 2, label: this.i18n('Every N hour(s)') },
    { value: 3, label: this.i18n('Every day at HH:mm') },
    { value: 4, label: this.i18n('Every one or more days of the week at HH:mm') },
    { value: 5, label: this.i18n('Every one or more days of the month at HH:mm') }
  ];
  weekDays: Codelist<number>[] = [
    { id: 1, value: this.i18n('Mon-Fri') },
    { id: 2, value: this.i18n('Mon') },
    { id: 3, value: this.i18n('Tue') },
    { id: 4, value: this.i18n('Wed') },
    { id: 5, value: this.i18n('Thu') },
    { id: 6, value: this.i18n('Fri') },
    { id: 7, value: this.i18n('Sat') },
    { id: 8, value: this.i18n('Sun') }
  ];
  selectedId = 0;

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
      [this.readOptionsProperty]: [null, Validators.required],
      [this.minutesProperty]: [0],
      [this.hoursProperty]: [0],
      [this.timeProperty]: [new Date()],
      [this.weekDaysProperty]: [null]
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

  changeReadOptionId() {
    this.selectedId = this.form.get(this.readOptionsProperty).value;
    console.log(`changeReadOptionId = ${this.form.get(this.readOptionsProperty).value}`);
  }

  get readOptionsProperty() {
    return 'readOptions';
  }

  get minutesProperty() {
    return 'minutes';
  }

  get hoursProperty() {
    return 'minutes';
  }

  get timeProperty() {
    return 'time';
  }

  get weekDaysProperty() {
    return 'weekDays';
  }

  onDismiss() {
    this.modal.dismiss();
  }
}

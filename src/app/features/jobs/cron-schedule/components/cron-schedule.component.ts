import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Codelist } from './../../../../shared/repository/interfaces/codelists/codelist.interface';
import { Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import * as _ from 'lodash';
import cronstrue from 'cronstrue/i18n';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import cron from 'cron-validate';

@Component({
  templateUrl: './cron-schedule.component.html',
  selector: 'app-cron-schedule'
})
export class CronScheduleComponent implements OnInit {
  @Input() cronExpression: string;

  registersRequiredText = $localize`Required field`;
  cronInvalidError = $localize`Cron expression is invalid.`;
  tabStripTitleMinutes = $localize`Minutes`;
  tabStripTitleHourly = $localize`Hourly`;
  tabStripTitleDaily = $localize`Daily`;
  tabStripTitleWeekly = $localize`Weekly`;
  tabStripTitleMonthly = $localize`Monthly`;
  tabStripTitleAdvanced = $localize`Advanced`;

  weekDays: Codelist<number>[] = [
    { id: 8, value: $localize`Mon-Fri` },
    { id: 2, value: $localize`Mon` },
    { id: 3, value: $localize`Tue` },
    { id: 4, value: $localize`Wed` },
    { id: 5, value: $localize`Thu` },
    { id: 6, value: $localize`Fri` },
    { id: 7, value: $localize`Sat` },
    { id: 1, value: $localize`Sun` }
  ];

  everyMinutes: Codelist<number>[];
  everyHours: Codelist<number>[];
  everyDays: Codelist<number>[];
  minutes: Codelist<number>[];
  hours: Codelist<number>[];

  form: FormGroup;

  freq = Frequency;
  selectedFrequency: Frequency = Frequency.Minutes;

  @ViewChild(TabStripComponent) public tabstrip: TabStripComponent;

  dailyOptionEvery: RadioOption[] = [{ value: '1' as string, label: $localize`Every` }];

  dailyOptionWeekday: RadioOption[] = [{ value: '2' as string, label: $localize`Week day (MON-FRI)` }];

  formValues: FormValues;

  constructor(private formBuilder: FormBuilder, @Inject(LOCALE_ID) public locale: string, private formUtils: FormsUtilsService) {}

  ngOnInit() {
    this.everyMinutes = [];
    for (let i = 1; i < 60; i++) {
      this.everyMinutes.push({ id: i, value: `${i}` });
    }

    this.everyHours = [];
    for (let i = 1; i < 24; i++) {
      this.everyHours.push({ id: i, value: `${i}` });
    }

    this.everyDays = [];
    for (let i = 1; i <= 7; i++) {
      this.everyDays.push({ id: i, value: `${i}` });
    }

    this.minutes = [];
    for (let i = 0; i < 60; i++) {
      this.minutes.push({ id: i, value: `${i}` });
    }

    this.hours = [];
    for (let i = 0; i < 24; i++) {
      this.hours.push({ id: i, value: `${i}` });
    }

    this.initForm(this.cronExpression);
  }

  setFormValues() {
    this.formValues = {
      minutesMinutes: this.everyMinutes[0],

      hourlyMinutes: this.minutes[0],
      hourlyHours: this.everyHours[0],

      dailyEveryMinutes: this.minutes[0],
      dailyEveryHours: this.hours[0],
      dailyEveryDays: this.everyDays[0],
      dailyFrequency: '1',
      dailyWeekdayHours: this.hours[0],
      dailyWeekdayMinutes: this.minutes[0],

      weekDays: [8],
      weeklyHours: this.hours[0],
      weeklyMinutes: this.minutes[0],

      monthlyMonthDays: [],
      monthlyHours: this.hours[0],
      monthlyMinutes: this.minutes[0],

      advancedCron: '0 0 0 1/1 * ? *'
    };
  }

  createForm() {
    return this.formBuilder.group({
      [this.minutesMinutesProperty]: [this.formValues.minutesMinutes],

      [this.hourlyMinutesProperty]: [this.formValues.hourlyMinutes],
      [this.hourlyHoursProperty]: [this.formValues.hourlyHours],

      [this.dailyEveryMinutesProperty]: [this.formValues.dailyEveryMinutes],
      [this.dailyEveryHoursProperty]: [this.formValues.dailyEveryHours],
      [this.dailyEveryDaysProperty]: [this.formValues.dailyEveryDays],
      [this.dailyFrequencyProperty]: [this.formValues.dailyFrequency],
      [this.dailyWeekdayHoursProperty]: [this.formValues.dailyWeekdayHours],
      [this.dailyWeekdayMinutesProperty]: [this.formValues.dailyWeekdayMinutes],

      [this.weekDaysProperty]: [this.formValues.weekDays],
      [this.weeklyHoursProperty]: [this.formValues.weeklyHours],
      [this.weeklyMinutesProperty]: [this.formValues.weeklyMinutes],

      [this.monthlyMonthDaysProperty]: [this.formValues.monthlyMonthDays],
      [this.monthlyHoursProperty]: [this.formValues.monthlyHours],
      [this.monthlyMinutesProperty]: [this.formValues.monthlyMinutes],

      [this.advancedCronProperty]: [this.formValues.advancedCron]
    });
  }

  onTabSelect(e: any) {
    this.selectedFrequency = e.index;
    this.setFormValidation();
  }

  setFormValidation() {
    this.form.get(this.minutesMinutesProperty).setValidators(this.selectedFrequency === Frequency.Minutes ? [Validators.required] : []);

    this.form.get(this.hourlyMinutesProperty).setValidators(this.selectedFrequency === Frequency.Hourly ? [Validators.required] : []);
    this.form.get(this.hourlyHoursProperty).setValidators(this.selectedFrequency === Frequency.Hourly ? [Validators.required] : []);

    const dailyFrequency = this.form.get(this.dailyFrequencyProperty).value;
    this.form
      .get(this.dailyEveryMinutesProperty)
      .setValidators(this.selectedFrequency === Frequency.Daily && dailyFrequency === this.dailyOptionEvery ? [Validators.required] : []);
    this.form
      .get(this.dailyEveryHoursProperty)
      .setValidators(this.selectedFrequency === Frequency.Daily && dailyFrequency === this.dailyOptionEvery ? [Validators.required] : []);
    this.form
      .get(this.dailyEveryDaysProperty)
      .setValidators(this.selectedFrequency === Frequency.Daily && dailyFrequency === this.dailyOptionEvery ? [Validators.required] : []);
    this.form.get(this.dailyFrequencyProperty).setValidators(this.selectedFrequency === Frequency.Daily ? [Validators.required] : []);
    this.form
      .get(this.dailyWeekdayHoursProperty)
      .setValidators(this.selectedFrequency === Frequency.Daily && dailyFrequency === this.dailyOptionWeekday ? [Validators.required] : []);
    this.form
      .get(this.dailyWeekdayMinutesProperty)
      .setValidators(this.selectedFrequency === Frequency.Daily && dailyFrequency === this.dailyOptionWeekday ? [Validators.required] : []);

    this.form.get(this.weekDaysProperty).setValidators(this.selectedFrequency === Frequency.Weekly ? [Validators.required] : []);
    this.form.get(this.weeklyHoursProperty).setValidators(this.selectedFrequency === Frequency.Weekly ? [Validators.required] : []);
    this.form.get(this.weeklyMinutesProperty).setValidators(this.selectedFrequency === Frequency.Weekly ? [Validators.required] : []);

    this.form.get(this.monthlyMonthDaysProperty).setValidators(this.selectedFrequency === Frequency.Monthly ? [Validators.required] : []);
    this.form.get(this.monthlyHoursProperty).setValidators(this.selectedFrequency === Frequency.Monthly ? [Validators.required] : []);
    this.form.get(this.monthlyMinutesProperty).setValidators(this.selectedFrequency === Frequency.Monthly ? [Validators.required] : []);

    this.form.get(this.advancedCronProperty).setValidators(this.selectedFrequency === Frequency.Advanced ? [Validators.required] : []);
    this.form.markAsUntouched();
  }

  get minutesMinutesProperty() {
    return 'minutesMinutes'; // nameOf<DcuForm>((o) => o.name);
  }

  get hourlyMinutesProperty() {
    return 'hourlyMinutes'; // nameOf<DcuForm>((o) => o.name);
  }

  get hourlyHoursProperty() {
    return 'hourlyHours'; // nameOf<DcuForm>((o) => o.name);
  }

  get dailyEveryMinutesProperty() {
    return 'dailyMinutes'; // nameOf<DcuForm>((o) => o.name);
  }

  get dailyEveryHoursProperty() {
    return 'dailyHours'; // nameOf<DcuForm>((o) => o.name);
  }

  get dailyEveryDaysProperty() {
    return 'dailyDays'; // nameOf<DcuForm>((o) => o.name);
  }

  get dailyFrequencyProperty() {
    return 'dailyFrequency'; // nameOf<DcuForm>((o) => o.name);
  }

  get dailyWeekdayHoursProperty() {
    return 'dailyWeekdayHours'; // nameOf<DcuForm>((o) => o.name);
  }

  get dailyWeekdayMinutesProperty() {
    return 'dailyWeekdayMinutes'; // nameOf<DcuForm>((o) => o.name);
  }

  get weekDaysProperty() {
    return 'weeklyWeekday'; // nameOf<SchedulerJobForm>((o) => o.weekDays);
  }

  get weeklyHoursProperty() {
    return 'weeklyHours';
  }

  get weeklyMinutesProperty() {
    return 'weeklyMinutes';
  }

  get monthlyMonthDaysProperty() {
    return 'monthlyMonthDays';
  }

  get monthlyHoursProperty() {
    return 'monthlyHours';
  }

  get monthlyMinutesProperty() {
    return 'monthlyMinutes';
  }

  get advancedCronProperty() {
    return 'advancedCron';
  }

  getCronDescription(freq: Frequency) {
    const cronExpression = this.generateCronExpression(freq);
    if (freq === Frequency.Advanced && !this.isAdvancedCronValid) {
      return $localize`N/A`;
    }

    if (cronExpression && cronExpression !== '') {
      return cronstrue.toString(cronExpression, { locale: this.locale, use24HourTimeFormat: true });
    }
    return $localize`N/A`;
  }

  generateCronExpression(freq: Frequency = this.selectedFrequency): string {
    switch (freq) {
      case Frequency.Minutes: {
        const minutes = this.form.get(this.minutesMinutesProperty).value?.value;
        if (minutes) {
          return `0 */${minutes} * * * ? *`;
        }

        break;
      }
      case Frequency.Hourly: {
        const minutes = this.form.get(this.hourlyMinutesProperty).value?.value;
        const hours = this.form.get(this.hourlyHoursProperty).value?.value;
        if (minutes && hours) {
          return `0 ${minutes} */${hours} * * ? *`;
        }
        break;
      }
      case Frequency.Daily: {
        const dailyFrequency = this.form.get(this.dailyFrequencyProperty).value;
        if (dailyFrequency === '1') {
          const minutes = this.form.get(this.dailyEveryMinutesProperty).value?.value;
          const hours = this.form.get(this.dailyEveryHoursProperty).value?.value;
          const days = this.form.get(this.dailyEveryDaysProperty).value?.value;

          if (minutes && hours && days) {
            return `0 ${minutes} ${hours} ? * */${days} *`;
          }
        } else if (dailyFrequency === '2') {
          const minutes = this.form.get(this.dailyWeekdayMinutesProperty).value?.value;
          const hours = this.form.get(this.dailyWeekdayHoursProperty).value?.value;

          if (minutes && hours) {
            return `0 ${minutes} ${hours} ? * 2-6 *`;
          }
        }
        break;
      }
      case Frequency.Weekly: {
        const weekdays = this.form.get(this.weekDaysProperty).value;
        const minutes = this.form.get(this.weeklyMinutesProperty).value?.value;
        const hours = this.form.get(this.weeklyHoursProperty).value?.value;
        if (weekdays && weekdays.length > 0 && minutes && hours) {
          const weekdaysJoined = weekdays.map((days) => (days === 8 ? '2-6' : days.toString())).join();
          return `0 ${minutes} ${hours} ? * ${weekdaysJoined} *`;
        }
        break;
      }
      case Frequency.Monthly: {
        const monthDaysJoined = this.formValues.monthlyMonthDays.join();
        const minutes = this.form.get(this.monthlyMinutesProperty).value?.value;
        const hours = this.form.get(this.monthlyHoursProperty).value?.value;
        if (monthDaysJoined && minutes && hours) {
          return `0 ${minutes} ${hours} ${monthDaysJoined} * ? *`;
        }

        break;
      }
      case Frequency.Advanced: {
        const cronExpression = this.form.get(this.advancedCronProperty).value;
        if (cronExpression) {
          return cronExpression;
        }
        break;
      }
    }

    return null;
  }

  weeklyCheckChanged(event: any) {}

  isDayInMonthSelected(index: number) {
    for (const dayNo of this.formValues.monthlyMonthDays) {
      if (dayNo === index) {
        return true;
      }
    }
    return false;
  }

  onDayInMonthClick(dayinMonth: number) {
    const result = _.findIndex(this.formValues.monthlyMonthDays, (x) => x === dayinMonth) > -1 ? true : false;
    if (!result) {
      this.formValues.monthlyMonthDays.push(dayinMonth);
    } else {
      _.remove(this.formValues.monthlyMonthDays, (x) => x === dayinMonth);
    }
    const daysSorted = this.formValues.monthlyMonthDays.sort((a, b) => a - b);

    this.form.get(this.monthlyMonthDaysProperty).setValue(daysSorted);

    this.form.markAsTouched();
  }

  isNoMonthDaysValid() {
    return !(this.form.touched && (!this.formValues.monthlyMonthDays || this.formValues.monthlyMonthDays.length === 0));
  }

  isFormValid(): boolean {
    this.form.markAsTouched();
    this.formUtils.touchElementsAndValidate(this.form);
    return this.form.valid && this.isAdvancedCronValid();
  }

  initForm(cronExpression: string) {
    console.log('initForm', cronExpression);
    this.setFormValues();
    this.selectedFrequency = Frequency.Minutes;

    if (cronExpression) {
      this.setFormFromCronExpression(cronExpression);
    }

    this.form = this.createForm();
    this.setFormValidation();
  }

  setFormFromCronExpression(cronExpression: string) {
    console.log('setFormFromCronExpression', cronExpression, this.formValues);
    const splitCron = cronExpression.split(' ');
    if (splitCron.length !== 7) {
      this.selectedFrequency = Frequency.Advanced;
      this.formValues.advancedCron = cronExpression;
      return;
    }

    const seconds = splitCron[0];
    const minutes = splitCron[1];
    const hours = splitCron[2];
    const days = splitCron[3];
    const month = splitCron[4];
    const weekday = splitCron[5];
    const year = splitCron[6];

    if (year === '*' && seconds === '0' && month === '*') {
      if (minutes.startsWith('*/') && hours === '*' && days === '*' && (weekday === '*' || weekday === '?')) {
        this.selectedFrequency = Frequency.Minutes;
        const index = +minutes.replace('*/', '');
        if (index) {
          this.selectedFrequency = Frequency.Minutes;
          this.formValues.minutesMinutes = this.everyMinutes[index - 1];
          return;
        }
      } else if (!isNaN(+minutes) && hours.startsWith('*/') && (days === '*' || days === '?') && (weekday === '*' || weekday === '?')) {
        this.selectedFrequency = Frequency.Hourly;
        const index = +hours.replace('*/', '');
        this.formValues.hourlyMinutes = this.minutes[+minutes];
        this.formValues.hourlyHours = this.everyHours[index - 1];
        return;
      } else if (!isNaN(+minutes) && !isNaN(+hours)) {
        const minutesCodelist = this.minutes[+minutes];
        const hoursCodelist = this.hours[+hours];

        if ((days === '*' || days === '?') && weekday !== '*' && weekday !== '?') {
          if (weekday.startsWith('*/')) {
            const index = +weekday.replace('*/', '');
            if (!isNaN(index)) {
              if (index) {
                this.selectedFrequency = Frequency.Daily;
                this.formValues.dailyEveryDays = this.everyDays[index - 1];
                this.formValues.dailyEveryHours = hoursCodelist;
                this.formValues.dailyEveryMinutes = minutesCodelist;
                return;
              }
            }
          } else {
            const selectedDays = weekday.split(',').map((d) => (d === '1-5' ? 8 : +d));
            if (!selectedDays.some((d) => isNaN(d))) {
              if (selectedDays && selectedDays.length > 0) {
                this.selectedFrequency = Frequency.Weekly;
                this.formValues.weekDays = selectedDays;
                this.formValues.weeklyHours = hoursCodelist;
                this.formValues.weeklyMinutes = minutesCodelist;
                return;
              }
            }
          }
        } else if (days !== '*' && days !== '?' && (weekday === '*' || weekday === '?')) {
          const selectedDays = days.split(',').map((d) => +d);
          if (!selectedDays.some((d) => isNaN(d))) {
            if (selectedDays && selectedDays.length > 0) {
              this.selectedFrequency = Frequency.Monthly;
              this.formValues.monthlyMonthDays = selectedDays;
              this.formValues.monthlyHours = hoursCodelist;
              this.formValues.monthlyMinutes = minutesCodelist;
              return;
            }
          }
        }
      }
    }
    this.selectedFrequency = Frequency.Advanced;
    this.formValues.advancedCron = cronExpression;
  }

  isAdvancedCronValid() {
    if (this.selectedFrequency !== Frequency.Advanced) {
      return true;
    }

    const cronExpresssionField = this.form.get(this.advancedCronProperty);
    if (!cronExpresssionField.touched || !cronExpresssionField.value) {
      return true;
    }

    const cronParts = cronExpresssionField.value.split(' ');
    if (cronParts.length !== 7) {
      return false;
    }

    const cronResult = cron(cronExpresssionField.value, {
      override: {
        useSeconds: true,
        useYears: true,
        useBlankDay: true
      }
    });
    const isError = cronResult.isError();
    return !isError;
  }
}

enum Frequency {
  Minutes,
  Hourly,
  Daily,
  Weekly,
  Monthly,
  Advanced
}

export interface FormValues {
  minutesMinutes: Codelist<number>;

  hourlyMinutes: Codelist<number>;
  hourlyHours: Codelist<number>;

  dailyEveryMinutes: Codelist<number>;
  dailyEveryHours: Codelist<number>;
  dailyEveryDays: Codelist<number>;
  dailyFrequency: string;
  dailyWeekdayHours: Codelist<number>;
  dailyWeekdayMinutes: Codelist<number>;

  weekDays: number[];
  weeklyHours: Codelist<number>;
  weeklyMinutes: Codelist<number>;

  monthlyMonthDays: number[];
  monthlyHours: Codelist<number>;
  monthlyMinutes: Codelist<number>;

  advancedCron: string;
}

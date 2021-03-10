import { AlarmNotificationRules } from './../../interfaces/alarm-notification-rules.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Component({
  selector: 'app-alarm-notification-rules',
  templateUrl: './alarm-notification-rules.component.html'
})
export class AlarmNotificationRulesComponent implements OnInit {
  form: FormGroup;

  alarmIds: Codelist<number>[] = [
    { id: 1, value: '1' },
    { id: 64, value: '64' },
    { id: 128, value: '128' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.createForm();
  }

  ngOnInit(): void {}

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.isAlarmIdActiveProperty]: [false],
      [this.isSeverityActiveProperty]: [false],
      [this.isProtocolActiveProperty]: [false],
      [this.isManufacturerActiveProperty]: [false],
      [this.isSourceActiveProperty]: [false],
      [this.alarmIdsProperty]: { value: [], disabled: true }
    });
  }

  get isAlarmIdActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isAlarmIdActive);
  }

  get alarmIdsProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.alarmIds);
  }

  get isSeverityActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isSeverityActive);
  }

  get isProtocolActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isProtocolActive);
  }

  get isManufacturerActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isManufacturerActive);
  }

  get isSourceActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isSourceActive);
  }

  inputSwitchChange(switchValue: boolean, fieldProperty: any) {
    const field = this.form.get(fieldProperty);
    if (switchValue) {
      field.enable();
    } else {
      field.disable();
    }
  }
}

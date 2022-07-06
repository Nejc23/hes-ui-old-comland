import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NotificationFilter } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { Setting } from 'src/app/core/repository/interfaces/settings/setting';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { AlarmNotificationRules } from './../../interfaces/alarm-notification-rules.interface';

@Component({
  selector: 'app-alarm-notification-rules',
  templateUrl: './alarm-notification-rules.component.html'
})
export class AlarmNotificationRulesComponent implements OnInit {
  @Input() filter: NotificationFilter;
  @Input() addresses: string[];

  form: FormGroup;
  noRuleActive = false;

  @Input() protocols: Codelist<number>[];
  @Input() manufacturers: Codelist<number>[];
  @Input() severities: Codelist<number>[];
  @Input() sources: Codelist<number>[];
  @Input() notificationTypes: Codelist<number>[];
  @Input() defaultJobAddress: Setting;

  rules: AlarmNotificationRules;

  constructor(private formBuilder: FormBuilder, private formUtils: FormsUtilsService) {
    // this.updateInputFields();
  }

  ngOnInit(): void {
    this.form = this.createForm();
  }

  enableField(property: string, isEnabled: boolean) {
    if (isEnabled) {
      this.form.get(property).enable();
    } else {
      this.form.get(property).disable();
    }
  }

  createForm(): FormGroup {
    this.rules = this.getAlarmNotificationRules();
    const rules = this.rules;

    return this.formBuilder.group({
      [this.isAlarmIdActiveProperty]: [rules.isAlarmIdActive],
      [this.isSeverityActiveProperty]: [rules.isSeverityActive],
      [this.isProtocolActiveProperty]: [rules.isProtocolActive],
      [this.isManufacturerActiveProperty]: [rules.isManufacturerActive],
      [this.isSourceActiveProperty]: [rules.isSourceActive],

      [this.alarmIdsProperty]: [
        { value: rules.alarmIds, disabled: !rules.isAlarmIdActive },
        [Validators.required, customRegexValidator(/^\d+$/, 'numberError')]
      ],
      [this.severitiesProperty]: [{ value: rules.severities, disabled: !rules.isSeverityActive }, Validators.required],
      [this.protocolsProperty]: [{ value: rules.protocols, disabled: !rules.isProtocolActive }, Validators.required],
      [this.manufacturersProperty]: [{ value: rules.manufacturers, disabled: !rules.isManufacturerActive }, Validators.required],
      [this.sourcesProperty]: [{ value: rules.sources, disabled: !rules.isSourceActive }, Validators.required],
      [this.addressesProperty]: [
        { value: rules.addresses, disabled: rules.notificationType.id !== 1 },
        [Validators.required, customRegexValidator(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'emailError')]
      ],
      [this.notificationTypeProperty]: [rules.notificationType, Validators.required],
      [this.webhookAddressProperty]: [{ value: rules.webhookAddress, disabled: rules.notificationType.id === 1 }, Validators.required]
    });
  }

  getAlarmNotificationRules(): AlarmNotificationRules {
    const rules: AlarmNotificationRules = {
      isAlarmIdActive: false,
      isSeverityActive: false,
      isProtocolActive: false,
      isManufacturerActive: false,
      isSourceActive: false,
      alarmIds: [],
      severities: [],
      protocols: [],
      manufacturers: [],
      sources: [],
      addresses: [],
      notificationType: { id: 1, value: '' },
      webhookAddress: this.defaultJobAddress?.value
    };
    if (!this.filter || !this.addresses) {
      return rules;
    }

    rules.isAlarmIdActive = this.filter.alarmIds?.length > 0;
    rules.isSeverityActive = this.filter.severities?.length > 0;
    rules.isProtocolActive = this.filter.protocols?.length > 0;
    rules.isManufacturerActive = this.filter.manufacturers?.length > 0;
    rules.isSourceActive = this.filter.sources?.length > 0;

    rules.severities = this.getCodelistValues(this.severities, this.filter.severities);
    rules.protocols = this.getCodelistValues(this.protocols, this.filter.protocols);
    rules.manufacturers = this.getCodelistValues(this.manufacturers, this.filter.manufacturers);
    rules.sources = this.getCodelistValues(this.sources, this.filter.sources);
    rules.notificationType = this.getCodelistValues(this.notificationTypes, [this.filter.notificationAddressType])[0];

    rules.alarmIds = rules.isAlarmIdActive
      ? this.filter.alarmIds.map((a) => {
          return { id: a, value: a.toString() };
        })
      : [];

    let aIndex = 0;
    if (rules.notificationType?.id == 1) {
      rules.addresses = this.addresses
        ? this.addresses.map((a) => {
            return { id: aIndex++, value: a.toString() };
          })
        : [];
    } else {
      rules.webhookAddress = this.addresses[0];
    }

    return rules;
  }

  getCodelistValues(list: Codelist<number>[], values: any[]) {
    if (!values || values?.length === 0) {
      return [];
    }

    return values.map((value) => {
      return !isNaN(Number(value))
        ? list.find((s) => +value === s.id)
        : list.find((s) => String(value).toLowerCase() === s.value.toLowerCase());
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

  get severitiesProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.severities);
  }

  get isProtocolActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isProtocolActive);
  }

  get protocolsProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.protocols);
  }

  get isManufacturerActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isManufacturerActive);
  }

  get manufacturersProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.manufacturers);
  }

  get isSourceActiveProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.isSourceActive);
  }

  get sourcesProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.sources);
  }

  get addressesProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.addresses);
  }

  get notificationTypeProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.notificationType);
  }

  get webhookAddressProperty(): string {
    return nameOf<AlarmNotificationRules>((o) => o.webhookAddress);
  }

  inputSwitchChange(switchValue: boolean, fieldProperty: any) {
    const field = this.form.get(fieldProperty);
    if (switchValue) {
      field.enable();
    } else {
      field.disable();
    }

    this.noRuleActive = false;
  }

  validateForm(): boolean {
    this.formUtils.touchElementsAndValidate(this.form);
    this.noRuleActive =
      !this.form.get(this.isAlarmIdActiveProperty).value &&
      !this.form.get(this.isSeverityActiveProperty).value &&
      !this.form.get(this.isProtocolActiveProperty).value &&
      !this.form.get(this.isManufacturerActiveProperty).value &&
      !this.form.get(this.isSourceActiveProperty).value;

    if (this.form.get(this.notificationTypeProperty).value.value == 2) {
      this.enableField(this.addressesProperty, false);
    }

    return this.form.valid && !this.noRuleActive;
  }

  fillData(): AlarmNotificationRules {
    const formData: AlarmNotificationRules = {
      isAlarmIdActive: this.form.get(this.isAlarmIdActiveProperty).value,
      isSeverityActive: this.form.get(this.isSeverityActiveProperty).value,
      isProtocolActive: this.form.get(this.isProtocolActiveProperty).value,
      isManufacturerActive: this.form.get(this.isManufacturerActiveProperty).value,
      isSourceActive: this.form.get(this.isSourceActiveProperty).value,
      alarmIds: this.form.get(this.alarmIdsProperty).value,
      severities: this.form.get(this.severitiesProperty).value,
      protocols: this.form.get(this.protocolsProperty).value,
      manufacturers: this.form.get(this.manufacturersProperty).value,
      sources: this.form.get(this.sourcesProperty).value,
      addresses: this.form.get(this.addressesProperty).value,
      notificationType: this.form.get(this.notificationTypeProperty).value,
      webhookAddress: this.form.get(this.webhookAddressProperty).value
    };
    return formData;
  }

  getFilter(): NotificationFilter {
    const formData = this.fillData();
    return {
      alarmIds: formData.isAlarmIdActive ? formData.alarmIds.map((a) => +a.value) : [],
      severities: formData.isSeverityActive ? formData.severities.map((s) => s.id) : [],
      protocols: formData.isProtocolActive ? formData.protocols.map((p) => p.id) : [],
      manufacturers: formData.isManufacturerActive ? formData.manufacturers.map((m) => m.id) : [],
      sources: formData.isSourceActive ? formData.sources.map((s) => s.id) : [],
      notificationAddressType: formData.notificationType.id
    };
  }

  getAddresses(): string[] {
    const formData = this.fillData();
    if (formData.notificationType.id == 1) {
      return formData.addresses.map((a) => a.value);
    } else {
      return [formData.webhookAddress];
    }
  }

  public onNotificationTypeChanged(value) {
    if (value?.id == 1) {
      this.enableField(this.addressesProperty, true);
      this.enableField(this.webhookAddressProperty, false);
    } else if (value?.id == 2) {
      this.enableField(this.addressesProperty, false);
      this.enableField(this.webhookAddressProperty, true);
    }
  }
}

export function customRegexValidator(nameRe: RegExp, errorKeyName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      for (const value of control.value) {
        if (!nameRe.test(value.value)) {
          return { [errorKeyName]: { value: value.value } };
        }
      }
    }
    return null;
  };
}

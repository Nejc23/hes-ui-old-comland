import { AlarmNotificationRules } from './../../interfaces/alarm-notification-rules.interface';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { Observable, forkJoin } from 'rxjs';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NotificationFilter } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';

@Component({
  selector: 'app-alarm-notification-rules',
  templateUrl: './alarm-notification-rules.component.html'
})
export class AlarmNotificationRulesComponent implements OnInit {
  @Input() filter: NotificationFilter;
  @Input() addresses: string[];

  form: FormGroup;
  noRuleActive = false;

  protocols: Codelist<number>[];
  manufacturers: Codelist<number>[];
  severities: Codelist<number>[];
  sources: Codelist<number>[];

  rules: AlarmNotificationRules;

  constructor(
    private formBuilder: FormBuilder,
    private codelistService: CodelistMeterUnitsRepositoryService,
    private formUtils: FormsUtilsService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    forkJoin({
      manufacturers: this.codelistService.meterUnitVendorCodelist(0),
      protocols: this.codelistService.meterUnitProtocolTypeCodelist(),
      severities: this.codelistService.meterUnitAlarmSeverityTypeCodelist(),
      sources: this.codelistService.meterUnitAlarmSourceTypeCodelist()
    }).subscribe(({ manufacturers, protocols, severities, sources }) => {
      this.manufacturers = manufacturers;
      this.protocols = protocols;
      this.severities = severities;
      this.sources = sources;

      if (this.filter && this.addresses) {
        this.form = this.createForm();
      }
    });
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
      [this.alarmIdsProperty]: new FormControl({ value: rules.alarmIds, disabled: !rules.isAlarmIdActive }, [
        Validators.required,
        customRegexValidator(/^\d+$/, 'numberError')
      ]),
      [this.severitiesProperty]: new FormControl({ value: rules.severities, disabled: !rules.isSeverityActive }, Validators.required),
      [this.protocolsProperty]: new FormControl({ value: rules.protocols, disabled: !rules.isProtocolActive }, Validators.required),
      [this.manufacturersProperty]: new FormControl(
        { value: rules.manufacturers, disabled: !rules.isManufacturerActive },
        Validators.required
      ),
      [this.sourcesProperty]: new FormControl({ value: rules.sources, disabled: !rules.isSourceActive }, Validators.required),
      [this.addressesProperty]: [rules.addresses, [Validators.required, customRegexValidator(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'emailError')]]
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
      addresses: []
    };
    if (!this.filter || !this.addresses) {
      return rules;
    }

    rules.isAlarmIdActive = this.filter.alarmIds?.length > 0;
    rules.isSeverityActive = this.filter.severities?.length > 0;
    rules.isProtocolActive = this.filter.protocols?.length > 0;
    rules.isManufacturerActive = this.filter.manufacturers?.length > 0;
    rules.isSourceActive = this.filter.sources?.length > 0;

    rules.alarmIds = rules.isAlarmIdActive
      ? this.filter.alarmIds.map((a) => {
          return { id: a, value: a.toString() };
        })
      : [];

    rules.severities = rules.isSeverityActive
      ? this.filter.severities.map((a) => {
          return this.severities.find((s) => a === s.id);
        })
      : [];

    rules.protocols = rules.isProtocolActive
      ? this.filter.protocols.map((a) => {
          return this.protocols.find((s) => a === s.id);
        })
      : [];

    rules.manufacturers = rules.isManufacturerActive
      ? this.filter.manufacturers.map((a) => {
          return this.manufacturers.find((s) => a === s.id);
        })
      : [];

    rules.sources = rules.isSourceActive
      ? this.filter.sources.map((a) => {
          return this.sources.find((s) => a === s.id);
        })
      : [];

    let aIndex = 0;
    rules.addresses = this.addresses
      ? this.addresses.map((a) => {
          return { id: aIndex++, value: a.toString() };
        })
      : [];

    return rules;
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

    return this.form.valid || this.noRuleActive;
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
      addresses: this.form.get(this.addressesProperty).value
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
      sources: formData.isSourceActive ? formData.sources.map((s) => s.id) : []
    };
  }

  getAddresses(): string[] {
    const formData = this.fillData();
    return formData.addresses.map((a) => a.value);
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

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { InitialReKeying } from '../../interfaces/initial-rey-keying-interface';

@Component({
  selector: 'app-initial-re-keying-component',
  templateUrl: './initial-re-keying.component.html'
})
export class InitialReKeyingComponent implements OnInit {
  @Input()
  form: FormGroup;
  noRuleActive = false;

  @Input() protocols: Codelist<number>[];
  @Input() manufacturers: Codelist<number>[];

  @Input()
  selectedManufacturersValues: number[] = [];
  @Input()
  selectedProtocolsValues: number[] = [];

  selectedManufacturer = [];
  selectedProtocol = [];

  constructor() {}

  ngOnInit(): void {
    this.setSelectedValues();
  }

  get isProtocolActiveProperty(): string {
    return nameOf<InitialReKeying>((o) => o.isProtocolActive);
  }

  get protocolsProperty(): string {
    return nameOf<InitialReKeying>((o) => o.protocols);
  }

  get isManufacturerActiveProperty(): string {
    return nameOf<InitialReKeying>((o) => o.isManufacturerActive);
  }

  get manufacturersProperty(): string {
    return nameOf<InitialReKeying>((o) => o.manufacturers);
  }

  get numberOfDaysProperty(): string {
    return nameOf<InitialReKeying>((o) => o.rekeyAfterDays);
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

  fillData(): InitialReKeying {
    return {
      isProtocolActive: this.form.get(this.isProtocolActiveProperty).value,
      isManufacturerActive: this.form.get(this.isManufacturerActiveProperty).value,
      protocols: this.form.get(this.protocolsProperty).value,
      manufacturers: this.form.get(this.manufacturersProperty).value,
      rekeyAfterDays: this.form.get(this.numberOfDaysProperty).value
    };
  }

  setSelectedValues() {
    this.selectedProtocol = this.getCodelistValues(this.protocols, this.selectedProtocolsValues);
    this.selectedManufacturer = this.getCodelistValues(this.manufacturers, this.selectedManufacturersValues);

    this.inputSwitchChange(this.form.get(this.isProtocolActiveProperty).value, this.protocolsProperty);
    this.inputSwitchChange(this.form.get(this.isManufacturerActiveProperty).value, this.manufacturersProperty);
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
}

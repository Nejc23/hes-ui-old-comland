import { Component, Input, OnInit } from '@angular/core';
import { InstantValue } from 'src/app/core/repository/interfaces/meter-units/instant-value.interface';

@Component({
  selector: 'app-popover-instant-values',
  templateUrl: './popover-instant-values.component.html'
})
export class PopoverInstantValuesComponent implements OnInit {
  @Input() defaultItemCount = 5;
  @Input() inputInstantValues: InstantValue[];
  @Input() selectedValue: number;
  @Input() titleClass: string;

  instantValues: InstantValue[];
  visibleInstantValues: InstantValue[];
  isMoreButtonVisible = false;

  constructor() {}

  ngOnInit() {
    this.instantValues = this.inputInstantValues?.filter((iv) => iv.value === this.selectedValue);

    if (this.instantValues?.length > this.defaultItemCount) {
      this.visibleInstantValues = this.instantValues.slice(0, this.defaultItemCount);
      this.isMoreButtonVisible = true;
    } else {
      this.visibleInstantValues = this.instantValues;
      this.isMoreButtonVisible = false;
    }
  }

  showMore(): void {
    this.visibleInstantValues = this.instantValues;
    this.isMoreButtonVisible = false;
  }

  getShowAllText(): string {
    return `${$localize`Show all`} ${this.instantValues.length} ${$localize`relays`}`;
  }
}

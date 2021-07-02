import { Component, Input, OnInit } from '@angular/core';
import { InstantValue } from 'src/app/core/repository/interfaces/meter-units/instant-value.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-instant-values',
  templateUrl: './popover-instant-values.component.html'
})
export class PopoverInstantValuesComponent implements OnInit {
  @Input() defaultItemCount = 5;
  @Input() inputInstantValues: InstantValue[];

  visibleInstantValues: InstantValue[];
  isMoreButtonVisible = false;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    if (this.inputInstantValues?.length > this.defaultItemCount) {
      this.visibleInstantValues = this.inputInstantValues.slice(0, this.defaultItemCount);
      this.isMoreButtonVisible = true;
    } else {
      this.visibleInstantValues = this.inputInstantValues;
      this.isMoreButtonVisible = false;
    }
  }

  showMore(): void {
    this.visibleInstantValues = this.inputInstantValues;
    this.isMoreButtonVisible = false;
  }

  getShowAllText(): string {
    return (
      this.translate.instant('COMMON.SHOW-ALL') + this.inputInstantValues.length + this.translate.instant('COMMON.RELAYS').toLowerCase()
    );
  }

  getBadgeClass(selectedValue: string) {
    var classes = {
      '0': 'badge-dark',
      '1': 'badge-success',
      '2': 'badge-info'
    };

    return classes[selectedValue];
  }
}

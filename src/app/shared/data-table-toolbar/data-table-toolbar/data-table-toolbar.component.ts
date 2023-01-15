import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { brand } from 'src/environments/brand/default/brand';
import { GridFilter } from '../../data-table/data-table.component';
import { DateRangePickerComponent } from '../../forms/components/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-data-table-toolbar',
  templateUrl: './data-table-toolbar.component.html',
  styleUrls: ['./data-table-toolbar.component.scss']
})
export class DataTableToolbarComponent {
  wildCardsImageUrl = 'assets/images/icons/grain-icon.svg';

  @Input() withRefreshButton: boolean = true;
  @Input() withExportButton: boolean = true;

  @Input() form: FormGroup;
  @Input() filters: Array<GridFilter>;
  @Input() gridDataLoading: boolean = false;
  @Input() exportOptions: Array<any> = [];
  @Input() wildCardsEnabled = false;
  @Input() withSearch = true;
  @Input() clearFilterClass = '';
  @Input() refreshButtonClass = '';
  @Input() setDateRangePickerDefaultDate = false;

  @Output() clearSearchClickedEvent = new EventEmitter<any>();
  @Output() reloadGridDataEvent = new EventEmitter<any>();
  @Output() exportDataClickedEvent = new EventEmitter<any>();
  @Output() wildCardsEnabledEvent = new EventEmitter<boolean>();

  @ViewChild('dateRangePicker')
  dateRangePicker: DateRangePickerComponent;

  constructor(private translate: TranslateService) {}

  get startTimeProperty(): string {
    return 'startDate';
  }

  get endTimeProperty(): string {
    return 'endDate';
  }

  resetSearchAndFilters() {
    this.form.reset();
    // resets the date range picker from date to yesterday, end date to today
    this.dateRangePicker.setRange(1);

    this.clearSearchClickedEvent.emit();
  }

  reloadGridData() {
    this.reloadGridDataEvent.emit();
  }

  exportData(event: any) {
    this.exportDataClickedEvent.emit(event);
  }

  searchIconClicked() {
    this.wildCardsEnabled = !this.wildCardsEnabled;
    if (this.wildCardsEnabled) {
      this.wildCardsEnabledEvent.emit(true);
      this.wildCardsImageUrl = 'assets/images/icons/grain-icon-' + brand.brand.toLowerCase() + '.svg'; // branded icon for wildcard search
    } else {
      this.wildCardsEnabledEvent.emit(false);
      this.wildCardsImageUrl = 'assets/images/icons/grain-icon.svg';
    }
  }

  getWildCardToolTipText() {
    let tooltip = this.translate.instant('COMMON.WILDCARDS-SEARCH-DISABLED');
    if (this.wildCardsEnabled) {
      tooltip = this.translate.instant('COMMON.WILDCARDS-SEARCH-ENABLED');
    }
    return tooltip;
  }

  refreshData(event: any) {
    this.reloadGridData();
  }
}

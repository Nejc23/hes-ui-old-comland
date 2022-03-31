import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  @Output() clearSearchClickedEvent = new EventEmitter<any>();
  @Output() reloadGridDataEvent = new EventEmitter<any>();
  @Output() exportDataClickekdEvent = new EventEmitter<any>();

  @ViewChild('dateRangePicker')
  dateRangePicker: DateRangePickerComponent;
  constructor() {}

  get startTimeProperty(): string {
    return 'startDate';
  }

  get endTimeProperty(): string {
    return 'endDate';
  }

  resetSearchAndFilters() {
    this.form.reset();
    // resets the date range picker from date to yesterday, end date to today
    this.dateRangePicker.setRange(2);

    this.clearSearchClickedEvent.emit();
  }

  reloadGridData() {
    this.reloadGridDataEvent.emit();
  }

  exportData(event: any) {
    this.exportDataClickekdEvent.emit(event);
  }
}

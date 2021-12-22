import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { CellClickEvent, GridDataResult, PageChangeEvent, PageSizeItem, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { ScrollMode } from '@progress/kendo-angular-grid/dist/es2015/scrolling/scrollmode';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query/dist/npm/filtering/filter-descriptor.interface';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export interface GridColumn {
  translationKey: string;
  field: string;
  type?: GridColumnType;
  width?: number;
  padding?: number;
  class?: string;
  icon?: string;
  coloredValues?: ColoredValue[];
  progressBar?: ColoredValue;
  tags?: string[];
}

export enum GridColumnType {
  SWITCH = 'switch',
  RADIO = 'radio-button',
  ENUM = 'enum',
  COLORED_ENUM = 'colored-enum',
  BOLD_TEXT = 'bolded-text',
  DATE = 'date',
  DATE_TIME = 'date-time',
  DATE_ONLY = 'date-only',
  CODE_LIST = 'code-list' // dropdowns
}

export interface GridRowAction {
  actionName: string;
  iconName: string;
  link?: string;
}

export interface ColoredValue {
  enumValue: string;
  color: string;
}

export interface GridFilter {
  label?: string;
  field: string;
  values: any[];
}

export interface CheckboxColumn {
  columnMenu: boolean;
  resizable: boolean;
  showSelectAll: boolean;
  width: number;
}

export interface GridBulkAction {
  actionName: string;
  iconClass: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  public gridView: GridDataResult;
  gridViewFilteredData: any; // search of filter applied

  @Input() gridData: any; //   this.data = [...this.data]; // for KendoUI change detection
  @Input() gridColumns: Array<GridColumn> = [];
  @Input() rowActions: Array<GridRowAction> = [];
  @Input() gridBulkActions: Array<GridBulkAction> = [];

  columnType = GridColumnType;
  // Grid properties
  @Input() gridProperties = [];
  @Input() scrollable: ScrollMode = 'none'; // virtual scroll requires fixed height
  @Input() loading = false;
  // buttons over the data table
  @Input() withSearch = false;
  @Input() excelExport = false;
  @Input() refresh = false;
  @Input() filters: Array<GridFilter>; // dropdown filters

  @Input() tableClass;
  //find better solution for solving problem with virtual scroll + sort
  @Input() pageSize = 99999999;
  @Input() skip = 0;
  @Input() pageable = false;
  @Input() stickyHeader = false;
  @Input() tableHeight = 450;
  @Input() total;
  @Input() rowHeight: 44; // required for virtual scroll
  @Input() fetchData = false; // fetch data from API on next page
  @Input() excelFileName = '';
  @Input() noDataText = 'COMMON.NO-RECORDS-FOUND';
  @Input() sortable = false;
  @Input() checkboxColumn: CheckboxColumn;
  @Input() kendoGridSelectByColumn: string = 'id'; // represents the unique grid data property/key for row selection
  @Input() selectedKeys = [];
  @Input() showGridBulkActions = false;
  @Input() showClearFiltersButton = false;
  // dropdown filters and search

  filtersForm;
  searchTerm = '';
  filteredData = [];
  appliedFilters = [];
  existingFilter: any;

  @ViewChild('searchInput', { static: false })
  searchInput: ElementRef;

  @Input()
  sort: SortDescriptor[] = [
    {
      field: 'id',
      dir: 'desc'
    }
  ];

  pageNumber = 1;
  pageSizes: PageSizeItem[] = [
    {
      text: '5',
      value: 5
    },
    {
      text: '20',
      value: 20
    },
    {
      text: 'All',
      value: 'all'
    }
  ];
  @Output() switchClickedEvent = new EventEmitter<any>();
  @Output() rowActionClickedEvent = new EventEmitter<any>();
  @Output() selectedCellEvent = new EventEmitter<CellClickEvent>();
  @Output() selectedRowDataEvent = new EventEmitter<any>();
  @Output() pageChangedEvent = new EventEmitter<PageChangeEvent>();
  @Output() bulkActionClickedEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    if (this.withSearch && this.gridColumns.length === 0) {
      console.log('Grid columns should be defined for search!!');
    }
    this.initGrid();
    this.allData = this.allData.bind(this);
  }

  mySelectionKey(context: RowArgs): string {
    return context.dataItem;
  }

  rowClass(context: RowClassArgs) {
    const isEven = context.index % 2 == 0;
    return {
      'gray-background': isEven,
      'white-background': !isEven
    };
  }

  ngOnChanges(): void {
    // data changed
    this.initGrid();
  }

  switchValueChanged(id: string, event: Event) {
    this.switchClickedEvent.emit({ id: id, value: event });
  }

  onRowActionClick(actionName: string, id: string, rowData?: any) {
    this.rowActionClickedEvent.emit({ actionName: actionName, id: id, rowData: rowData });
  }

  onBulkActionClick(actionName: string) {
    this.bulkActionClickedEvent.emit({ actionName: actionName, selectedKeys: this.selectedKeys });
  }

  kendoGridSelectBy = (context: RowArgs) => {
    return context.dataItem[this.kendoGridSelectByColumn];
  };

  public pageChange(event: PageChangeEvent): void {
    // fetch data from API
    if (this.fetchData && this.pageNumber * this.pageSize < this.total) {
      this.pageNumber++;
      this.loading = true;
      this.pageChangedEvent.emit(event);
    } else {
      // client side data
      this.skip = event.skip;
      this.loadItems(this.gridData, this.total ? this.total : this.gridData.length);
    }
  }

  colorExist(enumValue: string, coloredValues: ColoredValue[]) {
    if (enumValue && coloredValues.length > 0) {
      const exist = coloredValues.find((item) => item.enumValue.toLowerCase() === enumValue.toLowerCase());
      if (exist) {
        return exist.color;
      }
      return '';
    }
  }

  public allData(): ExcelExportData {
    return {
      data: process(this.gridData, {
        sort: [{ field: 'id', dir: 'asc' }] // currently we export ALL data
      }).data
    };
  }

  public onSearch(inputValue: string): void {
    this.searchTerm = inputValue;

    if (this.searchTerm !== '') {
      this.skip = 0;
      this.applySearch(this.searchTerm);
    } else {
      // remove filters
      // this.filteredData = this.gridData;
      this.applyFilter('', '');
    }
  }

  applySearch(searchValue: string) {
    // or for search
    const filter: CompositeFilterDescriptor = {
      logic: 'or',
      filters: []
    };
    // Search all only for string fields
    // columns need to be defined for Search all
    const columns = this.gridColumns.filter((column) => column.type !== (GridColumnType.SWITCH || GridColumnType.RADIO));

    columns.forEach((column) => {
      // date time formatting, search by date fix
      if (column.type === GridColumnType.DATE_TIME) {
        searchValue = searchValue.replace(/[^\w\s]/gi, '').replace(/\s/g, '');
        this.gridData.forEach((row) => {
          row['formatted-date'] =
            moment(row[column.field]).format(environment.dateDisplayFormat) +
            ' ' +
            moment(row[column.field]).format(environment.timeFormatLong);
          row['formatted-date'] = row['formatted-date'].replace(/[^\w\s]/gi, '').replace(/\s/g, '');
        });
        // formatted date for search only
        filter.filters.push({
          field: 'formatted-date',
          operator: 'contains',
          value: searchValue,
          ignoreCase: true
        });
      } else {
        // add other columns
        filter.filters.push({
          field: column.field,
          operator: 'contains',
          value: searchValue,
          ignoreCase: true
        });
      }
    });

    // Kendo UI filter data
    this.gridViewFilteredData = process(this.gridViewFilteredData, {
      filter: filter
    }).data;

    // save filtered data
    this.filteredData = this.gridViewFilteredData;
    // load grid
    this.loadItems(this.gridViewFilteredData, this.gridViewFilteredData.length);
  }

  dropdownFilterValueChanged(value, field) {
    this.skip = 0;
    // this.gridViewFilter = this.gridData; // all data
    this.existingFilter = null;
    // check if filter already exist exist
    if (this.appliedFilters && this.appliedFilters.find((filter) => filter.field === field)) {
      // apply new value
      this.existingFilter = this.appliedFilters.find((filter) => filter.field === field);
      this.existingFilter.value = value;
    }

    if (value !== 'All') {
      this.applyFilter(field, value);
    } else {
      if (this.existingFilter && this.appliedFilters) {
        if (this.appliedFilters?.length > 0) {
          this.appliedFilters = this.appliedFilters.filter((filter) => filter.field !== field);
          this.applyFilter(field, value);
        }
      } else {
        this.appliedFilters = [];
      }
      if (this.searchTerm !== '') {
        this.applySearch(this.searchTerm);
      }
    }

    this.filteredData = this.gridViewFilteredData;
    this.loadItems(this.gridViewFilteredData, this.gridViewFilteredData.length);
  }

  applyFilter(field: string, value: any) {
    debugger;
    this.gridViewFilteredData = this.gridData; // check
    if (this.searchTerm !== '') {
      this.applySearch(this.searchTerm);
    }

    if (field === '' && this.appliedFilters.length === 0) {
      this.gridViewFilteredData = this.gridData;
    }

    const filterTemp: CompositeFilterDescriptor = {
      logic: 'and',
      filters: []
    };
    if (!this.existingFilter && field !== '') {
      this.appliedFilters.push({
        field: field,
        operator: 'eq',
        value: value,
        ignoreCase: true
      });
    }

    filterTemp.filters = this.appliedFilters;
    this.gridViewFilteredData = process(this.gridViewFilteredData, {
      filter: filterTemp
    }).data;

    this.loadItems(this.gridViewFilteredData, this.gridViewFilteredData.length);
  }

  initGrid() {
    if (this.gridData) {
      this.loadItems(this.gridData, this.total ? this.total : this.gridData.length);
    } else {
      // no data
      this.gridView = {
        data: [],
        total: 0
      };
    }
    this.loading = false;
  }

  cellClick(event: CellClickEvent) {
    this.selectedCellEvent.emit(event);
  }

  selectedCellChange(event: any) {
    this.selectedRowDataEvent.emit(event);
  }

  getCurrentDateTime() {
    return moment().format(environment.dateDisplayFormat) + ' ' + moment().format(environment.timeFormatLong);
  }

  public sortChange(sort: SortDescriptor[]): void {
    let data = this.gridData;
    if (this.filtersApplied()) {
      data = this.filteredData;
    }
    this.sort = sort;
    this.loadItems(data, this.total ? this.total : data.length, this.sort);
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.appliedFilters = [];
    this.searchInput.nativeElement.value = '';
    this.applyFilter('', '');
  }

  filtersApplied() {
    return this.searchTerm !== '' || this.appliedFilters.length > 0;
  }

  private loadItems(data: any, count: number, sort?: any): void {
    if (data) {
      this.gridView = {
        data: orderBy(data.slice(this.skip, this.skip + this.pageSize), this.sort),
        total: count
      };
    } else {
      this.initGrid();
    }
  }
}

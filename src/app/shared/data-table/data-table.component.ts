import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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
  gridViewFilter: any;
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
  @Input() pageSize = 12;
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

  public onFilter(inputValue: string): void {
    this.skip = 0;
    this.gridViewFilter = this.gridData;
    const filterTemp: CompositeFilterDescriptor = {
      logic: 'or',
      filters: []
    };
    // Search all only for string fields
    // columns need to be defined for Search all
    const columns = this.gridColumns.filter((column) => column.type !== (GridColumnType.SWITCH || GridColumnType.RADIO));
    columns.forEach((column) => {
      filterTemp.filters.push({
        field: column.field,
        operator: 'contains',
        value: inputValue,
        ignoreCase: true
      });
    });

    this.gridViewFilter = process(this.gridData, {
      filter: filterTemp
    }).data;

    this.loadItems(this.gridViewFilter, this.gridViewFilter.length);
  }

  dropdownValueChanged(value, field) {
    this.gridViewFilter = this.gridData;

    if (value !== 'All') {
      const filterTemp: CompositeFilterDescriptor = {
        logic: 'and',
        filters: []
      };
      filterTemp.filters.push({
        field: field,
        operator: 'eq',
        value: value,
        ignoreCase: true
      });
      this.gridViewFilter = process(this.gridData, {
        filter: filterTemp
      }).data;
    }

    this.loadItems(this.gridViewFilter, this.gridViewFilter.length);
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
    this.sort = sort;
    this.loadItems(this.gridData, this.total ? this.total : this.gridData.length, this.sort);
  }

  private loadItems(data: any, count: number, sort?: any): void {
    if (data) {
      this.gridView = {
        data: orderBy(data.slice(this.skip, this.skip + this.pageSize), this.sort),
        total: count
      };
    }
  }
}

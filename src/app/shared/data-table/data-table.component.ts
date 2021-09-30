import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { GridDataResult, PageChangeEvent, PageSizeItem, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { ScrollMode } from '@progress/kendo-angular-grid/dist/es2015/scrolling/scrollmode';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { process } from '@progress/kendo-data-query';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query/dist/npm/filtering/filter-descriptor.interface';

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
  ICON = 'icon',
  DATE_TIME = 'date-time'
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

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  public gridView: GridDataResult;
  gridViewFilter: any;
  @Input() gridData: any;
  @Input() gridColumns: Array<GridColumn> = [];
  @Input() rowActions: Array<GridRowAction> = [];

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
  @Input() tableHeight;
  @Input() total;
  @Input() rowHeight: number; // required for virtual scroll
  @Input() fetchData = false; // fetch data on next page

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
  @Output() selectedRowDataEvent = new EventEmitter<any>();
  @Output() pageChangedEvent = new EventEmitter<PageChangeEvent>();

  constructor() {}

  public mySelectionKey(context: RowArgs): string {
    return context.dataItem;
  }

  ngOnInit(): void {
    if (this.withSearch && this.gridColumns.length === 0) {
      console.log('Grid columns should be defined for search!!');
    }
    this.initGrid();
    this.allData = this.allData.bind(this);
  }

  rowClass(context: RowClassArgs) {
    const isEven = context.index % 2 == 0;
    return {
      'gray-background': isEven,
      'white-background': !isEven
    };
  }

  ngOnChanges(): void {
    this.initGrid();
  }

  switchValueChanged(id: string, event: Event) {
    this.switchClickedEvent.emit({ id: id, value: event });
  }

  onRowActionClick(actionName: string, id: string, rowData?: any) {
    this.rowActionClickedEvent.emit({ actionName: actionName, id: id, rowData: rowData });
  }

  // pageChange({ skip, take }: PageChangeEvent): void {
  //   this.skip = skip;
  //   this.pageSize = take;
  //   this.loadItems(this.gridData);
  //   // todo page change event
  //   this.stateChange.next(this.state);
  // }

  public pageChange(event: PageChangeEvent): void {
    // fetch data from API
    if (this.fetchData && this.pageNumber * this.pageSize < this.total) {
      this.pageNumber++;
      this.loading = true;
      this.pageChangedEvent.emit(event);
    } else {
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
        sort: [{ field: 'id', dir: 'asc' }] // todo export By
      }).data
    };
  }

  // todo refactor
  public onFilter(inputValue: string): void {
    this.skip = 0;
    this.gridViewFilter = this.gridData;
    const filterTemp: CompositeFilterDescriptor = {
      logic: 'or',
      filters: []
    };
    // Search all only for string fields
    // columns need to be defined for Search
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
    // todo add type
    this.gridViewFilter = this.gridData;

    if (value !== 'All') {
      const filterTemp: CompositeFilterDescriptor = {
        logic: 'and',
        filters: []
      };
      // Search all only for string fields
      // columns need to be defined for Search

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
      this.gridView = {
        data: [],
        total: 0
      };
    }
    this.loading = false;
  }

  selectedCell(event: any) {
    this.selectedRowDataEvent.emit(event.dataItem);
  }

  private loadItems(data: any, count: number): void {
    if (data) {
      this.gridView = {
        data: data.slice(this.skip, this.skip + this.pageSize),
        total: count
      };
    }
  }
}

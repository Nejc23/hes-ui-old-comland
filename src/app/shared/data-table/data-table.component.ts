import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridDataResult, PageChangeEvent, PageSizeItem, RowClassArgs } from '@progress/kendo-angular-grid';
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
export class DataTableComponent implements OnInit {
  public gridView: GridDataResult;
  gridViewFilter: any;
  @Input() gridData: any;
  @Input() simpleGrid = true; // todo check if needed

  @Input() gridColumns: Array<GridColumn> = [];
  @Input() rowActions: Array<GridRowAction> = [];

  @Input() filters: Array<GridFilter>; // dropdown filters

  columnType = GridColumnType;
  // Grid properties
  @Input() gridProperties = [];
  @Input() scrollable: ScrollMode = 'none';
  @Input() loading = false;
  @Input() withSearch = false;
  @Input() excelExport = false;

  @Input() tableClass;
  @Input() pageSize = 12;
  @Input() skip = 0;
  @Input() pageable = false;
  @Input() stickyHeader = false;
  @Input() tableHeight = 0;
  @Input() totalRecords;

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

  constructor() {}

  ngOnInit(): void {
    if (this.withSearch && this.gridColumns.length === 0) {
      debugger;
      console.log('Grid columns should be defined for search!!');
    }
    this.loadItems(this.gridData);
    this.allData = this.allData.bind(this);
  }

  rowClass(context: RowClassArgs) {
    const isEven = context.index % 2 == 0;
    return {
      'gray-background': isEven,
      'white-background': !isEven
    };
  }

  switchValueChanged(id: string, event: Event) {
    this.switchClickedEvent.emit({ id: id, value: event });
  }

  onRowActionClick(actionName: string, id: string) {
    this.rowActionClickedEvent.emit({ actionName: actionName, id: id });
  }

  pageChange({ skip, take }: PageChangeEvent): void {
    debugger;
    this.skip = skip;
    this.pageSize = take;
    this.loadItems(this.gridData);
  }

  colorExist(enumValue: string, coloredValues: ColoredValue[]) {
    if (enumValue && coloredValues.length > 0) {
      let exist = coloredValues.find((item) => item.enumValue.toLowerCase() === enumValue.toLowerCase());
      if (exist) {
        return exist.color;
      }
      return '';
    }
  }

  public allData(): ExcelExportData {
    return {
      data: process(this.gridData, {
        sort: [{ field: 'id', dir: 'asc' }]
      }).data
    };
  }

  // todo refactor
  public onFilter(inputValue: string): void {
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
    // todo load more data from BE
    this.loadItems(this.gridViewFilter);
  }

  dropdownValueChanged(value, field) {
    debugger;
    // todo load more data from BE
    this.gridViewFilter = this.gridData;

    if (value !== 'All') {
      let filterTemp: CompositeFilterDescriptor = {
        logic: 'and',
        filters: []
      };
      // Search all only for string fields
      // columns need to be defined for Search

      filterTemp.filters.push({
        field: field,
        operator: 'eq',
        value: value.toString(),
        ignoreCase: true
      });

      this.gridViewFilter = process(this.gridData, {
        filter: filterTemp
      }).data;
      // todo load more data from BE
      this.loadItems(this.gridViewFilter);
    }
  }

  private loadItems(data: any): void {
    this.gridView = {
      data: data.slice(this.skip, this.skip + this.pageSize),
      total: this.totalRecords ? this.totalRecords : this.gridData.length
    };
  }
}

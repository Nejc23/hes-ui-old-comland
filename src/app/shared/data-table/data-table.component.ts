import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridDataResult, PageChangeEvent, PageSizeItem, RowClassArgs } from '@progress/kendo-angular-grid';
import { ScrollMode } from '@progress/kendo-angular-grid/dist/es2015/scrolling/scrollmode';

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

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  public gridView: GridDataResult;
  @Input() gridData: any;
  @Input() simpleGrid = true;
  // todo objects
  @Input() gridColumns: Array<GridColumn> = [];
  @Input() rowActions: Array<GridRowAction> = [];
  columnType = GridColumnType;
  // Grid properties
  @Input() gridProperties = [];
  @Input() scrollable: ScrollMode = 'none';
  @Input() loading = false;

  @Input() tableClass;
  @Input() pageSize = 12;
  @Input() skip = 0;
  @Input() pageable = false;
  @Input() stickyHeader = false;
  @Input() tableHeight = 0;
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
    this.loadItems();
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
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
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

  private loadItems(): void {
    this.gridView = {
      data: this.gridData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridData.length
    };
  }
}

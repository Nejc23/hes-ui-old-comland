import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { ScrollMode } from '@progress/kendo-angular-grid/dist/es2015/scrolling/scrollmode';

export interface GridColumn {
  translationKey: string;
  field: string;
  type?: GridColumnType;
  width?: number;
  padding?: number;
  class?: string;
  icon?: string;
  enum?: ColoredValue;
  progressBar?: ColoredValue;
  tags?: string[];
}

export enum GridColumnType {
  SWITCH = 'switch',
  RADIO = 'radio-button',
  ENUM = 'enum',
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
  value: any;
  colors: string[];
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() gridData: any;
  @Input() simpleGrid = true;
  // todo objects
  @Input() gridColumns: Array<GridColumn> = [];
  @Input() rowActions: Array<GridRowAction> = [];

  // Grid properties
  @Input() gridProperties = [];
  @Input() scrollable: ScrollMode = 'none';
  @Input() loading = false;

  @Input() pageSize = 10;
  @Input() skip = 0;
  @Input() pageable = false;
  columnType = GridColumnType;

  @Output() switchClickedEvent = new EventEmitter<any>();
  @Output() rowActionClickedEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

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
}

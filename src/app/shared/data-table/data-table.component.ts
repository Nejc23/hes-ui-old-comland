import { Component, Input, OnInit } from '@angular/core';
import { RowClassArgs } from '@progress/kendo-angular-grid';

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
  TEXT,
  SWITCH,
  RADIO,
  ENUM,
  DATE,
  ICON,
  DATE_TIME
}

export interface GridRowAction {
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
  @Input() gridProperties = [];
  @Input() rowActions: Array<GridRowAction> = [];

  columnType = GridColumnType;

  constructor() {}

  ngOnInit(): void {}

  rowClass(context: RowClassArgs) {
    const isEven = context.index % 2 == 0;
    return {
      'gray-background': isEven,
      'white-background': !isEven
    };
  }
}

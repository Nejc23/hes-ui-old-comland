import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, ViewChild } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable/lib/types/table-column.type';
import * as _ from 'lodash';
import { ColumnMode, ClickType, DatatableComponent } from '@swimlane/ngx-datatable';
import { TableMessage } from '../helpers/table-message.helper';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html'
})
export class SimpleTableComponent implements OnInit, AfterViewChecked {
  @Input() columns: Array<TableColumn> = [];
  // any because we do not know and dont need to know type of rows.
  @Input() rows: Array<any> = [];
  @Input() selected: Array<any> = [];

  @Input() columnMode: ColumnMode = ColumnMode.force;

  // emits selected row
  @Output() selectRow = new EventEmitter<any>();

  @ViewChild('tableWrapper', { static: true }) tableWrapper;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  selectionType = ClickType.single;

  public tableMessages = new TableMessage();
  private currentComponentWidth;

  constructor(private tableService: TableService) {}

  ngOnInit() {
    this.tableMessages = this.tableService.translateTableMessages();
  }

  // This is a check function if we can select a row.
  // Intention is to not auto select on click but rather decide on upper level.
  onSelectRow(selection: any) {
    this.selectRow.emit(selection);
    return false;
  }

  rowIdentity(row: any) {
    return row.id;
  }

  get selectRowFunction() {
    return _.bind(this.onSelectRow, this);
  }

  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      setTimeout(() => {
        // zaradi bug-a v ngx-datatable dodan timeout, da se lahko tabela ustrezno resize-a
        this.rows = [...this.rows];
      }, 10);
    }
  }
}

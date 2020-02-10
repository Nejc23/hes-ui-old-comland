import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, ViewChild } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable/lib/types/table-column.type';
import { TableState } from '../models/table-state.model';
import { SortPropDir, SortDirection, DatatableComponent } from '@swimlane/ngx-datatable';
import { TableQueryResponse } from '../interfaces/table-response.interface';
import * as _ from 'lodash';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-table-client',
  templateUrl: './table-client.component.html'
})
export class TableClientComponent implements OnInit, AfterViewChecked {
  @Input() data: TableQueryResponse<any>;
  @Input() rows: Array<any> = [];
  // Optional - if not present labels will match property names
  @Input() columns: Array<TableColumn> = [];
  @Input() recordCount: number;
  @Input() pageSize: number;
  @Input() defaultSort: SortPropDir = { prop: 'id', dir: SortDirection.desc };

  // emits selected row
  @Output() selectRow = new EventEmitter<any>();

  @ViewChild('tableWrapper', { static: true }) tableWrapper;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  state: TableState = new TableState();
  selected: any = [];
  private currentComponentWidth;

  constructor(private tableService: TableService) {}

  ngOnInit() {
    this.state.initialSort = this.defaultSort;
    this.state.messages = this.tableService.translateTableMessages();
    this.state.messages.selectedMessage = '';
  }

  onSelect($event) {
    setTimeout(() => {
      this.selectRow.emit($event);
      return false;
    });
  }

  get tablePage() {
    return this.state.tableRequest.pageSettings;
  }

  onActivate(event: any) {
    if (event.type === 'click' || event.type === 'dblclick') {
      event.cellElement.blur();
    }
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

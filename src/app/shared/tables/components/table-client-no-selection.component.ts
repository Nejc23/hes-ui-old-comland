import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewChecked } from '@angular/core';
import { TableState } from '../models/table-state.model';
import { SortPropDir, SortDirection, DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { TableQueryResponse } from '../interfaces/table-response.interface';
import * as _ from 'lodash';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-table-client-no-selection',
  templateUrl: './table-client-no-selection.component.html'
})
export class TableClientNoSelectionComponent implements OnInit, AfterViewChecked {
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
    this.state.messages = this.tableService.translateTableMessages();
    this.state.initialSort = this.defaultSort;
  }

  onSelect($event) {
    this.selectRow.emit($event);
    return false;
  }

  get tablePage() {
    return this.state.tableRequest.pageSettings;
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

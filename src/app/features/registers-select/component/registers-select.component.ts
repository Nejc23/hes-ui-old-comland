import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { Observable } from 'rxjs';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { RegistersSelectGridService } from '../services/registers-select-grid.service';
import * as _ from 'lodash';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActionFormStaticTextService } from '../../data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { RegistersSelectRequest } from 'src/app/core/repository/interfaces/registers-select/registers-select-request.interface';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

@Component({
  selector: 'app-registers-select',
  templateUrl: './registers-select.component.html'
})
export class RegistersSelectComponent implements OnInit {
  @Input() type = 'meter';
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelectionChanged = new EventEmitter<boolean>();

  form: FormGroup;
  searchTextEmpty = true;
  public modules: Module[] = AllModules;
  public gridApi;
  columnDefs = [];
  rowData$: Observable<RegistersSelectList[]>;
  rowData: RegistersSelectList[];
  allRowData: RegistersSelectList[];
  totalCount = 0;
  selectedAll = false;

  constructor(
    private registersSelectService: RegistersSelectService,
    private registersSelectGridService: RegistersSelectGridService,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private jobsService: JobsService
  ) {}

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: ['']
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.loadData();
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  selectRows(selectedRows: RegistersSelectRequest[]) {
    if (this.gridApi) {
      // this.columnDefs = this.registersSelectGridService.setGridReadOnlyColumns();
      this.gridApi.forEachNode((node) => {
        if (
          node.data !== undefined &&
          selectedRows.length > 0 &&
          _.find(selectedRows, (x) => x === node.data.id && !node.selected) !== undefined
        ) {
          node.setSelected(true);
        }
      });
    }
  }

  loadData() {
    if (!this.deviceFiltersAndSearch) {
      this.deviceFiltersAndSearch = { id: [], filter: null };
    }
    this.rowData$ = this.registersSelectService.getDeviceRegisters(this.deviceFiltersAndSearch);
    this.rowData$.subscribe((x) => {
      this.allRowData = x;
      this.totalCount = this.allRowData ? this.allRowData.length : 0;
      this.searchChange();
      if (this.selectedJobId) {
        this.jobsService.getJob(this.selectedJobId).subscribe((data) => {
          this.selectRows(data.registers);
        });
      }
    });
  }

  ngOnInit() {
    this.form = this.createForm();
    this.columnDefs = this.registersSelectGridService.setGridDefaultColumns();
  }

  getSelectedRowIds() {
    const selectedRows = this.gridApi.getSelectedRows();
    const req: RegistersSelectRequest[] = [];
    selectedRows.forEach((x) => req.push({ name: x.name, type: x.type }));
    return req;
  }

  get selectedAtLeastOneRowOnGrid() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  deselectAllRows() {
    this.gridApi.deselectAll();
    this.selectedAll = false;
  }

  selectAllRows() {
    this.gridApi.selectAll();
    this.selectedAll = true;
  }

  searchChange(search: string = '') {
    const searchToLower = search.toLowerCase();
    this.rowData = _.filter(
      this.allRowData,
      (data) =>
        data.name.toLowerCase().includes(searchToLower) ||
        data.type.toLowerCase().includes(searchToLower) ||
        data.description.toLowerCase().includes(searchToLower)
    );
    this.totalCount = this.rowData.length;
  }

  insertedValue($event: string) {
    if ($event !== undefined) {
      this.searchTextEmpty = $event.length === 0;
    } else {
      this.searchTextEmpty = true;
    }
    this.searchChange($event);
  }

  selectionChanged($event: any) {
    this.selectedAll = this.getSelectedRowIds().length === this.totalCount;
    this.onSelectionChanged.emit(this.getSelectedRowIds().length > 0 ? true : false);
  }

  get searchProperty() {
    return 'content';
  }
}

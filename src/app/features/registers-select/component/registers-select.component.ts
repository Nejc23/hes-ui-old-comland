import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { RegistersSelectGridService } from '../services/registers-select-grid.service';
import * as _ from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionFormStaticTextService } from '../../data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { SchedulerJobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SchedulableRegistersType } from '../../../core/repository/interfaces/registers-select/schedulable-registers-type.interface';
import { RegistersSelectRequest } from '../../../core/repository/interfaces/registers-select/registers-select-request.interface';

@Component({
  selector: 'app-registers-select',
  templateUrl: './registers-select.component.html'
})
export class RegistersSelectComponent implements OnInit {
  @Input() type = 'meter';
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSelectionChanged = new EventEmitter<boolean>();

  form: FormGroup;
  searchTextEmpty = true;
  public modules: Module[] = AllModules;
  public gridApi;
  columnDefs = [];
  rowData: SchedulableRegistersType[];
  allRowData: SchedulableRegistersType[];
  totalCount = 0;
  selectedAll = false;
  allHaveTemplate = true;
  frameworkComponents: any;

  constructor(
    private registersSelectService: RegistersSelectService,
    private registersSelectGridService: RegistersSelectGridService,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private jobsService: SchedulerJobsService
  ) {}

  get selectedAtLeastOneRowOnGrid() {
    return this.gridApi?.getSelectedRows()?.length > 0;
  }

  get searchProperty() {
    return 'content';
  }

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
          _.find(selectedRows, (x) => x === node.data.name && !node.selected) !== undefined
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

    const rowData$ = this.registersSelectService.getSchedulableRegisters(this.deviceFiltersAndSearch);
    rowData$.subscribe((x) => {
      this.allRowData = x.schedulableRegistersTypes;
      this.totalCount = this.allRowData ? this.allRowData.length : 0;
      this.allHaveTemplate = x.allHaveTemplate;
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
    this.frameworkComponents = this.registersSelectGridService.setFrameworkComponents();
  }

  getSelectedRowNames() {
    const selectedRows = this.gridApi.getSelectedRows();
    const req: SchedulableRegistersType[] = [];
    selectedRows.forEach((x) => req.push(x.name));
    return req;
  }

  searchChange(search: string = '') {
    const searchToLower = search.toLowerCase();
    const rowsFiltered: SchedulableRegistersType[] = _.filter(this.allRowData, (data) => data.name.toLowerCase().includes(searchToLower));

    this.rowData = rowsFiltered.sort((a, b) => {
      return +a.isSelectable > +b.isSelectable ? -1 : a.name < b.name ? -1 : 1;
    });

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
    this.selectedAll = this.getSelectedRowNames().length === this.totalCount;
    this.onSelectionChanged.emit(this.getSelectedRowNames().length > 0);
  }

  isRowSelectable(rowNode) {
    return rowNode.data.isSelectable;
  }
}

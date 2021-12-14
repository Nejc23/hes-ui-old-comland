import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllModules, GridOptions, Module } from '@ag-grid-enterprise/all-modules';
import { Observable } from 'rxjs';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import * as _ from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { configAgGrid, enumSearchFilterOperators } from 'src/environments/config';
import { JobsSelectGridService } from '../services/jobs-select-grid.service';
import { ActionFormStaticTextService } from 'src/app/features/data-concentrator-units/components/action-form/services/action-form-static-text.service';

@Component({
  selector: 'app-jobs-select',
  templateUrl: './jobs-select.component.html'
})
export class JobsSelectComponent implements OnInit {
  // @Input() type = 'meter';
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSelectionChanged = new EventEmitter<boolean>();
  @Input() height = '378px';

  @Input() jobTypes: number[];

  form: FormGroup;
  searchTextEmpty = true;
  loadGrid = true;
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  public icons;
  public frameworkComponents;
  public sideBar;
  totalCount = 0;
  columnDefs = [];
  rowData$: Observable<RegistersSelectList[]>;
  rowData: RegistersSelectList[];
  allRowData: RegistersSelectList[];
  selectedAll = false;
  public pageSize = 10;
  requestModel: GridRequestParams;
  private gridColumnApi;

  constructor(
    private jobsSelectGridService: JobsSelectGridService,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private jobsService: JobsService
  ) {
    this.gridOptions = this.jobsSelectGridService.setGridOptions();
    this.frameworkComponents = jobsSelectGridService.setFrameworkComponents();
    // this.jobsSelectGridService.clearSessionSettingsSelectedRows();
  }

  get selectedAtLeastOneRowOnGrid() {
    const selectedRows = this.jobsSelectGridService.getSessionSettingsSelectedRows();
    return selectedRows.length > 0;
  }

  get searchProperty() {
    return 'content';
  }

  createForm(): FormGroup {
    const searchedValue = this.jobsSelectGridService.getSessionSettingsSearchedText();
    return this.fb.group({
      ['content']: [''],
      [this.searchProperty]: [searchedValue]
    });
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  // select rows on load grid from session
  selectRows() {
    const selectedRows = this.jobsSelectGridService.getSessionSettingsSelectedRows();
    this.gridApi.forEachNode((node) => {
      if (node.data !== undefined && selectedRows !== undefined && selectedRows.length > 0) {
        const isSelected = _.find(selectedRows, (x) => x === node.data.id) !== undefined;
        node.setSelected(isSelected);
      }
    });
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
    this.icons = {
      filter: ''
    };

    this.requestModel = {
      requestId: null,
      startRow: 0,
      endRow: 0,
      sortModel: [
        {
          colId: 'name',
          sort: 'asc'
        }
      ],
      searchModel: [],
      filterModel: {
        states: [{ id: 0, value: '' }],
        readStatus: {
          operation: { id: '', value: '' },
          value1: 0,
          value2: null
        },
        types: this.jobTypes,
        tags: [{ id: 0, value: '' }],
        showOptionFilter: null
      }
    };

    const dataFromCookie = this.jobsSelectGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const cookieSort = this.jobsSelectGridService.getCookieDataSortModel();
    if (cookieSort !== undefined && cookieSort !== null && this.gridColumnApi) {
      this.gridColumnApi.applyColumnState({ state: cookieSort });
    }

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = 0;
        that.requestModel.endRow = 100;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.searchModel = that.setSearch();

        const currentPageIndex = that.jobsSelectGridService.getSessionSettingsPageIndex();
        const allDisplayedColumns = that.getAllDisplayedColumnsNames();

        that.jobsService.getSchedulerJobsListForm(that.requestModel, currentPageIndex, allDisplayedColumns).subscribe((data) => {
          that.gridApi.hideOverlay();
          that.totalCount = data.totalCount;
          if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch()) {
          } else if (data.totalCount === 0) {
            that.gridApi.showNoRowsOverlay();
          }

          that.gridApi.paginationGoToPage(that.jobsSelectGridService.getSessionSettingsPageIndex());
          paramsRow.successCallback(data.data, data.totalCount);
          that.selectRows();
          that.sizeColumnsToFit();
        });
      }
    };

    this.gridApi.setServerSideDatasource(datasource);
  }

  getAllDisplayedColumnsNames(): string[] {
    if (this.gridColumnApi) {
      const columns = this.gridColumnApi.getAllDisplayedColumns();
      return columns.map((c) => c.colId);
    }
    return;
  }

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.jobsSelectGridService.onColumnVisibility(params);
  }

  // ----------------------- ag-grid set DATASOURCE end --------------------------

  // click on check-box in the grid
  selectionChanged($event: any) {
    this.selectedAll = this.getSelectedRowIds().length === this.totalCount;
    this.onSelectionChanged.emit(this.getSelectedRowIds().length > 0 ? true : false);

    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    if (params.node.selected) {
      this.jobsSelectGridService.setSessionSettingsSelectedRows(params.node.data.id);
    } else {
      this.jobsSelectGridService.setSessionSettingsRemoveSelectedRow(params.node.data.id);
    }
  }

  setSearch() {
    const search = this.jobsSelectGridService.getSessionSettingsSearchedText();

    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search, useWildcards: false }]);
    }
    return [];
  }

  ngOnInit() {
    this.form = this.createForm();
    this.columnDefs = this.jobsSelectGridService.setGridDefaultColumns();
  }

  getSelectedRowIds() {
    return this.jobsSelectGridService.getSessionSettingsSelectedRows();
  }

  getSelectedRowsCount() {
    return this.jobsSelectGridService.getSessionSettingsSelectedRows().length;
  }

  searchChange($event: string = '') {
    if ($event !== this.jobsSelectGridService.getSessionSettingsSearchedText()) {
      // this.jobsSelectGridService.clearSessionSettingsSelectedRows();
      this.jobsSelectGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards: false }];

      this.jobsSelectGridService.setSessionSettingsPageIndex(0);
      this.gridApi.onFilterChanged();
    }
  }

  sizeColumnsToFit() {
    if (this.gridApi) {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 10);
    }
  }

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }
}

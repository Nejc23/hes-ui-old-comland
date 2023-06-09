import { AllModules, GridOptions, Module } from '@ag-grid-enterprise/all-modules';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { SchedulerJobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { configAgGrid, enumSearchFilterOperators } from 'src/environments/config';
import { ActionFormStaticTextService } from '../../data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { DataConcentratorUnitsSelectGridService } from '../services/data-concentrator-units-select-grid.service';

@Component({
  selector: 'app-data-concentrator-units-select',
  templateUrl: './data-concentrator-units-select.component.html'
})
export class DataConcentratorUnitsSelectComponent implements OnInit {
  @Input() type = 'meter';
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;
  @Input() scheduleDevices = [];
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSelectionChanged = new EventEmitter<boolean>();

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
  requestModel: GridRequestParams = {
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
      types: [0],
      tags: [{ id: 0, value: '' }],
      showOptionFilter: null
    }
  };
  private gridColumnApi;

  constructor(
    private repositoryService: DataConcentratorUnitsService,
    private dataConcentratorUnitsSelectGridService: DataConcentratorUnitsSelectGridService,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private formUtils: FormsUtilsService,
    private jobsService: SchedulerJobsService
  ) {
    this.gridOptions = this.dataConcentratorUnitsSelectGridService.setGridOptions();
    this.frameworkComponents = dataConcentratorUnitsSelectGridService.setFrameworkComponents();
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsPageIndex(0);
    // this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedRowsById([]);
  }

  get selectedAtLeastOneRowOnGrid() {
    // if (this.gridApi) {
    //   const selectedRows = this.gridApi.getSelectedRows();
    //   if (selectedRows && selectedRows.length > 0) {
    //     return true;
    //   }
    //   return false;
    // }
    // return false;
    const selectedAll = this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedAll();
    if (selectedAll) {
      return true;
    }
    const selectedRows = this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedRows();
    return selectedRows.length > 0;
  }

  get searchProperty() {
    return 'content';
  }

  createForm(): FormGroup {
    const searchedValue = this.dataConcentratorUnitsSelectGridService.getSessionSettingsSearchedText();
    return this.fb.group({
      ['content']: [''],
      [this.searchProperty]: [searchedValue]
    });
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  // select rows on load grid from session
  selectRows(api: any) {
    const selectedRows =
      this.scheduleDevices.length > 0 ? this.scheduleDevices : this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedRows();
    api.forEachNode((node) => {
      if (this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedAll()) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        api.forEachNode((node2) => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedAll()
      ) {
        const isSelected = _.find(selectedRows, (x) => x === node.data.concentratorId) !== undefined;
        node.setSelected(isSelected);
      }
    });
  }

  loadData() {
    if (!this.deviceFiltersAndSearch) {
      this.deviceFiltersAndSearch = { id: [], filter: null };
    }
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

    const dataFromCookie = this.dataConcentratorUnitsSelectGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const cookieSort = this.dataConcentratorUnitsSelectGridService.getCookieDataSortModel();
    if (cookieSort !== undefined && cookieSort !== null && this.gridColumnApi) {
      this.gridColumnApi.applyColumnState({ state: cookieSort });
    }

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = that.dataConcentratorUnitsSelectGridService.getCurrentRowIndex(
          that.gridApi.paginationProxy.pageSize
        ).startRow;
        that.requestModel.endRow = that.dataConcentratorUnitsSelectGridService.getCurrentRowIndex(
          that.gridApi.paginationProxy.pageSize
        ).endRow;

        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();

        const currentPageIndex = that.dataConcentratorUnitsSelectGridService.getSessionSettingsPageIndex() + 1;
        const allDisplayedColumns = that.getAllDisplayedColumnsNames();

        that.repositoryService.getGridDcuForm(that.requestModel, currentPageIndex, allDisplayedColumns).subscribe((data) => {
          that.gridApi.hideOverlay();
          that.totalCount = data.totalCount;
          if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch()) {
          } else if (data.totalCount === 0) {
            that.gridApi.showNoRowsOverlay();
          }

          that.gridApi.paginationGoToPage(that.dataConcentratorUnitsSelectGridService.getSessionSettingsPageIndex());
          paramsRow.successCallback(data.data, data.totalCount);
          that.selectRows(that.gridApi);
          // params.failCallback();
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

  // on change page in the grid
  onPaginationChange(params) {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }

    if (params.newPage && !this.loadGrid) {
      this.dataConcentratorUnitsSelectGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.dataConcentratorUnitsSelectGridService.getSessionSettingsPageIndex());
    }
  }

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.dataConcentratorUnitsSelectGridService.onColumnVisibility(params);
  }

  // ----------------------- ag-grid set DATASOURCE end --------------------------

  // click on check-box in the grid
  selectionChanged() {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    if (this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedAll()) {
      params.node.setSelected(true);
    } else {
      if (params.node.selected) {
        this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedRows(params.node.data.concentratorId);
      } else {
        this.dataConcentratorUnitsSelectGridService.setSessionSettingsRemoveSelectedRow(params.node.data.concentratorId);
      }
    }

    this.onSelectionChanged.emit(this.getSelectedRowIds().length > 0 ? true : false);
  }

  setSearch() {
    const search = this.dataConcentratorUnitsSelectGridService.getSessionSettingsSearchedText();

    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search, useWildcards: false }]);
    }
    return [];
  }

  setFilter() {
    this.requestModel.filterModel.states = [];
    this.requestModel.filterModel.readStatus = null;
    this.requestModel.filterModel.vendors = null;
    this.requestModel.filterModel.types = null;
    this.requestModel.filterModel.tags = null;

    return this.requestModel.filterModel;
  }

  ngOnInit() {
    this.form = this.createForm();
    this.columnDefs = this.dataConcentratorUnitsSelectGridService.setGridDefaultColumns();
    this.loadData();
  }

  getSelectedRowIds() {
    return this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedRows();
  }

  getSelectedRowsCount() {
    const selectedAll = this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedAll();
    if (selectedAll) {
      return this.totalCount;
    }
    return this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedRows().length;
  }

  deselectAllRows() {
    this.gridApi.deselectAll();
    this.selectedAll = false;
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedAll(this.selectedAll);
  }

  selectAllRows() {
    this.gridApi.selectAll();
    this.selectedAll = true;
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedAll(this.selectedAll);
  }

  searchChange($event: string = '') {
    if ($event !== this.dataConcentratorUnitsSelectGridService.getSessionSettingsSearchedText()) {
      this.dataConcentratorUnitsSelectGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards: false }];

      this.dataConcentratorUnitsSelectGridService.setSessionSettingsPageIndex(0);
      this.gridApi.onFilterChanged();
    }
  }

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }
}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { Observable } from 'rxjs';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import * as _ from 'lodash';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelectionChanged = new EventEmitter<boolean>();
  @Input() height = '378px';

  form: FormGroup;
  searchTextEmpty = true;
  loadGrid = true;
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  private gridColumnApi;
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
      statuses: [{ id: 0, value: '' }],
      readStatus: {
        operation: { id: '', value: '' },
        value1: 0,
        value2: null
      },
      types: [1, 3, 4],
      tags: [{ id: 0, value: '' }],
      showOptionFilter: null
    }
  };

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
      // if (this.jobsSelectGridService.getSessionSettingsSelectedAll()) {
      //   const startRow = api.getFirstDisplayedRow();
      //   const endRow = api.getLastDisplayedRow();
      //   api.forEachNode(node2 => {
      //     if (node2.rowIndex >= startRow && node2.rowIndex <= endRow) {
      //       node2.setSelected(true);
      //     }
      //   });
      // } else
      if (node.data !== undefined && selectedRows !== undefined && selectedRows.length > 0) {
        const isSelected = _.find(selectedRows, (x) => x === node.data.id) !== undefined;
        node.setSelected(isSelected);
      }
    });
  }

  // loadData() {
  //   if (!this.deviceFiltersAndSearch) {
  //     this.deviceFiltersAndSearch = { id: [], filter: null };
  //   }
  //   if (this.selectedJobId) {
  //     this.jobsService.getJob(this.selectedJobId).subscribe(data => {
  //       this.jobsSelectGridService.setSessionSettingsSelectedRowsById(data.bulkActionsRequestParam?.id);
  //     });
  //   }
  // }

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

    const dataFromCookie = this.jobsSelectGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const cookieSort = this.jobsSelectGridService.getCookieDataSortModel();
    if (cookieSort !== undefined && cookieSort !== null) {
      this.gridApi.setSortModel(cookieSort);
    }

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        // that.requestModel.startRow = that.jobsSelectGridService.getCurrentRowIndex(
        //   that.gridApi.paginationProxy.pageSize
        // ).startRow;
        // that.requestModel.endRow = that.jobsSelectGridService.getCurrentRowIndex(
        //   that.gridApi.paginationProxy.pageSize
        // ).endRow;

        that.requestModel.startRow = 0;
        that.requestModel.endRow = 100;

        that.requestModel.sortModel = paramsRow.request.sortModel;
        // that.requestModel.filterModel = that.setFilter();
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
          // params.failCallback();

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

  // on change page in the grid
  // onPaginationChange(params) {
  //   if (this.gridApi) {
  //     this.gridApi.refreshHeader();
  //   }

  //   if (params.newPage && !this.loadGrid) {
  //     this.jobsSelectGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
  //   } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
  //     this.loadGrid = false;
  //     params.api.paginationGoToPage(this.jobsSelectGridService.getSessionSettingsPageIndex());
  //   }

  //   console.log(
  //     'dataConcentratorUnitsSelectGridService.getSessionSettingsPageIndex',
  //     this.jobsSelectGridService.getSessionSettingsPageIndex()
  //   );
  // }

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.jobsSelectGridService.onColumnVisibility(params);
  }

  // click on check-box in the grid
  selectionChanged() {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    // if (this.jobsSelectGridService.getSessionSettingsSelectedAll()) {
    //   params.node.setSelected(true);
    // } else {
    if (params.node.selected) {
      this.jobsSelectGridService.setSessionSettingsSelectedRows(params.node.data.id);
    } else {
      this.jobsSelectGridService.setSessionSettingsRemoveSelectedRow(params.node.data.id);
    }
    // }
  }

  // ----------------------- ag-grid set DATASOURCE end --------------------------

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }

  setSearch() {
    const search = this.jobsSelectGridService.getSessionSettingsSearchedText();

    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search, useWildcards: false }]);
    }
    return [];
  }
  // setFilter() {
  //   this.requestModel.filterModel.statuses = [];
  //   this.requestModel.filterModel.readStatus = null;
  //   this.requestModel.filterModel.vendors = null;
  //   // this.requestModel.filterModel.types = null;
  //   this.requestModel.filterModel.tags = null;

  //   return this.requestModel.filterModel;
  // }

  ngOnInit() {
    this.form = this.createForm();
    this.columnDefs = this.jobsSelectGridService.setGridDefaultColumns();
    // this.loadData();
  }

  getSelectedRowIds() {
    // // const selectedRows = this.gridApi.getSelectedRows();
    // const req: DataConcentratorUnitsSelectRequest[] = [];
    // // selectedRows.forEach(x => req.push({ name: x.name, concentratorId: x.concentratorId }));
    // // return req;
    // const sessionRows = this.dataConcentratorUnitsSelectGridService.getSessionSettingsSelectedRows();
    // console.log('session rows', sessionRows);
    // sessionRows.forEach(x => req.push({name: x.name, concentratorId: x.concentratorId}));
    // return req;

    return this.jobsSelectGridService.getSessionSettingsSelectedRows();
  }

  getSelectedRowsCount() {
    // const selectedAll = this.jobsSelectGridService.getSessionSettingsSelectedAll();
    // if (selectedAll) {
    //   return this.totalCount;
    // }
    return this.jobsSelectGridService.getSessionSettingsSelectedRows().length;
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
    // const selectedAll = this.jobsSelectGridService.getSessionSettingsSelectedAll();
    // if (selectedAll) {
    //   return true;
    // }
    const selectedRows = this.jobsSelectGridService.getSessionSettingsSelectedRows();
    return selectedRows.length > 0;
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

  get searchProperty() {
    return 'content';
  }

  sizeColumnsToFit() {
    if (this.gridApi) {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 10);
    }
  }
}

import { GridUtils } from './../../../global/grid.utils';
import { AlarmingService } from './../../../../core/repository/services/alarming/alarming.service';
import { IActionRequestParamsAlarms, IActionSortParams } from './../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAlarmsList } from 'src/app/core/repository/interfaces/alarming/alarms-list.interface';
import { AlarmsListGridService } from '../services/alarms-list-grid.service';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { AlarmsStaticTextService } from '../services/alarms-static-text.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { capitalize } from 'lodash';
import { filterSortOrderEnum } from 'src/app/features/global/enums/filter-operation-global.enum';

@Component({
  selector: 'app-alarms-events-alarms',
  templateUrl: './alarms.component.html',
  styles: []
})
export class AlarmsComponent implements OnInit {
  rowData: IAlarmsList[];
  columnDefs = [];

  totalCount = 0;

  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
  noData = false;

  // ag-grid
  public modules: Module[] = AllModules;
  public frameworkComponents;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  public gridColumnApi;

  public localeText;

  requestModel: IActionRequestParamsAlarms = {
    pageSize: 0,
    startTime: null,
    endTime: null,
    filter: null,
    pageNumber: 0,
    sort: null,
    textSearch: null
  };

  isGridLoaded = false;

  pageSizes: Codelist<number>[] = [
    { id: 20, value: '20' },
    { id: 50, value: '50' },
    { id: 100, value: '100' }
  ];

  selectedPageSize: Codelist<number> = this.pageSizes[0];

  form: FormGroup;
  datasource: any;

  constructor(
    private formBuilder: FormBuilder,
    private alarmsListGridService: AlarmsListGridService,
    private alarmingService: AlarmingService,
    public staticTextService: AlarmsStaticTextService,
    private authService: AuthService
  ) {
    this.form = this.createForm();

    this.frameworkComponents = alarmsListGridService.setFrameworkComponents();
    this.gridOptions = this.alarmsListGridService.setGridOptions();
  }

  ngOnInit() {
    this.columnDefs = this.alarmsListGridService.setGridDefaultColumns();

    this.localeText = {
      // for side panel
      columns: `Columns`,
      filters: `Filters`,

      // for filter panel
      page: `page`,
      more: `more`,
      to: `to`,
      of: `of`,
      next: `next`,
      last: `last`,
      first: `first`,
      previous: `previous`,
      loadingOoo: `loading...`
    };
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.startTimeProperty]: [null, Validators.required],
      [this.endTimeProperty]: [null, Validators.required],
      [this.pageSizeProperty]: this.pageSizes[0]
    });
  }

  get startTimeProperty(): string {
    return 'startTime';
  }

  get endTimeProperty(): string {
    return 'endTime';
  }

  get searchProperty(): string {
    return 'search';
  }

  onPaginationChange(params) {
    const currentApiPage = params.api.paginationGetCurrentPage();
    const currentSessionPage = this.alarmsListGridService.getSessionSettingsPageIndex();

    if (currentApiPage !== currentSessionPage) {
      if (this.isGridLoaded) {
        if (params.newPage) {
          this.alarmsListGridService.setSessionSettingsPageIndex(currentApiPage);
        }
      } else {
        // params.api.paginationGoToPage(currentSessionPage);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    if (this.gridColumnApi) {
      this.gridColumnApi.applyColumnState({ state: [{ colId: 'alarmTimestamp', sort: 'desc' }] });
    }

    this.setGridDataSource();
  }

  setGridDataSource() {
    const that = this;
    that.datasource = {
      getRows(paramsRow) {
        const startRow = that.alarmsListGridService.getCurrentRowIndex(that.selectedPageSize.id).startRow;
        const endRow = that.alarmsListGridService.getCurrentRowIndex(that.selectedPageSize.id).endRow;

        that.requestModel.pageSize = endRow - startRow;
        that.requestModel.pageNumber = that.alarmsListGridService.getSessionSettingsPageIndex() + 1;
        that.requestModel.startTime = that.form.get(that.startTimeProperty).value;
        that.requestModel.endTime = that.form.get(that.endTimeProperty).value;

        that.requestModel.sort = that.getSort(paramsRow.request.sortModel);

        if (!that.requestModel.startTime || !that.requestModel.endTime) {
          that.gridApi.hideOverlay();
          that.rowData = null;
          that.totalCount = 0;
          that.noData = true;
          that.gridApi.showNoRowsOverlay();
          paramsRow.successCallback([], 0);
          return;
        }

        that.loadData(that, paramsRow);
      }
    };
    this.gridApi.setServerSideDatasource(that.datasource);
  }

  getSort(sortModel: any[]): IActionSortParams[] {
    if (!sortModel || sortModel.length === 0) {
      return null;
    }

    const sortResult: IActionSortParams[] = [];
    sortModel.map((row) =>
      sortResult.push({
        propName: capitalize(row.colId),
        index: 0,
        sortOrder: row.sort === 'asc' ? filterSortOrderEnum.asc : filterSortOrderEnum.desc
      })
    );
    return sortResult;
  }

  loadData(instance: AlarmsComponent, paramsRow: any) {
    instance.alarmingService.getGridAlarms(instance.requestModel).subscribe((data) => {
      instance.gridApi.hideOverlay();

      if (data === undefined || data == null || data.totalCount === 0) {
        instance.totalCount = 0;
        instance.noData = true;
        instance.gridApi.showNoRowsOverlay();
      } else {
        instance.totalCount = data.totalCount;
        instance.noData = false;
      }

      paramsRow.successCallback(data ? data.data : [], instance.totalCount);

      instance.gridApi.paginationGoToPage(instance.alarmsListGridService.getSessionSettingsPageIndex());
      this.isGridLoaded = true;

      this.resizeColumns();
    });
  }

  getAllDisplayedColumnsNames(): string[] {
    if (this.gridColumnApi) {
      const columns = this.gridColumnApi.getAllDisplayedColumns();
      return columns.map((c) => c.colId);
    }
    return;
  }

  pageSizeChanged(selectedValue: any) {
    if (this.isGridLoaded) {
      this.alarmsListGridService.setSessionSettingsPageIndex(0);
      this.selectedPageSize = selectedValue;
      this.setGridPageSize();
    }
  }

  setGridPageSize() {
    const api: any = this.gridApi;
    api.gridOptionsWrapper.setProperty('cacheBlockSize', this.selectedPageSize.id);
    this.gridApi.setServerSideDatasource(this.datasource);
  }

  gridSizeChanged() {
    this.resizeColumns();
  }

  resizeColumns() {
    GridUtils.resizeColumns(this.gridColumnApi, this.gridOptions);
  }

  onFirstDataRendered(params) {
    // params.api.sizeColumnsToFit();
    // params.api.showLoadingOverlay();
  }

  get pageSizeProperty() {
    return 'pageSize';
  }

  dateRangeChanged() {
    this.gridApi?.purgeServerSideCache([]);
  }
}

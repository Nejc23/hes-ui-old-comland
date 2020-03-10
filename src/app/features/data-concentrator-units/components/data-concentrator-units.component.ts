import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

// consts
import { configGrid, configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';
import { readStatusTrashold } from '../consts/data-concentrator-units.consts';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { AllModules, Module, GridOptions, IGetRowsParams } from '@ag-grid-enterprise/all-modules';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsGridRequest } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-grid-request.interface';
import { DataConcentratorUnitsGridEventEmitterService } from '../services/data-concentrator-units-grid-event-emitter.service';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit, OnDestroy {
  cookieNameForGridSettings = 'grdColDCU';
  sessionNameForGridState = 'grdStateDCU';

  private serviceSubscription: Subscription;

  // grid instance
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  // grid variables
  columns = [];
  //dataSource: any = {};
  totalCount = 0;
  filters = '';
  selectedRows;
  gridSettings = configGrid;

  // N/A
  notAvailableText = this.staticextService.notAvailableTekst;

  // subscribe to get data from service
  subscribeTotalItems: Subscription;

  tresholds = readStatusTrashold;

  TooltipTarget: any;
  ToolTipText = '';

  // ---------------------- ag-grid ------------------
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  private gridApi;
  private gridColumnApi;
  private rowSelection;
  private isRowSelectable;
  private autoGroupColumnDef;
  public icons;
  public frameworkComponents;

  requestModel: DataConcentratorUnitsGridRequest = {
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: [],
    pivotCols: [],
    rowGroupCols: [],
    valueCols: [],
    groupKeys: [],
    pivotMode: false
  };
  rowData: any[] = [];

  cacheOverflowSize = 2;
  maxConcurrentDatasourceRequests = 2;

  constructor(
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private sidebarService: SidebarService,
    private staticextService: DataConcentratorUnitsStaticTextService,
    private i18n: I18n,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private eventService: DataConcentratorUnitsGridEventEmitterService
  ) {
    this.serviceSubscription = this.eventService.eventEmitter.subscribe({
      next: (event: string) => {
        console.log(this.gridApi.getFirstDisplayedRow());
        console.log(this.gridApi.getLastDisplayedRow());
        console.log(`Received message #${event}`);

        this.gridApi.forEachNode(function(node) {
          node.setSelected(event);
        });
      }
    });

    this.sidebarService.headerTitle = staticextService.headerTitleDCU;
    this.filters = staticextService.noFilterAppliedTekst;
    this.frameworkComponents = dataConcentratorUnitsGridService.setFrameworkComponents();
    this.gridOptions = this.dataConcentratorUnitsGridService.setGridOptions();
  }

  ngOnInit() {
    // ---- ag-grid -------
    // set grid columns
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns();
    // --------------------

    // subscribe to get count of all items on the grid
    /*  this.subscribeTotalItems = this.dataConcentratorUnitsGridService.totalItems.subscribe((total: number) => {
      this.totalCount = total;
    });*/
  }

  ngOnDestroy(): void {
    if (this.subscribeTotalItems) {
      this.subscribeTotalItems.unsubscribe();
    }
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  // set momemnt text (next planned read) out of date and time
  setMomentNextPlannedReadTime(time: string) {
    return this.staticextService.nextPlannedReadText + this.i18n(moment(time).fromNow());
  }

  // set momemnt text (last communication) out of date and time
  setMomentLastCommunicationTime(time: string) {
    return this.i18n(moment(time).fromNow());
  }

  // load data from BE (default filter is selected company id)
  loadData(search: string) {
    // this.dataSource = this.dataConcentratorUnitsGridService.loadData(search);
  }

  // ag-grid
  // button click refresh grid
  refreshGrid() {
    this.gridApi.purgeServerSideCache([]);
  }
  /*
  saveState = state => {
    this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, state);
    this.gridSettingsSessionStoreService.setGridPageIndex(this.sessionNameForGridState, state.pageIndex);
  };

  loadState = () => {
    const dataFromCookie = this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
    const sessionPageIndex = this.gridSettingsSessionStoreService.getGridPageIndex(this.sessionNameForGridState);

    if (dataFromCookie) {
      dataFromCookie.pageIndex = sessionPageIndex ? sessionPageIndex : 0;
    }
    return dataFromCookie;
  };
*/
  // ag-grid
  // checking if at least one row on the grid is selected
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

  // ag-grid
  // search string
  searchData($event: string) {
    if ($event != this.gridSettingsSessionStoreService.getGridSearchText(this.sessionNameForGridState)) {
      this.gridSettingsSessionStoreService.setGridSearchText(this.sessionNameForGridState, $event);
      this.requestModel.searchModel = [{ colId: 'all', type: 'like', value: $event }];

      this.gridApi.onFilterChanged();
    }
  }

  // TODO
  // button click upload configuration
  onUploadConfiguration() {
    let str = '';
    this.grid.selectedRowKeys.forEach(element => {
      str = str + element + ', ';
    });
    alert('selected items for upload config: ' + str);
  }

  // TODO
  // button click upgrade
  onUpgrade() {
    let str = '';
    this.grid.selectedRowKeys.forEach(element => {
      str = str + element + ', ';
    });
    alert('selected items for upgrade: ' + str);
  }

  // TODO
  // button click for set visible grid columns
  setVisibilityGridColumns() {
    this.columns = this.dataConcentratorUnitsGridService.setCustomVisibilityGridColumns();
  }

  // for tooltips demo
  onCellHoverChanged(event: any) {
    /*
  if (event.rowType === "data") {
    this.TooltipTarget = event.cellElement;
    if (event.eventType === 'mouseover') {
      console.log(event.value);
      console.log(event.cellElement);
      this.ToolTipText = event.value;
    }
  }*/
  }

  // ----------------------- ag-grid ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.gridColumnApi;
    this.gridApi.sizeColumnsToFit();
    this.icons = {
      filter: '',
      column: ''
    };

    const dataFromCookie = this.dataConcentratorUnitsGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    // const request = this.dataConcentratorUnitsService.getGridDcu2(params.dataSource.getRows());
    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = paramsRow.request.startRow;
        that.requestModel.endRow = paramsRow.request.endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.dataConcentratorUnitsService.getGridDcu2(that.requestModel).subscribe(data => {
          that.totalCount = data.totalCount;
          paramsRow.successCallback(data.data, data.totalCount);
          // params.failCallback();
        });
      }
    };

    this.gridApi.setServerSideDatasource(datasource);
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    var selectedRowsString = '';
    var maxToShow = 5;
    selectedRows.forEach(function(selectedRow, index) {
      if (index >= maxToShow) {
        return;
      }
      if (index > 0) {
        selectedRowsString += ', ';
      }
      selectedRowsString += selectedRow.id;
    });
    if (selectedRows.length > maxToShow) {
      var othersCount = selectedRows.length - maxToShow;
      selectedRowsString += ' and ' + othersCount + ' other' + (othersCount !== 1 ? 's' : '');
    }
    console.log(selectedRowsString);
  }
  /*
onQuickFilterChanged($event)
{
  */
  /*
  var filterInstance = this.gridApi.getFilterInstance('name');

// Set the model for the filter
filterInstance.setModel({
    type: 'endsWith',
    filter: 'g'
});
*/
  // Get grid to run filter operation again

  //this.requestModel.filterModel= [{colId: 'all', filter: 'neki'}]
  //this.gridApi.onFilterChanged();
  /*
  this.gridApi.setFilterModel(
    {colId:"sample", filter: 'ej ej ej'});*/
  // this.gridApi.onFilterChanged();

  //instance.selectValue("John Joe Nevin");
  //instance.applyModel();
  //this.gridApi.onFilterChanged();

  //}

  clicked() {
    this.gridApi.paginationSetPageSize(Number(50));
  }

  onPageSizeChanged() {
    console.log();
    var value = document.getElementById('page-size');
    console.log(value);
    this.gridApi.paginationSetPageSize(Number(50));
  }
  // --------------------------------------------------------------
}

// TODO only for sample - remove !!!
/*@Pipe({ name: 'stringifyData' })
export class StringifyDataPipe implements PipeTransform {
  transform(data: DataConcentratorUnitsList[]) {
    return data.map(data => data.idNumber).join(', ');
  }

}*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeterUnitsTypeGridService } from '../services/meter-units-type-grid.service';
import { MeterUnitsTypeStaticTextService } from '../services/meter-units-type-static-text.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsTypeGridEventEmitterService } from '../services/meter-units-type-grid-event-emitter.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { GridOptions, Module } from '@ag-grid-community/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { configAgGrid, enumSearchFilterOperators } from 'src/environments/config';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-meter-units-type',
  templateUrl: './meter-units-type.component.html'
})
export class MeterUnitsTypeComponent implements OnInit, OnDestroy {
  id = 0;
  private paramsSub: Subscription;
  sessionNameForGridFilter = 'grdLayoutMUT-typeId-';

  // grid variables
  columns = [];
  totalCount = 0;
  filters = '';
  private layoutChangeSubscription: Subscription;

  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
  noData = false;

  // ---------------------- ag-grid ------------------
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  private gridColumnApi;
  public icons;
  public frameworkComponents;
  public sideBar;
  loadGrid = true;
  programmaticallySelectRow = false;
  requestModel: GridRequestParams = {
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: {
      statuses: [{ id: 0, value: '' }],
      types: [0],
      tags: [{ id: 0, value: '' }],
      vendor: { id: 0, value: '' },
      readStatus: {
        operation: { id: '', value: '' },
        value1: 0,
        value2: null
      },
      firmware: [{ id: 0, value: '' }],
      breakerState: [{ id: 0, value: '' }],
      showChildInfoMBus: false,
      showDeleted: false
    }
  };

  constructor(
    private sidebarService: SidebarService,
    private i18n: I18n,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private staticTextService: MeterUnitsTypeStaticTextService,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private meterUnitsTypeService: MeterUnitsService,
    private eventService: MeterUnitsTypeGridEventEmitterService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService
  ) {
    this.sidebarService.headerTitle = 'Meter Units type';

    this.paramsSub = route.params.subscribe(params => {
      this.id = params.id;
      meterUnitsTypeGridService.meterUnitsTypeId = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT-typeId-' + params.id)
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT-typeId-' + params.id;

      /*if(this.gridApi) {
        this.gridApi.purgeServerSideCache([]);
      }*/

      if (this.gridColumnApi) {
        const dataFromCookie = this.meterUnitsTypeGridService.getCookieData(); // saved columns settings
        if (dataFromCookie) {
          this.gridColumnApi.setColumnState(dataFromCookie);
        }
      }

      if (this.gridApi) {
        const cookieSort = this.meterUnitsTypeGridService.getCookieDataSortModel();
        if (cookieSort !== undefined && cookieSort !== null) {
          this.gridApi.setSortModel(cookieSort);
        }
      }
    });

    this.sidebarService.headerTitle = staticTextService.headerTitleMeterUnitsType;
    this.filters = staticTextService.noFilterAppliedTekst;
    this.frameworkComponents = meterUnitsTypeGridService.setFrameworkComponents();
    this.gridOptions = this.meterUnitsTypeGridService.setGridOptions();
    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: MeterUnitsLayout) => {
        if (event !== null) {
          this.requestModel.filterModel.statuses = event.statusesFilter;
          this.requestModel.filterModel.vendor = event.vendorFilter;
          this.requestModel.filterModel.types = event.typesFilter;
          this.requestModel.filterModel.tags = event.tagsFilter;
          this.requestModel.filterModel.readStatus.operation = event.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = event.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = event.readStatusFilter.value2;
          this.requestModel.filterModel.firmware = event.firmwareFilter;
          this.requestModel.filterModel.breakerState = event.breakerStateFilter;
          this.requestModel.filterModel.showChildInfoMBus = event.showOnlyMeterUnitsWithMBusInfoFilter;
          this.requestModel.filterModel.showDeleted = event.showDeletedMeterUnitsFilter;
          this.gridColumnApi.setColumnState(event.gridLayout);
          this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
          this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
        }
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    });
  }

  ngOnInit() {
    // set grid columns
    this.columns = this.meterUnitsTypeGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    this.sideBar = this.meterUnitsTypeGridService.setSideBar();
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    if (this.layoutChangeSubscription) {
      this.layoutChangeSubscription.unsubscribe();
    }
  }

  // ag-grid
  // button click refresh grid
  refreshGrid() {
    this.gridApi.purgeServerSideCache([]);
  }

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
  // search string changed call get data
  searchData($event: string) {
    if ($event !== this.meterUnitsTypeGridService.getSessionSettingsSearchedText()) {
      this.meterUnitsTypeGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
      this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
      this.gridApi.onFilterChanged();
    }
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.icons = {
      filter: ''
    };
    /*
    const dataFromCookie = this.meterUnitsTypeGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const cookieSort = this.meterUnitsTypeGridService.getCookieDataSortModel();
    if (cookieSort !== undefined && cookieSort !== null) {
      this.gridApi.setSortModel(cookieSort);
    }*/

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.typeId = that.id; // type of meter units
        that.requestModel.startRow = that.meterUnitsTypeGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.meterUnitsTypeGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();
        that.meterUnitsTypeService.getGridMeterUnits(that.requestModel).subscribe(data => {
          that.gridApi.hideOverlay();
          that.totalCount = data.totalCount;
          if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch() && that.noFilters()) {
            that.noData = true;
          } else if (data.totalCount === 0) {
            that.gridApi.showNoRowsOverlay();
          }

          that.gridApi.paginationGoToPage(that.meterUnitsTypeGridService.getSessionSettingsPageIndex());
          paramsRow.successCallback(data.data, data.totalCount);
          that.selectRows(that.gridApi);
          that.eventService.setIsSelectedAll(that.meterUnitsTypeGridService.getSessionSettingsSelectedAll());
          // params.failCallback();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }
  // ----------------------- ag-grid set DATASOURCE end --------------------------

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }

  private noFilters() {
    if (
      this.requestModel.filterModel == null ||
      ((this.requestModel.filterModel.statuses === undefined ||
        this.requestModel.filterModel.statuses.length === 0 ||
        this.requestModel.filterModel.statuses[0].id === 0) &&
        (this.requestModel.filterModel.tags === undefined ||
          this.requestModel.filterModel.tags.length === 0 ||
          this.requestModel.filterModel.tags[0].id === 0) &&
        (this.requestModel.filterModel.types === undefined ||
          this.requestModel.filterModel.types.length === 0 ||
          this.requestModel.filterModel.types[0] === 0) &&
        (this.requestModel.filterModel.vendor === undefined || this.requestModel.filterModel.vendor.id === 0) &&
        (this.requestModel.filterModel.readStatus === undefined || this.requestModel.filterModel.readStatus === null) &&
        (this.requestModel.filterModel.firmware === undefined ||
          this.requestModel.filterModel.firmware.length === 0 ||
          this.requestModel.filterModel.firmware[0].id === 0) &&
        (this.requestModel.filterModel.breakerState === undefined ||
          this.requestModel.filterModel.breakerState.length === 0 ||
          this.requestModel.filterModel.breakerState[0].id === 0) &&
        !this.requestModel.filterModel.showChildInfoMBus &&
        !this.requestModel.filterModel.showDeleted)
    ) {
      return true;
    }
    return false;
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    params.api.showLoadingOverlay();
  }

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.meterUnitsTypeGridService.onColumnVisibility(params);
  }

  // click on check-box in the grid
  onSelectionChanged() {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
    // this.eventService.checkChange(true);
  }

  // on close tool panel reload filter model
  toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.meterUnitsTypeGridService.checkIfFilterModelAndCookieAreSame(
          this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
          this.requestModel.filterModel
        )
      ) {
        const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
        this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
        this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
        this.requestModel.filterModel.types = filterDCU.typesFilter;
        this.requestModel.filterModel.tags = filterDCU.tagsFilter;
        this.requestModel.filterModel.readStatus.operation = filterDCU.readStatusFilter.operation;
        this.requestModel.filterModel.readStatus.value1 = filterDCU.readStatusFilter.value1;
        this.requestModel.filterModel.readStatus.value2 = filterDCU.readStatusFilter.value2;
        this.requestModel.filterModel.firmware = filterDCU.firmwareFilter;
        this.requestModel.filterModel.breakerState = filterDCU.breakerStateFilter;
        this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
        this.requestModel.filterModel.showDeleted = filterDCU.showDeletedMeterUnitsFilter;
        this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
        this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
        this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
        this.eventService.selectDeselectAll(false);
        this.eventService.setIsSelectedAll(false);
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    }
  }

  setSearch() {
    const search = this.meterUnitsTypeGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  // set filter in request model
  setFilter() {
    if (
      !this.meterUnitsTypeGridService.checkIfFilterModelAndCookieAreSame(
        this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
        this.requestModel.filterModel
      )
    ) {
      this.setFilterInfo();
      const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
      this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
      this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
      this.requestModel.filterModel.types = filterDCU.typesFilter;
      this.requestModel.filterModel.tags = filterDCU.tagsFilter;
      this.requestModel.filterModel.readStatus = {
        operation: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.operation : { id: '', value: '' },
        value1: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value1 : 0,
        value2: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value2 : null
      };
      this.requestModel.filterModel.firmware = filterDCU.firmwareFilter;
      this.requestModel.filterModel.breakerState = filterDCU.breakerStateFilter;
      this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
      this.requestModel.filterModel.showDeleted = filterDCU.showDeletedMeterUnitsFilter;
    } else {
      this.setFilterInfo();
    }
    return this.requestModel.filterModel;
  }

  // fill text in header - about selected filters
  setFilterInfo() {
    const filter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
    this.filters = this.staticTextService.setfilterHeaderText(
      filter.name,
      filter.statusesFilter && filter.statusesFilter.length > 0,
      filter.typesFilter && filter.typesFilter.length > 0,
      filter.vendorFilter ? true : false,
      filter.tagsFilter && filter.tagsFilter.length > 0,
      filter.readStatusFilter && filter.readStatusFilter.operation ? true : false,
      filter.firmwareFilter && filter.firmwareFilter.length > 0,
      filter.breakerStateFilter && filter.breakerStateFilter.length > 0,
      filter.showOnlyMeterUnitsWithMBusInfoFilter,
      filter.showDeletedMeterUnitsFilter
    );
  }

  // on change page in the grid
  onPaginationChange(params) {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }

    if (params.newPage && !this.loadGrid) {
      this.meterUnitsTypeGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.meterUnitsTypeGridService.getSessionSettingsPageIndex());
    }
  }

  // check if "select all" was clicked
  checkSelectedAll() {
    return this.meterUnitsTypeGridService.getSessionSettingsSelectedAll();
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    this.meterUnitsTypeGridService.setSessionSettingsSelectedRows(params.node);
    if (this.meterUnitsTypeGridService.getSessionSettingsSelectedAll()) {
      // && !this.programmaticallySelectRow) {
      params.node.setSelected(true);
    }
  }

  // select rows on load grid from session
  selectRows(api: any) {
    this.programmaticallySelectRow = true;
    const selectedAll = this.meterUnitsTypeGridService.getSessionSettingsSelectedAll();
    const selectedRows = this.meterUnitsTypeGridService.getSessionSettingsSelectedRows();
    api.forEachNode(node => {
      if (selectedAll) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        api.forEachNode(node2 => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        node.data.id > 0 &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !selectedAll &&
        _.find(selectedRows, x => x.id === node.data.id) !== undefined
      ) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    });

    this.programmaticallySelectRow = false;
  }

  // form actions

  // click on the link "select all"
  selectAll() {
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(true);
    this.eventService.setIsSelectedAll(true);
  }

  // click on the link "deselect all"
  deselectAll() {
    this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
    this.eventService.selectDeselectAll(false);
    this.eventService.setIsSelectedAll(false);
  }

  // TODO
  // tsg button click
  onTag() {
    //
  }

  // delete button click
  onDelete() {
    /*  let selectedText = 'all';
    const object: GridBulkActionRequestParams = {
      id: [],
      filter: {
        statuses: [],
        types: [],
        vendor: { id: 0, value: '' },
        tags: []
      }
    };
    if (!this.meterUnitsTypeGridService.getSessionSettingsSelectedAll()) {
      const selectedRows = this.gridApi.getSelectedRows();
      selectedRows.forEach(element => {
        object.id.push(element.id);
      });
      object.filter = null;
      selectedText = selectedRows ? selectedRows.length : 0;
    } else {
      object.filter = this.requestModel.filterModel;
      object.id = null;
    }

    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.confirmDelete = true;
    component.modalBody = this.i18n(`Delete ${selectedText} selected Data Concentrator Units?`);

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        const request = this.meterUnitsTypeService.deleteDcu(object);
        this.formUtils.deleteForm(request, this.i18n('Selected items deleted')).subscribe(
          (response: any) => {
            this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
            this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
            this.eventService.selectDeselectAll(-1);
            this.gridApi.forEachNode(node => {
              node.setSelected(false);
            });

            this.gridApi.onFilterChanged();
          },
          () => {}
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );*/
  }

  // TODO
  // upload configuration button click
  onUploadConfiguration() {
    //
  }

  // TODO
  // upgrade button click
  onUpgrade() {
    //
  }
}

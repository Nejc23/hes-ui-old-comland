import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsGridEventEmitterService } from '../services/data-concentrator-units-grid-event-emitter.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';

import * as moment from 'moment';
import { Subscription } from 'rxjs';

// consts
import { configAgGrid } from 'src/environments/config';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import * as _ from 'lodash';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { AddDcuFormComponent } from './add-dcu-form/add-dcu-form.component';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit, OnDestroy {
  sessionNameForGridState = 'grdStateDCU';
  sessionNameForGridFilter = 'grdLayoutDCU';

  // grid variables
  columns = [];
  totalCount = 0;
  filters = '';
  private layoutChangeSubscription: Subscription;
  private dcuAddedSubscription: Subscription;
  private subscription: Subscription;
  public localeText;

  // N/A
  notAvailableText = this.staticextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticextService.noRecordsFound;
  overlayLoadingTemplate = this.staticextService.loadingData;
  noData = false;
  public hideFilter = false;

  // ---------------------- ag-grid ------------------
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  public gridColumnApi;
  public icons;
  public frameworkComponents;
  public sideBar;
  loadGrid = true;
  headerTitle = this.staticextService.headerTitleDCU;

  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: {
      statuses: [{ id: 0, value: '' }],
      readStatus: {
        operation: { id: '', value: '' },
        value1: 0,
        value2: null
      },
      types: [0],
      tags: [{ id: 0, value: '' }],
      vendor: { id: 0, value: '' },
      showDeleted: false
    }
  };

  constructor(
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private staticextService: DataConcentratorUnitsStaticTextService,
    private i18n: I18n,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private modalService: ModalService,
    private formUtils: FormsUtilsService,
    private authService: AuthService,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private gridColumnShowHideService: GridColumnShowHideService,
    private bredcrumbService: BreadcrumbService
  ) {
    this.filters = staticextService.noFilterAppliedTekst;
    this.frameworkComponents = dataConcentratorUnitsGridService.setFrameworkComponents();
    this.gridOptions = this.dataConcentratorUnitsGridService.setGridOptions();
    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: DcuLayout) => {
        if (event !== null) {
          this.requestModel.filterModel.statuses = event.statusesFilter;
          this.requestModel.filterModel.readStatus.operation = event.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = event.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = event.readStatusFilter.value2;
          this.requestModel.filterModel.vendor = event.vendorFilter;
          this.requestModel.filterModel.types = event.typesFilter;
          this.requestModel.filterModel.tags = event.tagsFilter;
          this.requestModel.filterModel.showDeleted = event.showDeletedFilter;
          this.gridColumnApi.setColumnState(event.gridLayout);
          this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
          this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
          this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
        }
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    });
    this.dcuAddedSubscription = this.eventService.eventEmitterDcuAdded.subscribe({
      next: (dcu: DataConcentratorUnitsList) => {
        if (dcu) {
          this.dataConcentratorUnitsService.dcuSync();
          this.refreshGrid();
        }
      }
    });

    // subscribe to changes of columns visibility from other components
    this.subscription = gridColumnShowHideService.listOfColumnsVisibilityChanged$.subscribe(listOfVisibleColumns => {
      gridColumnShowHideService.refreshGridWithColumnsVisibility(this.gridColumnApi, listOfVisibleColumns);
    });
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.DCU;
  }
  // actions - rights
  get actionDCUUpgrade() {
    return ActionEnumerator.DCUUpgrade;
  }
  get actionDCUConfiguration() {
    return ActionEnumerator.DCUConfiguration;
  }

  ngOnInit() {
    // set grid columns
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    // this.sideBar = this.dataConcentratorUnitsGridService.setSideBar(); // no toopanel anymore

    this.localeText = {
      // for side panel
      columns: this.i18n('Columns'),
      filters: this.i18n('Filters'),

      // for filter panel
      page: this.i18n('page'),
      more: this.i18n('more'),
      to: this.i18n('to'),
      of: this.i18n('of'),
      next: this.i18n('next'),
      last: this.i18n('last'),
      first: this.i18n('first'),
      previous: this.i18n('previous'),
      loadingOoo: this.i18n('loading...'),

      selectAll: this.i18n('Select All')
    };

    this.bredcrumbService.setPageName(this.headerTitle);
  }

  ngOnDestroy(): void {
    if (this.layoutChangeSubscription) {
      this.layoutChangeSubscription.unsubscribe();
    }
    if (this.dcuAddedSubscription) {
      this.dcuAddedSubscription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // set momemnt text (next planned read) out of date and time
  setMomentNextPlannedReadTime(time: string) {
    return this.staticextService.nextPlannedReadText + this.i18n(moment(time).fromNow());
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
      const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
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
    if ($event !== this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText()) {
      this.dataConcentratorUnitsGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
      this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
      this.gridApi.onFilterChanged();
    }
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    console.log('grid is ready');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.agGridSharedFunctionsService.addSelectDeselectAllText();
    // send to subscribers the visibility of columns
    this.gridColumnShowHideService.sendColumnVisibilityChanged(this.gridColumnApi);

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
    this.icons = {
      filter: ''
    };

    const dataFromCookie = this.dataConcentratorUnitsGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const cookieSort = this.dataConcentratorUnitsGridService.getCookieDataSortModel();
    if (cookieSort !== undefined && cookieSort !== null) {
      this.gridApi.setSortModel(cookieSort);
    }

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = that.dataConcentratorUnitsGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.dataConcentratorUnitsGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();
        if (that.authService.isRefreshNeeded2()) {
          that.authService
            .renewToken()
            .then(value => {
              that.authService.user = value;
              that.authService.saveTokenAndSetUserRights2(value, '');

              that.dataConcentratorUnitsService.getGridDcu(that.requestModel).subscribe(data => {
                that.gridApi.hideOverlay();
                that.totalCount = data.totalCount;
                if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch() && that.noFilters()) {
                  that.noData = true;
                } else if (data.totalCount === 0) {
                  that.gridApi.showNoRowsOverlay();
                }

                that.gridApi.paginationGoToPage(that.dataConcentratorUnitsGridService.getSessionSettingsPageIndex());
                paramsRow.successCallback(data.data, data.totalCount);
                that.selectRows(that.gridApi);
                // params.failCallback();
              });
            })
            .catch(err => {
              if (err.message === 'login_required') {
                that.authService.login().catch(errDetail => console.log(errDetail));
              }
            });
        } else {
          that.dataConcentratorUnitsService.getGridDcu(that.requestModel).subscribe(data => {
            that.gridApi.hideOverlay();
            that.totalCount = data.totalCount;
            if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch() && that.noFilters()) {
              that.noData = true;
            } else if (data.totalCount === 0) {
              that.gridApi.showNoRowsOverlay();
            }

            that.gridApi.paginationGoToPage(that.dataConcentratorUnitsGridService.getSessionSettingsPageIndex());
            paramsRow.successCallback(data.data, data.totalCount);
            that.selectRows(that.gridApi);
            // params.failCallback();
          });
        }
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
        (this.requestModel.filterModel.readStatus === undefined || this.requestModel.filterModel.readStatus === null) &&
        (this.requestModel.filterModel.tags === undefined ||
          this.requestModel.filterModel.tags.length === 0 ||
          this.requestModel.filterModel.tags[0].id === 0) &&
        (this.requestModel.filterModel.types === undefined ||
          this.requestModel.filterModel.types.length === 0 ||
          this.requestModel.filterModel.types[0] === 0) &&
        (this.requestModel.filterModel.vendor === undefined || this.requestModel.filterModel.vendor.id === 0) &&
        !this.requestModel.filterModel.showDeleted)
    ) {
      return true;
    }
    return false;
  }
  onFirstDataRendered(params) {
    // console.log(params);
    // this.autoSizeAll(params);
    // params.api.sizeColumnsToFit();
    // params.api.showLoadingOverlay();
  }

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.dataConcentratorUnitsGridService.onColumnVisibility(params);
  }

  // click on check-box in the grid
  onSelectionChanged() {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
    // this.eventService.checkChange(true);
  }

  // on close tool panel reload filter model
  // no toolpanel anymore
  /*toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.dataConcentratorUnitsGridService.checkIfFilterModelAndCookieAreSame(
          this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
          this.requestModel.filterModel
        )
      ) {
        const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
        this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
        if (filterDCU.readStatusFilter !== undefined && filterDCU.readStatusFilter != null) {
          this.requestModel.filterModel.readStatus.operation = filterDCU.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = filterDCU.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = filterDCU.readStatusFilter.value2;
        } else {
          this.requestModel.filterModel.readStatus = {
            operation: { id: '', value: '' },
            value1: 0,
            value2: 0
          };
        }
        this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
        this.requestModel.filterModel.types = filterDCU.typesFilter;
        this.requestModel.filterModel.tags = filterDCU.tagsFilter;
        this.requestModel.filterModel.showDeleted = filterDCU.showDeletedFilter;
        this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
        this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
        this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    }
  }*/

  setSearch() {
    const search = this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  // set filter in request model
  setFilter() {
    if (
      !this.dataConcentratorUnitsGridService.checkIfFilterModelAndCookieAreSame(
        this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
        this.requestModel.filterModel
      )
    ) {
      this.setFilterInfo();
      const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
      this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
      this.requestModel.filterModel.readStatus = {
        operation: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.operation : { id: '', value: '' },
        value1: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value1 : 0,
        value2: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value2 : 0
      };
      this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
      this.requestModel.filterModel.types = filterDCU.typesFilter;
      this.requestModel.filterModel.tags = filterDCU.tagsFilter;
      this.requestModel.filterModel.showDeleted = filterDCU.showDeletedFilter;
    } else {
      this.setFilterInfo();
    }
    return this.requestModel.filterModel;
  }

  // fill text in header - about selected filters
  setFilterInfo() {
    const filter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;

    this.filters = this.staticextService.setfilterHeaderText(
      filter.name,
      filter.statusesFilter && filter.statusesFilter.length > 0,
      filter.readStatusFilter && filter.readStatusFilter.operation && filter.readStatusFilter.operation.id.length > 0 ? true : false,
      filter.typesFilter && filter.typesFilter.length > 0,
      filter.vendorFilter ? true : false,
      filter.tagsFilter && filter.tagsFilter.length > 0,
      filter.showDeletedFilter
    );
  }

  isFilterSet(): boolean {
    const tmpFilter: DcuLayout = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
    return (
      (tmpFilter.name !== '' && tmpFilter.name !== undefined) ||
      (tmpFilter.statusesFilter && tmpFilter.statusesFilter.length > 0) ||
      (tmpFilter.readStatusFilter && tmpFilter.readStatusFilter.operation && tmpFilter.readStatusFilter.operation.id.length > 0) ||
      (tmpFilter.typesFilter && tmpFilter.typesFilter.length > 0) ||
      (tmpFilter.vendorFilter &&
        tmpFilter.vendorFilter.value &&
        tmpFilter.vendorFilter.value !== undefined &&
        tmpFilter.vendorFilter.value !== '') ||
      (tmpFilter.tagsFilter && tmpFilter.tagsFilter.length > 0) ||
      tmpFilter.showDeletedFilter
    );
  }

  clearFilter() {
    this.gridFilterSessionStoreService.clearGridLayout();
    this.refreshGrid();
  }

  reloadGrid() {
    this.refreshGrid();
  }

  // on change page in the grid
  onPaginationChange(params) {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }

    if (params.newPage && !this.loadGrid) {
      this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
      //  this.eventService.pageChange(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.dataConcentratorUnitsGridService.getSessionSettingsPageIndex());
    }
  }

  // check if "select all" was clicked
  checkSelectedAll() {
    return this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll();
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    if (this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
      this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows(params.node);
    } else {
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows(params.node);
    }
  }

  // select rows on load grid from session
  selectRows(api: any) {
    api.forEachNode(node => {
      const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
      if (this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        const excludedRows = this.dataConcentratorUnitsGridService.getSessionSettingsExcludedRows();
        api.forEachNode(node2 => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow && !_.find(excludedRows, x => x.id === node2.data.id)) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll() &&
        _.find(selectedRows, x => x.id === node.data.id && !node.selected) !== undefined
      ) {
        node.setSelected(true);
      }
    });
  }

  // form actions

  // click on the link "select all"
  selectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(this.gridApi.paginationGetCurrentPage());
  }

  // click on the link "deselect all"
  deselectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
    this.eventService.selectDeselectAll(-1); // -1 = deselect all
  }

  // TODO
  // tsg button click
  onTag() {
    //
  }

  // delete button click
  onDelete() {
    let selectedText = 'all';
    const object: GridBulkActionRequestParams = {
      id: [],
      filter: {
        statuses: [],
        readStatus: {
          operation: { id: '', value: '' },
          value1: 0,
          value2: 0
        },
        types: [],
        vendor: { id: 0, value: '' },
        tags: [],
        showDeleted: false
      }
    };
    if (!this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
      const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
      selectedRows.forEach(element => {
        object.id.push(element.id);
      });
      object.filter = null;
      selectedText = selectedRows ? selectedRows.length.toString() : '0';
    } else {
      object.filter = this.requestModel.filterModel;
      object.id = null;
    }

    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = this.i18n('Delete');
    component.modalBody = this.i18n(`Delete ${selectedText} selected Data Concentrator Units?`);

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        const request = this.dataConcentratorUnitsService.deleteDcu(object);
        this.formUtils.deleteForm(request, this.i18n('Selected items deleted')).subscribe(
          (response: any) => {
            this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
            this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
            this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
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
    );
  }

  getTotalCountWithoutExcluded(): string {
    const excludedRowsLength = this.dataConcentratorUnitsGridService.getSessionSettingsExcludedRows().length;

    if (excludedRowsLength === 0) {
      return this.totalCount.toString();
    } else {
      return `${this.totalCount - excludedRowsLength} ${this.i18n('of')} ${this.totalCount}`;
    }
  }

  addDcu() {
    const modalRef = this.modalService.open(AddDcuFormComponent);
    modalRef.result.then().catch(() => {});
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

  clickShowHideFilter() {
    this.hideFilter = !this.hideFilter;
    this.gridColumnApi.autoSizeAllColumns();
    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
  }
}

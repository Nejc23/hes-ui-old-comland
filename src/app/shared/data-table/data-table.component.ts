import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  CellClickEvent,
  ExcelExportEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  RowArgs,
  RowClassArgs
} from '@progress/kendo-angular-grid';
import { PagerPosition, PagerType } from '@progress/kendo-angular-grid/dist/es2015/pager/pager-settings';
import { ScrollMode } from '@progress/kendo-angular-grid/dist/es2015/scrolling/scrollmode';
import { SelectionEvent } from '@progress/kendo-angular-grid/dist/es2015/selection/types';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query/dist/npm/filtering/filter-descriptor.interface';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { ExportHelper } from 'src/app/features/helpers/export.helper';
import { DisconnectorStateEnum, jobStatus } from 'src/app/features/meter-units/types/consts/meter-units.consts';
import { brand } from '../../../environments/brand/default/brand';
import { environment } from '../../../environments/environment';
import { ModalService } from '../../core/modals/services/modal.service';
import { ActiveJobsListComponent } from '../../features/jobs/components/active-jobs-list/active-jobs-list.component';
import { FormData } from '../card-item/card-item.component';
import { dateServerFormat } from '../forms/consts/date-format';
import { Codelist } from '../repository/interfaces/codelists/codelist.interface';

export interface GridColumn {
  translationKey: string;
  field: string;
  iconsData?: IconData[];
  type?: GridColumnType;
  width?: number;
  padding?: number;
  class?: string;
  icon?: string;
  coloredValues?: ColoredValue[];
  progressBar?: ColoredValue;
  tags?: string[];
  hidden?: boolean;
  sortingDisabled?: boolean;
  linkUrl?: string;
  locked?: boolean;
  formField?: string;
  digitsInfo?: string;
}

export interface IconData {
  field: string;
  iconName: string;
  popoverText?: string;
  popoverTextErrorField?: string;
}

export enum GridColumnType {
  SWITCH = 'switch',
  RADIO = 'radio-button',
  ENUM = 'enum',
  COLORED_ENUM = 'colored-enum',
  BOLD_TEXT = 'bolded-text',
  DATE = 'date',
  DATE_TIME = 'date-time',
  DATE_ONLY = 'date-only',
  CODE_LIST = 'code-list', // dropdowns
  LINK = 'link',
  JOB_STATUS = 'job-status',
  ICONS = 'icons',
  UNIT_WITH_VALUE = 'unit-with-value',
  INSTANT_VALUES = 'instant-values',
  SLA = 'sla',
  WITH_DECIMAL = 'with-decimal'
}

export interface GridRowAction {
  actionName: string;
  iconName: string;
  link?: string;
}

export interface ColoredValue {
  enumValue: string;
  color: string;
}

export interface GridFilter {
  label?: string;
  field: string;
  values?: any[];
  isMultiselect?: boolean;
  isStringValue?: boolean;
  value?: string;
  width?: string;
}

export interface CheckboxColumn {
  columnMenu: boolean;
  resizable: boolean;
  showSelectAll: boolean;
  width: number;
}

export interface GridBulkAction {
  actionName: string;
  iconClass: string;
}

export interface PageChangedEvent {
  pageNumber: number;
  rowsPerPage?: number;
}

export interface FilterChangedEvent {
  field: string;
  value: string;
}

export interface ColumnVisibilityChangedEvent {
  field: string;
  hidden: boolean;
}

export interface LinkClickedEvent {
  field: string;
  id: string;
  clicked: boolean;
  rowData?: any;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @ViewChild(GridComponent)
  public grid: GridComponent;

  public gridView: GridDataResult;
  gridViewFilteredData: any; // search of filter applied
  @Input() gridData: any; //   this.data = [...this.data]; // for KendoUI change detection

  @Input() gridColumns: Array<GridColumn> = [];
  @Input() rowActions: Array<GridRowAction> = [];
  @Input() gridBulkActions: Array<GridBulkAction> = [];

  public type: PagerType = 'numeric';
  public buttonCount = 5;
  public info = true;
  public previousNext = true;
  public position: PagerPosition = 'bottom';

  columnType = GridColumnType;
  jobStatus = jobStatus;
  // Grid properties
  @Input() gridProperties = [];
  @Input() scrollable: ScrollMode = 'none'; // virtual scroll requires fixed height, pagination requires scrollable mode
  @Input() loading = false;
  // buttons over the data table
  @Input() withSearch = false;
  @Input() excelExport = false;
  @Input() refresh = false;
  @Input() filters: Array<GridFilter>; // dropdown filters

  @Input() tableClass;
  //find better solution for solving problem with virtual scroll + sort for client side data
  @Input() pageSize = 99999999; // pageSize for pagination is required
  @Input() skip = 0;
  @Input() pageable = false;
  @Input() stickyHeader = false;
  @Input() tableHeight = 450;
  @Input() totalCount; // total items count (totalCount from backend)
  @Input() rowHeight: number = 44; // required for virtual scroll
  @Input() fetchData = false; // fetch data from API on next page
  @Input() excelFileName = '';
  @Input() noDataText = 'COMMON.NO-RECORDS-FOUND';
  @Input() sortable = false;
  @Input() withRowSelection = false;
  @Input() kendoGridSelectByColumn: string = 'id'; // represents the unique grid data property/key for row selection
  @Input() selectedKeys = [];
  @Input() excludedIdsFromSelection;
  @Input() showGridBulkActions = false;
  @Input() showClearFiltersButton = false;
  @Input() pageNumber = 1;
  @Input() withRefreshButton = false;
  @Input() clientSideSearchAndFilters = true;
  @Input() showColumnChooser = false;
  @Input() wildCardsSearch = false;
  @Input() withFiltersIcon = false;
  @Input() withClearFilerText = false;
  @Input() filtersCount = 0;
  @Input() searchText = '';
  @Input() wildCardsEnabled = false;
  @Input() inlineEdit = false;
  @Input() withAddButton = false;
  @Input() editFieldById = ''; // id needs to be defined for inline edit
  @Input() noDataTextAlignLeft = false;
  @Input() disableSearch = false;
  @Input() csvExport = false;
  @Input() csvFileName = '';
  @Input() csvHeaderColumns: Array<string> = null;

  searchForm: FormGroup;
  wildCardsImageUrl = 'assets/images/icons/grain-icon.svg';
  // search
  searchTerm = '';
  filteredData = [];
  appliedFilters = [];
  existingFilter: any;
  defaultFilterItem = 'COMMON.ALL';
  readOnText = this.translate.instant('COMMON.READ-ON');
  preconfiguredThreshold = environment.thresholdValue;
  disconnectorStateEnum = Object.values(DisconnectorStateEnum);
  editableRowId;
  @ViewChild('searchInput', { static: false })
  searchInput: ElementRef;
  @ViewChildren('kendoDropdownFilter') kendoFilters: QueryList<DropDownListComponent>;
  @Input()
  sort: SortDescriptor[] = [
    {
      field: 'id',
      dir: 'desc'
    }
  ];
  pageSizesCodeList: Codelist<number>[] = [
    { id: 20, value: '20' },
    { id: 50, value: '50' },
    { id: 100, value: '100' }
  ];

  pageSizes: number[] = [20];

  // inline edit
  @Input() form: FormGroup;
  controls: Array<FormData> = [];
  @Input() cancelEditor = false;
  inlineAddOrEdit = false;
  inlineAdd = false;

  @Output() switchClickedEvent = new EventEmitter<any>();
  @Output() rowActionClickedEvent = new EventEmitter<any>();
  @Output() selectedCellEvent = new EventEmitter<CellClickEvent>();
  @Output() selectedRowDataEvent = new EventEmitter<any>();
  @Output() pageChangedEvent = new EventEmitter<PageChangedEvent>();
  @Output() bulkActionClickedEvent = new EventEmitter<any>();
  @Output() refreshButtonClickEvent = new EventEmitter<boolean>();
  @Output() searchInputChangedEvent = new EventEmitter<string>();
  @Output() filterChangedEvent = new EventEmitter<FilterChangedEvent>();
  @Output() clearFiltersClickedEvent = new EventEmitter<boolean>();
  @Output() linkClickedEvent = new EventEmitter<LinkClickedEvent>();
  @Output() columnVisibilityChangedEvent = new EventEmitter<ColumnVisibilityChangedEvent>();
  @Output() searchIconClickEvent = new EventEmitter<boolean>();
  @Output() wildCardsEnabledEvent = new EventEmitter<boolean>();
  @Output() filterIconClickEvent = new EventEmitter<boolean>();
  @Output() clearFilerTextClickEvent = new EventEmitter<boolean>();
  @Output() inlineSaveButtonClickEvent = new EventEmitter<any>();

  @Output() selectAllClickEvent = new EventEmitter<boolean>();
  @Output() deSelectAllClickEvent = new EventEmitter<boolean>();
  @Output() selectionChangedEvent = new EventEmitter<SelectionEvent>();
  @Output() sortChangeEvent = new EventEmitter<SortDescriptor[]>();

  checkboxColumn: CheckboxColumn = {
    columnMenu: false,
    resizable: false,
    showSelectAll: true,
    width: 50
  };

  editedRowIndex;
  @Input() selectAllEnabled = false;

  constructor(
    private modalService: ModalService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private exportHelper: ExportHelper
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ['search']: this.searchText
    });

    if (this.form) {
      this.getFormControls();
    }

    if (this.wildCardsEnabled) {
      this.wildCardsImageUrl = 'assets/images/icons/grain-icon-' + brand.brand.toLowerCase() + '.svg';
    }
    // debounce time added on input to reduce API calls
    this.searchForm
      .get('search')
      .valueChanges.pipe(debounceTime(700))
      .subscribe((data) => {
        this.onSearch(data);
      });

    if (this.withSearch && this.gridColumns.length === 0) {
      console.log('Grid columns should be defined for search!!');
    }

    // row actions - sticky column
    // in KendoUI if column is sticky width of ALL columns need to be defined
    if (this.rowActions.length > 0) {
      let width = 70;
      switch (this.rowActions.length) {
        case 2:
          width = 100;
          break;
        case 3:
          width = 120;
          break;
      }
      if (this.gridColumns.find((column) => column.field === 'rowActions') === undefined) {
        // add new column for row actions at the end of columns
        this.gridColumns.push({
          field: 'rowActions',
          width: width,
          translationKey: '',
          hidden: false
        });
      }
    }
    this.initGrid();
    this.allData = this.allData.bind(this);
  }

  mySelectionKey(context: RowArgs): string {
    return context.dataItem;
  }

  rowClass(context: RowClassArgs) {
    const isEven = context.index % 2 == 0;
    return {
      'gray-grid-background': isEven,
      'white-background': !isEven
    };
  }

  ngOnChanges(): void {
    // data changed
    this.initGrid();
    if (this.selectAllEnabled) {
      // select ALL on next page
      // exclude ids
      this.selectedKeys = this.gridData.map((item) => item[this.kendoGridSelectByColumn]);
      console.log(this.selectedKeys);
      if (this.excludedIdsFromSelection) {
        this.selectedKeys = this.selectedKeys.filter((id) => !this.excludedIdsFromSelection.includes(id));
      }
      if (this.totalCount === 0) {
        this.pageNumber = 0;
      }
      console.log(this.selectedKeys);
    }

    if (this.cancelEditor === true) {
      this.grid.closeRow(-1);
      this.inlineAdd = false;
      this.inlineAddOrEdit = false;
    }
  }

  switchValueChanged(id: string, event: boolean) {
    this.switchClickedEvent.emit({ id: id, value: event });
  }

  onRowActionClick(actionName: string, id: string, rowData?: any) {
    this.rowActionClickedEvent.emit({ actionName: actionName, id: id, rowData: rowData });
  }

  onBulkActionClick(actionName: string) {
    this.bulkActionClickedEvent.emit({ actionName: actionName, selectedKeys: this.selectedKeys });
  }

  kendoGridSelectBy = (context: RowArgs) => {
    return context.dataItem[this.kendoGridSelectByColumn];
  };

  public pageChange(event: PageChangeEvent): void {
    // rows per page changed
    if (event.take !== this.pageSize) {
      this.pageNumber = 1;
    }
    this.pageSize = event.take;
    // fetch data from API
    if (this.fetchData) {
      this.skip = event.skip;
      // load next page
      if (this.pageNumber * this.pageSize < this.totalCount) {
        if (this.scrollable === 'virtual') {
          this.pageNumber++;
        } else {
          //    this.pageSize = event.take;
          // this.pageNumber = (event.take + event.skip) / this.pageSize;
          this.skip = 0;
        }
        this.loading = true;
        this.pageChangedEvent.emit({ pageNumber: this.pageNumber, rowsPerPage: event.take });
      } else {
        // pagination changed load new page with new rowsPerPage
        this.loading = true;
        this.pageChangedEvent.emit({ pageNumber: this.pageNumber, rowsPerPage: event.take });
      }
    } else {
      // client side data
      this.skip = event.skip;
      this.loadItems(this.gridData, this.totalCount ? this.totalCount : this.gridData.length);
    }
  }

  colorExist(enumValue: string, coloredValues: ColoredValue[]) {
    if (enumValue && coloredValues.length > 0) {
      const exist = coloredValues.find((item) => item.enumValue.toLowerCase() === enumValue.toLowerCase());
      if (exist) {
        return exist.color;
      }
      return '';
    }
  }

  public allData(): ExcelExportData {
    return {
      data: process(this.gridData, {
        sort: [{ field: 'id', dir: 'asc' }] // currently we export ALL data
      }).data
    };
  }

  public onSearch(inputValue: string): void {
    this.searchTerm = inputValue;

    if (this.clientSideSearchAndFilters) {
      if (this.searchTerm !== '') {
        this.skip = 0;
        this.applySearch(this.searchTerm);
      } else {
        // remove filters
        // this.filteredData = this.gridData;
        this.applyFilter('', '');
      }
    } else {
      this.searchInputChangedEvent.emit(this.searchTerm);
    }
  }

  applySearch(searchValue: string) {
    // or operator for search in all columns for client side search
    const filter: CompositeFilterDescriptor = {
      logic: 'or',
      filters: []
    };
    // Search all only for string fields
    // columns need to be defined for Search all
    const columns = this.gridColumns.filter((column) => column.type !== (GridColumnType.SWITCH || GridColumnType.RADIO));

    columns.forEach((column) => {
      // date time formatting, search by date fix
      if (column.type === GridColumnType.DATE_TIME) {
        searchValue = searchValue.replace(/[^\w\s]/gi, '').replace(/\s/g, '');
        this.gridData.forEach((row) => {
          row['formatted-date'] =
            moment(row[column.field]).format(environment.dateDisplayFormat) +
            ' ' +
            moment(row[column.field]).format(environment.timeFormatLong);
          row['formatted-date'] = row['formatted-date'].replace(/[^\w\s]/gi, '').replace(/\s/g, '');
        });
        // formatted date for search only
        filter.filters.push({
          field: 'formatted-date',
          operator: 'contains',
          value: searchValue,
          ignoreCase: true
        });
      } else {
        // add other columns
        filter.filters.push({
          field: column.field,
          operator: 'contains',
          value: searchValue,
          ignoreCase: true
        });
      }
    });

    // Kendo UI filter data
    this.gridViewFilteredData = process(this.gridViewFilteredData ?? this.gridData, {
      filter: filter
    }).data;

    // save filtered data
    this.filteredData = this.gridViewFilteredData;
    // load grid
    this.loadItems(this.gridViewFilteredData, this.gridViewFilteredData.length);
  }

  // dropdown filters
  dropdownFilterValueChanged(value, field) {
    if (this.clientSideSearchAndFilters) {
      this.skip = 0;
      // this.gridViewFilter = this.gridData; // all data
      this.existingFilter = null;
      // check if filter already exist exist
      if (this.appliedFilters && this.appliedFilters.find((filter) => filter.field === field)) {
        // apply new value
        this.existingFilter = this.appliedFilters.find((filter) => filter.field === field);
        this.existingFilter.value = value;
      }

      if (value !== 'All') {
        this.applyFilter(field, value);
      } else {
        if (this.existingFilter && this.appliedFilters) {
          if (this.appliedFilters?.length > 0) {
            this.appliedFilters = this.appliedFilters.filter((filter) => filter.field !== field);
            this.applyFilter(field, value);
          }
        } else {
          this.appliedFilters = [];
        }
        if (this.searchTerm !== '') {
          this.applySearch(this.searchTerm);
        }
      }

      this.filteredData = this.gridViewFilteredData;
      this.loadItems(this.gridViewFilteredData, this.gridViewFilteredData.length);
    } else {
      this.filterChangedEvent.emit({ field: field, value: value });
    }
  }

  applyFilter(field: string, value: any) {
    this.gridViewFilteredData = this.gridData; // check
    if (this.searchTerm !== '') {
      this.applySearch(this.searchTerm);
    }

    if (field === '' && this.appliedFilters.length === 0) {
      this.gridViewFilteredData = this.gridData;
    }

    const filterTemp: CompositeFilterDescriptor = {
      logic: 'and',
      filters: []
    };
    if (!this.existingFilter && field !== '') {
      this.appliedFilters.push({
        field: field,
        operator: 'eq',
        value: value,
        ignoreCase: true
      });
    }

    filterTemp.filters = this.appliedFilters;
    this.gridViewFilteredData = process(this.gridViewFilteredData ?? this.gridData, {
      filter: filterTemp
    }).data;

    this.loadItems(this.gridViewFilteredData, this.gridViewFilteredData.length);
  }

  initGrid() {
    if (this.gridData) {
      this.loadItems(this.gridData, this.totalCount ? this.totalCount : this.gridData.length);
    } else {
      // no data
      this.gridView = {
        data: [],
        total: 0
      };
    }
    // todo check fetch + virtual scroll
    if (!this.fetchData) {
      this.loading = false;
    }
  }

  cellClick(event: CellClickEvent) {
    if (this.inlineEdit && !this.inlineAdd && event.column.field !== 'rowActions') {
      this.inlineAddOrEdit = true;
      this.closeEditor(-1); // close add new row
      this.editableRowId = event.dataItem[this.editFieldById]; // editable row Id by editFieldById
      event.sender.editCell(event.rowIndex, event.columnIndex, (this.form = this.fillDataForm(event.dataItem)));
    }
    this.selectedCellEvent.emit(event);
  }

  cellClose(event: any) {
    this.inlineAdd = false;
    this.inlineAddOrEdit = false;
    this.editableRowId = null;
  }

  selectedCellChange(event: any) {
    this.selectedRowDataEvent.emit(event);
  }

  selectionChanged(event: SelectionEvent) {
    if (this.selectAllEnabled) {
      this.selectionChangedEvent.emit(event);
    }
  }

  getCurrentDateTime() {
    return moment().format(environment.dateTimeFormat) + ' ' + moment().format(environment.timeFormatLong);
  }

  public sortChange(sort: SortDescriptor[]): void {
    let data = this.gridData;
    if (this.filtersApplied() && this.clientSideSearchAndFilters) {
      data = this.filteredData;
    }
    this.sort = sort;
    this.loadItems(data, this.totalCount ? this.totalCount : data.length, this.sort);
    this.sortChangeEvent.emit(sort);
  }

  // clear all filters Text
  clearAllFilters() {
    this.searchTerm = '';
    this.searchInput.nativeElement.value = '';
    // reset filters
    this.kendoFilters.forEach((filter) => filter.reset());
    if (this.clientSideSearchAndFilters) {
      this.appliedFilters = [];
      this.applyFilter('', '');
    }
    this.clearFiltersClickedEvent.emit(true);
    this.searchInputChangedEvent.emit('');
  }

  filtersApplied() {
    return this.searchTerm !== '' || this.appliedFilters.length > 0;
  }

  // grid navigation for pagination with API calls

  navigateToFirstPage() {
    this.pageNumber = 1;
    this.pageChangedEvent.emit({ pageNumber: this.pageNumber });
  }

  // grid navigation for pagination with API calls

  navigateToLastPage() {
    this.pageNumber = Math.ceil(this.totalCount / this.pageSize);
    this.pageChangedEvent.emit({ pageNumber: this.pageNumber });
  }

  navigateToNextPage() {
    if (this.pageNumber < this.totalCount / this.pageSize) {
      this.pageNumber++;
      this.pageChangedEvent.emit({ pageNumber: this.pageNumber });
    }
  }

  navigateToPreviousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.pageChangedEvent.emit({ pageNumber: this.pageNumber, rowsPerPage: this.pageSize });
    }
  }

  refreshButtonClickedEvent() {
    this.refreshButtonClickEvent.emit(true);
  }

  linkClicked(field: string, id: string, dataItem: any) {
    this.linkClickedEvent.emit({ field: field, id: id, clicked: true, rowData: dataItem });
  }

  // show/hide columns
  columnVisibilityChanged($event: any) {
    this.columnVisibilityChangedEvent.emit({
      field: $event.columns[0].field,
      hidden: $event.columns[0].hidden
    });
  }

  searchIconClicked() {
    if (this.wildCardsSearch && !this.disableSearch) {
      this.wildCardsEnabled = !this.wildCardsEnabled;
      if (this.wildCardsEnabled) {
        this.wildCardsEnabledEvent.emit(true);
        this.wildCardsImageUrl = 'assets/images/icons/grain-icon-' + brand.brand.toLowerCase() + '.svg'; // branded icon for wildcard search
      } else {
        this.wildCardsEnabledEvent.emit(false);
        this.wildCardsImageUrl = 'assets/images/icons/grain-icon.svg';
      }
    }
    this.searchIconClickEvent.emit(true);
  }

  // wildcards tooltip
  getWildCardToolTipText() {
    let tooltip = this.translate.instant('COMMON.WILDCARDS-SEARCH-DISABLED');
    if (this.wildCardsEnabled) {
      tooltip = this.translate.instant('COMMON.WILDCARDS-SEARCH-ENABLED');
    }
    return tooltip;
  }

  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
    this.inlineAddOrEdit = false;
    this.inlineAdd = false;
    this.editedRowIndex = undefined;
  }

  onFilterIconClick() {
    this.filterIconClickEvent.emit(true);
  }

  onClearFilterClick() {
    this.searchTerm = '';
    this.searchInput.nativeElement.value = '';
    this.clearFilerTextClickEvent.emit(true);
    this.searchInputChangedEvent.emit('');
  }

  // meter units grid specific columns from old grid
  openJobStatusModal(deviceId: string) {
    const options: NgbModalOptions = {
      size: 'xl'
    };
    const modalRef = this.modalService.open(ActiveJobsListComponent, options);
    modalRef.componentInstance.deviceId = deviceId;
  }

  checkThresholdDate(date: string) {
    return date && moment(date, dateServerFormat) < moment().subtract(this.preconfiguredThreshold, 'day');
  }

  getDataByType(type: string, data: any) {
    return data
      .filter((value) => value.registerType === 'RELAY_CONTROL_STATE')
      .filter((data) => data.interpretedValue?.toLowerCase() === type.toLowerCase());
  }

  getClass(type: DisconnectorStateEnum) {
    switch (type) {
      case DisconnectorStateEnum.CONNECTED:
        return 'badge-success';
      case DisconnectorStateEnum.READY:
        return 'badge-info';
      default:
        return 'badge-dark';
    }
  }

  getValuesCount(type: DisconnectorStateEnum, data: any) {
    data = data.filter((value) => value.registerType === 'RELAY_CONTROL_STATE');
    return data.filter((data) => data.interpretedValue?.toLowerCase() === type.toLowerCase()).length;
  }

  public addHandler({ sender }): void {
    this.inlineAddOrEdit = true;
    this.inlineAdd = true;
    this.closeEditor(sender);
    this.controls.forEach((value) => {
      this.form.get(value.name).patchValue('');
    });
    this.editedRowIndex = this.gridData.length;
    sender.addRow(this.form);
  }

  getFormControls() {
    if (this.form.controls) {
      this.controls = [];
      Object.keys(this.form.controls).forEach((control) => {
        const typedControl: AbstractControl = this.form.controls[control];
        this.controls.push({
          name: control,
          control: typedControl
        });
      });
    }
  }

  public fillDataForm(dataItem: any) {
    this.controls.forEach((value) => {
      this.form.get(value.name).patchValue(dataItem[value.name]);
    });
    return this.form;
  }

  inlineSaveButtonClick(event: any) {
    if (this.form.valid) {
      this.inlineAddOrEdit = false;
      this.inlineAdd = false;
      this.inlineSaveButtonClickEvent.emit(event);
    }
  }

  public editHandler(event: any) {
    this.controls.forEach((value) => {
      event.dataItem[value.name] = this.form.get(value.name).value;
    });
    if (this.form.valid) {
      this.grid.closeRow(this.editedRowIndex);
      this.inlineAddOrEdit = false;
      this.inlineSaveButtonClickEvent.emit(event);
    }
  }

  selectAll() {
    this.selectAllEnabled = true;
    this.excludedIdsFromSelection = [];
    this.selectedKeys = this.gridData.map((item) => item[this.kendoGridSelectByColumn]);
    this.selectAllClickEvent.emit(true);
  }

  deselectAll() {
    this.selectAllEnabled = false;
    this.selectedKeys = [];
    this.excludedIdsFromSelection = [];
    this.deSelectAllClickEvent.emit(true);
  }

  exportData(event: ExcelExportEvent) {
    this.excelFileName = this.excelFileName + '_' + this.getCurrentDateTime() + '.xlsx';
  }

  checkFormErrors(): boolean {
    let error = false;
    this.controls.forEach((control) => {
      if (control.control.errors) {
        error = true;
      }
    });
    return error;
  }

  switchClicked(rowData: any, value: boolean) {
    this.switchValueChanged(rowData[this.kendoGridSelectByColumn], value);
  }

  exportToCSV(fileName: string) {
    if (fileName.length == 0) {
      fileName = 'data_' + this.getCurrentDateTime() + '.xlsx';
    }

    const dataFields = Array<string>();
    if (this.csvHeaderColumns == null) {
      this.csvHeaderColumns = new Array<string>();
    }
    this.gridColumns.forEach((value: GridColumn) => {
      dataFields.push(value.field);

      if (this.csvHeaderColumns == null) {
        this.csvHeaderColumns.push(value.translationKey);
      }
    });

    this.exportHelper.exportToCSV(this.gridData, dataFields, this.csvHeaderColumns, fileName);
  }

  private closeEditor(rowIndex = this.editedRowIndex) {
    this.grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  // load grid items:
  private loadItems(data: any, count: number, sort?: any): void {
    if (data) {
      this.gridView = {
        data: orderBy(data.slice(this.skip, this.skip + this.pageSize), this.sort),
        total: count
      };
      console.log('GRID DATA: ');
      console.log(this.gridView);
    } else {
      this.initGrid();
    }
  }

  getSlaColor(value: number): string {
    if (value >= environment.slaHighLimit) {
      return 'green';
    }
    if (value >= environment.slaMedLimit) {
      return 'orange';
    }
    return 'red';
  }
}

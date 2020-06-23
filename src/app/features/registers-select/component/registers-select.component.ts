import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { Observable, of } from 'rxjs';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { RegistersSelectGridService } from '../services/registers-select-grid.service';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ActionFormStaticTextService } from '../../data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';

@Component({
  selector: 'app-registers-select',
  templateUrl: './registers-select.component.html'
})
export class RegistersSelectComponent implements OnInit, OnChanges {
  @Input() type = 'meter';
  @Input() selectedRegisters: string[];
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
    private i18n: I18n,
    private registersSelectService: RegistersSelectService,
    private registersSelectGridService: RegistersSelectGridService,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private formUtils: FormsUtilsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`changes = `, changes);
    this.selectedRegisters = changes.selectedRegisters.currentValue;
    this.columnDefs = this.registersSelectGridService.setGridReadOnlyColumns();
    if (this.selectedRegisters) {
      // this.rowData = _.filter(this.allRowData, data => this.selectedRegisters.includes(data.id));
      // console.log(`this.allRowData = `,this.rowData);
      // console.log(`this.selectedRegisters = `,this.selectedRegisters)
      // this.totalCount = this.allRowData.length;
      this.selectRows(this.gridApi);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: ['']
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.selectRows(this.gridApi);
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  selectRows(api: any) {
    console.log(`api = `, api);
    console.log(`selectedRegisters = `, this.selectedRegisters);
    if (api) {
      api.forEachNode(node => {
        const selectedRows = this.selectedRegisters;
        if (
          node.data !== undefined &&
          selectedRows !== undefined &&
          selectedRows.length > 0 &&
          _.find(selectedRows, x => x === node.data.id && !node.selected) !== undefined
        ) {
          node.setSelected(true);
        }
      });
    }
  }

  ngOnInit() {
    this.form = this.createForm();
    this.columnDefs = this.registersSelectGridService.setGridDefaultColumns();

    this.rowData$ = this.registersSelectService.getDeviceRegisters(this.deviceFiltersAndSearch);
    this.rowData$.subscribe(x => {
      this.allRowData = x;
      this.totalCount = this.allRowData.length;
      this.searchChange();
    });
  }

  getSelectedRowIds() {
    const selectedRows = this.gridApi.getSelectedRows();
    return _.map(
      selectedRows,
      nameOf<RegistersSelectList>(o => o.id)
    );
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
      data =>
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

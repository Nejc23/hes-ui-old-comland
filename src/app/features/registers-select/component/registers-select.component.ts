import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { Observable } from 'rxjs';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { RegistersSelectGridService } from '../services/registers-select-grid.service';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ActionFormStaticTextService } from '../../data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-registers-select',
  templateUrl: './registers-select.component.html'
})
export class RegistersSelectComponent implements OnInit {
  @Input() type = 'meter';
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

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: ['']
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  ngOnInit() {
    this.form = this.createForm();
    this.columnDefs = this.registersSelectGridService.setGridDefaultColumns();
    this.rowData$ = this.registersSelectService.getMeterUnitRegisters();
    this.rowData$.subscribe(x => {
      this.allRowData = x;
      this.totalCount = x.length;
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

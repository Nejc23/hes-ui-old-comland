import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { TimeOfUseConfigList } from 'src/app/core/repository/interfaces/time-of-use/time-of-use-config-list.interface';
import { TimeOfUseService } from 'src/app/core/repository/services/time-of-use/time-of-use.service';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { ActionFormStaticTextService } from '../../data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { TouConfigSelectGridService } from '../services/tou-config-select-grid.service';

@Component({
  selector: 'app-tou-config-select',
  templateUrl: './tou-config-select.component.html'
})
export class TouConfigSelectComponent implements OnInit {
  @Input() type = 'meter';
  @Output() rowSelected = new EventEmitter<number>();

  form: FormGroup;
  public modules: Module[] = AllModules;
  public gridApi;
  columnDefs = [];
  rowData$: Observable<TimeOfUseConfigList[]>;
  rowData: TimeOfUseConfigList[];
  allRowData: TimeOfUseConfigList[];
  totalCount = 0;
  selectedAll = false;

  constructor(
    private registersSelectService: TimeOfUseService,
    private registersSelectGridService: TouConfigSelectGridService,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService
  ) {}

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: ['']
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  ngOnInit() {
    this.form = this.createForm();
    this.columnDefs = this.registersSelectGridService.setGridDefaultColumns();
    this.rowData$ = this.registersSelectService.getTouConfigList();
    this.rowData$.subscribe((x) => {
      this.rowData = x;
      if (x) {
        this.totalCount = x.length;
      } else {
        this.totalCount = 0;
      }
    });
  }

  getSelectedRowId() {
    const selectedRows = this.gridApi.getSelectedRows();
    const rows = _.map(
      selectedRows,
      nameOf<TimeOfUseConfigList>((o) => o.timeOfUseId)
    );
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  }

  selectionChanged($event: any) {
    this.rowSelected.emit(this.getSelectedRowId());
  }

  deselectAllRows() {
    this.gridApi.deselectAll();
  }

  get searchProperty() {
    return 'content';
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
}

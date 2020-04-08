import { Component, OnInit, Input } from '@angular/core';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { Observable } from 'rxjs';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { RegistersSelectGridService } from '../services/registers-select-grid.service';

@Component({
  selector: 'app-registers-select',
  templateUrl: './registers-select.component.html'
})
export class RegistersSelectComponent implements OnInit {
  @Input() type = 'meter';

  public modules: Module[] = AllModules;
  public gridApi;

  columnDefs = [];

  rowData$: Observable<RegistersSelectList[]>;

  constructor(
    private i18n: I18n,
    private registersSelectService: RegistersSelectService,
    private registersSelectGridService: RegistersSelectGridService
  ) {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  ngOnInit() {
    this.columnDefs = this.registersSelectGridService.setGridDefaultColumns();
    this.rowData$ = this.registersSelectService.getMeterUnitRegisters();
  }
}

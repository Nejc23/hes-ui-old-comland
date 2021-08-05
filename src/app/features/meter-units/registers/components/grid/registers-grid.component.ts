import { SidebarToggleService } from '../../../../../shared/base-template/components/services/sidebar.service';
import { RegistersGridService } from '../../services/grid/registers-grid.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Module } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-enterprise/all-modules';
import { configAgGrid } from 'src/environments/config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'registers-grid.component.html',
  selector: 'app-registers-grid'
})
export class RegistersGridComponent implements OnInit, OnChanges {
  @Input() rowData: any[] = [];

  public columnDefs = [];
  public gridApi;
  public modules: Module[] = [ClientSideRowModelModule];

  public agGridSettings = configAgGrid;
  public gridPageSize = 10;

  allRowData: any[];

  public localeText;

  @Input() categorization: string;

  constructor(
    private registersGridService: RegistersGridService,
    private sidebarToggleService: SidebarToggleService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.localeText = {
      // for side panel
      columns: this.translate.instant('GRID.COLUMNS'),
      filters: this.translate.instant('GRID.FILTERS'),

      // for filter panel
      page: this.translate.instant('GRID.PAGE'),
      more: this.translate.instant('GRID.MORE'),
      to: this.translate.instant('GRID.TO'),
      of: this.translate.instant('GRID.OF'),
      next: this.translate.instant('GRID.NEXT'),
      last: this.translate.instant('GRID.LAST'),
      first: this.translate.instant('GRID.FIRST'),
      previous: this.translate.instant('GRID.PREVIOUS'),
      loadingOoo: this.translate.instant('GRID.LOADING-WITH-DOTS')
    };

    this.sidebarToggleService.eventEmitterToggleMenu.subscribe(() => {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 320);
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  ngOnChanges() {
    this.columnDefs = this.registersGridService.setGridColumnsForCategorization(this.categorization);
  }
}

import { SidebarToggleService } from '../../../../../shared/base-template/components/services/sidebar.service';
import { RegistersGridService } from '../../services/grid/registers-grid.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Module } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-enterprise/all-modules';
import { configAgGrid } from 'src/environments/config';

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

  constructor(private registersGridService: RegistersGridService, private sidebarToggleService: SidebarToggleService) {}

  ngOnInit() {
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

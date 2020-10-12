import { RegistersGridService } from './../../services/grid/registers-grid.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Module } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-enterprise/all-modules';
import { configAgGrid } from 'src/environments/config';

@Component({
  templateUrl: 'registers-grid.component.html',
  selector: 'app-registers-grid'
})
export class RegistersGridComponent implements OnInit {
  @Input() rowData: any[] = [];

  public columnDefs = [];
  public gridApi;
  public modules: Module[] = [ClientSideRowModelModule];

  public agGridSettings = configAgGrid;

  public localeText;

  constructor(private registersGridService: RegistersGridService) {}

  ngOnInit() {
    this.columnDefs = this.registersGridService.setGridColumns();

    this.localeText = {
      // for side panel
      columns: $localize`Columns`,
      filters: $localize`Filters`,

      // for filter panel
      page: $localize`page`,
      more: $localize`more`,
      to: $localize`to`,
      of: $localize`of`,
      next: $localize`next`,
      last: $localize`last`,
      first: $localize`first`,
      previous: $localize`previous`,
      loadingOoo: $localize`loading...`
    };
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
}

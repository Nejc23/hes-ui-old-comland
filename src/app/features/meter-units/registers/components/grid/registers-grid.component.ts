import { RegistersGridService } from './../../services/grid/registers-grid.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Module } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-enterprise/all-modules';
import { configAgGrid } from 'src/environments/config';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  templateUrl: 'registers-grid.component.html',
  selector: 'app-registers-grid'
})
export class RegistersGridComponent implements OnChanges, OnInit {
  @Input() rowData: any[] = [];

  public columnDefs = [];
  public gridApi;
  public modules: Module[] = [ClientSideRowModelModule];

  public agGridSettings = configAgGrid;

  public localeText;

  constructor(private i18n: I18n, private registersGridService: RegistersGridService) {}

  ngOnInit() {
    console.log('on init called');
    this.columnDefs = this.registersGridService.setGridColumns();

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
      loadingOoo: this.i18n('loading...')
    };
  }

  ngOnChanges() {
    console.log('registersGridComponent - rowData', this.rowData);
    console.log('registersGridComponent - gridApi', this.gridApi);
  }

  onGridReady(params) {
    console.log('grid ready');
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

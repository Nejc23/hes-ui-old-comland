import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterViewInit, NgZone } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataSourceRequestState, DataResult } from '@progress/kendo-data-query';
import { take } from 'rxjs/operators';
import { headerTitleMU } from '../consts/static-text.const';
import { Module, AllModules } from '@ag-grid-enterprise/all-modules';
import { ColumnApi, GridApi } from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'app-meter-units',
  templateUrl: './meter-units.component.html'
})
export class MeterUnitsComponent implements OnInit, AfterViewInit {
  public modules: Module[] = AllModules;
  public api: GridApi;
  public columnApi: ColumnApi;

  columnDefs = [{ headerName: 'Status', field: 'name', pinned: 'left', resizable: true, sortable: true }];
  // @ContentChild('colTemplate', { static: true })
  /*public colTemplate: TemplateRef<any>;

  public gridOptions: Partial<GridOptions>;
  private gridApi;
  private gridColumnApi;
  public columnDefs2;
  public cacheOverflowSize;
  public maxConcurrentDatasourceRequests;
  public infiniteInitialRowCount;

  searchResult = 323;
  filters = 'no filter';

  public pageSize = 10;
  public skip = 0;

  icons = {
    columnGroupClosed: '<i class="fa fa-shower"/>'
  };

  columnDefs = [
    { headerName: 'Status', field: 'status', pinned: 'left', resizable: true, sortable: true },
    { headerName: 'Name', field: 'name', pinned: 'left', resizable: true, sortable: true },
    {
      headerName: 'Read status',
      field: 'readStatus',
      resizable: true,
      sortable: true,
      cellRenderer: params => {
        if (Number(params.value) < 50) {
          return '<span><i class="fa fa-circle text-danger"> ' + params.value + '%</i></span>';
        }
        return '<span><i class="fa fa-circle text-success"> ' + params.value + '%</i></span>';
      }
    },
    { headerName: 'Meters', field: 'meters', resizable: true, sortable: true },
    { headerName: 'Read status', field: 'readStatus', resizable: true, sortable: true },
    { headerName: 'Type', field: 'type', resizable: true, sortable: true }
  ];

  //rowData:  Sample[] = [];

  // 2 grid
  @ViewChild('agGridServer', { static: true }) grid2: AgGridAngular;
  userSubscriber: Subscription;
  rowData: any[];
*/
  rowData: any[] = [];
  constructor(private sidebatService: SidebarService, private i18n: I18n, public fb: FormBuilder, private ngZone: NgZone) {
    /*
    this.sidebatService.headerTitle = this.i18n(headerTitleMU);

    this.columnDefs2 = [
      { headerName: 'Id', field: 'id', sortable: true },
      { headerName: 'First name', field: 'first_name', sortable: true },
      { headerName: 'Last name', field: 'last_name', sortable: true },
      { headerName: 'Email', field: 'email', sortable: true },
      { headerName: 'Gender', field: 'gender', sortable: true },
      { headerName: 'IP address', field: 'ip_address', sortable: true }
    ];

    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.infiniteInitialRowCount = 2;

    this.gridOptions = {
      headerHeight: 45,
      rowHeight: 30,
      cacheBlockSize: 90,
      paginationPageSize: 90,
      rowModelType: 'infinite'
    };*/
  }
  /*
  public edit = (dataItem, rowIndex): void => {
    console.log(dataItem, rowIndex);
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.gridColumnApi;

    const datasource = {
      getRows: (params: IGetRowsParams) => {
        console.log(params);
        this.usersSampleService.usersSample(params).subscribe(data => {
          console.log(data);
          params.successCallback(data['users'], data['totalRecords']);
        });
      }
    };

    this.gridOptions.api.setDatasource(datasource);
  }

  onPaginationChanged(params) {}
*/
  ngOnInit() {
    this.rowData = [{ name: '3232323' }];
  }

  public onPageChange(state: any): void {}

  public ngAfterViewInit(): void {}

  saveState() {}
  /*
onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    console.log('22121212221');
    this.sampleService.sample().subscribe((response) =>
    {
      this.rowData = response;
    });

    params.api.addGlobalListener(function(type, event) {
      if (type.indexOf("column") >= 0) {
        console.log("Got column event: ", event);
      }
    });
  }

  saveState() {
    console.log(this.gridColumnApi.getColumnState());
    console.log(this.gridColumnApi.getColumnGroupState());
    console.log(this.gridApi.getSortModel());
    console.log(this.gridApi.getFilterModel());
    console.log("column state saved");
  }
*/
}

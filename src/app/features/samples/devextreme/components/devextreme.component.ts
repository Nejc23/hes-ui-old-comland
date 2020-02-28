import { Component, OnInit, NgZone, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { UsersSample } from 'src/app/core/repository/interfaces/samples/users-sample.interface';
import { UsersSampleService } from 'src/app/core/repository/services/samples/users-sample-repository.service';
import { IGetRowsParams } from 'ag-grid-community';
import Widget from 'devextreme/ui/widget/ui.widget';
import { dxTemplate } from 'devextreme/core/templates/template';
import CustomStore from 'devextreme/data/custom_store';
import { HttpParams } from '@angular/common/http';
import { DxoGridComponent } from 'devextreme-angular/ui/nested';
import { DxDataGridComponent } from 'devextreme-angular';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';

@Component({
  selector: 'app-devextreme',
  templateUrl: './devextreme.component.html'
})
export class DevextremeComponent implements OnInit {
  cookieNameForGridSettings = 'grdColSampleDX';
  sessionNameForGridState = 'grdStateSampleDX';

  @ViewChild('template2', { static: true }) colTemplate: TemplateRef<any>;

  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  customers: UsersSample[];

  columns = [];
  dataSource: any = {};

  constructor(
    public usersSampleService: UsersSampleService,
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService
  ) {}

  ngOnInit() {
    this.columns = [
      { dataField: 'id', caption: 'ID', fixed: true, width: 100 },
      { dataField: 'first_name', caption: 'First name', fixed: true },
      { dataField: 'last_name', caption: 'Last name' },
      { dataField: 'email', caption: 'E mail' },
      { dataField: 'gender', caption: 'Gender', fixed: true, fixedPosition: 'right', width: 100 },
      { caption: 'template', cellTemplate: 'item', dataField: 'ip_address', tmp: 'template' }
    ];

    this.loadData();

    /*
 const params = {
      startRow: 0, endRow: 100,
      sortModel: {colId: 'id', sort: 'asc'}
    }
      
      this.usersSample.usersSample(params).subscribe(data=> {
        this.customers = data['users'];
      })
    */
  }

  loadData() {
    function isNotEmpty(value: any): boolean {
      return value !== undefined && value !== null && value !== '';
    }
    this.dataSource = new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        let params: HttpParams = new HttpParams();
        [
          'skip',
          'take',
          'requireTotalCount',
          'requireGroupCount',
          'sort',
          // "filter", // filter is set outside grid
          'totalSummary',
          'group',
          'groupSummary'
        ].forEach(i => {
          if (i in loadOptions && isNotEmpty(loadOptions[i])) {
            params = params.set(i, JSON.stringify(loadOptions[i]));
          }
        });
        console.log('prepare params');
        params = params.append('filter', '[{tip1: sss, oper:eql, value:0393}]'); // added custom parameters
        console.log(params);
        return this.usersSampleService
          .usersSample(params)
          .toPromise()
          .then((data: any) => {
            return {
              data: data.data,
              totalCount: data.totalCount,
              summary: data.summary,
              groupCount: data.groupCount
            };
          })
          .catch(error => {
            throw 'Data Loading Error';
          });
      }
    });
  }

  onRefresh() {
    this.grid.instance.refresh();
    //  this.loadData();
  }

  saveState = state => {
    this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, state);
    this.gridSettingsSessionStoreService.setGridPageIndex(this.sessionNameForGridState, state.pageIndex);
  };

  loadState = () => {
    const data = this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
    const sessionPageIndex = this.gridSettingsSessionStoreService.getGridPageIndex(this.sessionNameForGridState);

    if (data) {
      data.pageIndex = sessionPageIndex ? sessionPageIndex : 0;
    }
    return data;
  };
}

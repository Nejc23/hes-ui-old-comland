import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { UsersSample } from 'src/app/core/repository/interfaces/samples/users-sample.interface';
import { UsersSampleService } from 'src/app/core/repository/services/samples/users-sample-repository.service';
import CustomStore from 'devextreme/data/custom_store';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit {
  @ViewChild('template2', { static: true }) colTemplate: TemplateRef<any>;

  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  // sample data
  customers: UsersSample[];

  // grid
  columns = [];
  dataSource: any = {};
  totalCount = 0;
  filters = 'no filter';

  constructor(public usersSampleService: UsersSampleService) {}

  ngOnInit() {
    this.columns = [
      { dataField: 'id', caption: 'ID', fixed: true, width: 100 },
      { dataField: 'first_name', caption: 'First name', fixed: true },
      { dataField: 'last_name', caption: 'Last name' },
      { dataField: 'email', caption: 'E mail' },
      { dataField: 'gender', caption: 'Gender', fixed: true, fixedPosition: 'right', width: 100 }
    ];

    this.loadData();
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
            this.totalCount = data.totalCount;
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
}

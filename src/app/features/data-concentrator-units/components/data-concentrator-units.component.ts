import { Component, OnInit, TemplateRef, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { UsersSample, Data } from 'src/app/core/repository/interfaces/samples/users-sample.interface';
import { UsersSampleService } from 'src/app/core/repository/services/samples/users-sample-repository.service';
import CustomStore from 'devextreme/data/custom_store';
import { HttpParams } from '@angular/common/http';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { headerTitleDCU } from '../consts/static-text.const';

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
  allMode = '';
  checkBoxesMode = '';
  constructor(public usersSampleService: UsersSampleService, private sidebarService: SidebarService, private i18n: I18n) {
    this.sidebarService.headerTitle = this.i18n(headerTitleDCU);
  }

  ngOnInit() {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';

    this.columns = [
      { dataField: 'id', caption: 'ID', fixed: true, width: 100 },
      { dataField: 'first_name', caption: 'First name', fixed: true, width: 170 },
      { dataField: 'gender', caption: 'Sample', fixed: true, width: 50, cellTemplate: 'cellTemplateIcon' },
      { dataField: 'last_name', caption: 'Last name' },
      { dataField: 'email', caption: 'E mail' },
      { dataField: 'ip_address', caption: 'IP', cellTemplate: 'cellTemplate' },
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

  refreshGrid() {
    this.grid.instance.refresh();
  }
}

@Pipe({ name: 'stringifyEmplyees' })
export class StringifyEmployeesPipe implements PipeTransform {
  transform(employees: Data[]) {
    return employees.map(employee => employee.first_name + ' ' + employee.last_name).join(', ');
  }
}

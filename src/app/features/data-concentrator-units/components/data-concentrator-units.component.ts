import { Component, OnInit, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { HttpParams } from '@angular/common/http';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { headerTitleDCU } from '../consts/static-text.const';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  // grid
  columns = [];
  dataSource: any = {};
  totalCount = 0;
  filters = '';
  allMode = '';
  checkBoxesMode = '';
  selectedRows;
  paramsDCU = {} as GridRequestParams;

  constructor(
    public dataConcentratorUnitsService: DataConcentratorUnitsService,
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private sidebarService: SidebarService,
    private i18n: I18n
  ) {
    this.sidebarService.headerTitle = this.i18n(headerTitleDCU);
    this.filters = this.i18n('No filter applied');
  }

  ngOnInit() {
    this.setGridOptions();
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns();
    this.loadData();
  }

  /**
   * set grid functionalities
   */
  setGridOptions() {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';
  }

  loadData() {
    this.paramsDCU.sort = [];

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
            switch (i) {
              case 'skip':
                this.paramsDCU.skip = loadOptions[i];
                break;
              case 'take':
                this.paramsDCU.take = loadOptions[i];
                break;
              case 'sort':
                console.log(loadOptions[i]);
                loadOptions[i].forEach(element => {
                  console.log(element);
                  this.paramsDCU.sort.push({
                    selector: element.selector,
                    desc: element.desc
                  });
                });
            }
            console.log(loadOptions[i]);
            console.log(i);
            params = params.set(i, JSON.stringify(loadOptions[i]));
          }
        });
        console.log('prepare params');
        //params = params.append('filter', '[{tip1: sss, oper:eql, value:0393}]'); // added custom parameters

        return this.dataConcentratorUnitsService
          .getGridDCU(1, this.paramsDCU)
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
            throw new Error('Data Loading Error');
          });
      }
    });
  }

  refreshGrid() {
    this.grid.instance.refresh();
  }

  setVisibilityGridColumns() {
    this.columns = this.dataConcentratorUnitsGridService.setCustomVisibilityGridColumns();
  }
}

// only for sample remove !!
@Pipe({ name: 'stringifyData' })
export class StringifyDataPipe implements PipeTransform {
  transform(data: DataConcentratorUnitsList[]) {
    return data.map(data => data.idNumber).join(', ');
  }
}

import { Component, OnInit, ViewChild, PipeTransform, Pipe, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

// consts
import { configGrid } from 'src/environments/config';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit, OnDestroy {
  // grid instance
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  // grid variables
  columns = [];
  dataSource: any = {};
  totalCount = 0;
  filters = '';
  selectedRows;
  gridSettings = configGrid;

  // N/A
  notAvailableText = this.staticextService.notAvailableTekst;

  // subscribe to get data from service
  subscribeTotalItems: Subscription;

  // TODO get company id from meni
  companyId = 0;

  constructor(
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private sidebarService: SidebarService,
    private staticextService: DataConcentratorUnitsStaticTextService,
    private i18n: I18n
  ) {
    this.sidebarService.headerTitle = staticextService.headerTitleDCU;
    this.filters = staticextService.noFilterAppliedTekst;
  }

  ngOnInit() {
    // TODO get selected company id from meni !!!!
    this.companyId = 1;
    // --------

    // set grid columns
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns();
    this.loadData();

    // subscribe to get count of all items on the grid
    this.subscribeTotalItems = this.dataConcentratorUnitsGridService.totalItems.subscribe((total: number) => {
      this.totalCount = total;
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeTotalItems) {
      this.subscribeTotalItems.unsubscribe();
    }
  }

  // set momemnt text (next planned read) out of date and time
  setMomentNextPlannedReadTime(time: string) {
    return this.staticextService.nextPlannedReadText + this.i18n(moment(time).fromNow());
  }

  // set momemnt text (last communication) out of date and time
  setMomentLastCommunicationTime(time: string) {
    return this.i18n(moment(time).fromNow());
  }

  // load data from BE (default filter is selected company id)
  loadData() {
    this.dataSource = this.dataConcentratorUnitsGridService.loadData(this.companyId);
  }

  // button click refresh grid
  refreshGrid() {
    this.grid.instance.refresh();
  }

  // TODO
  // button click for set visible grid columns
  setVisibilityGridColumns() {
    this.columns = this.dataConcentratorUnitsGridService.setCustomVisibilityGridColumns();
  }
}

// TODO only for sample - remove !!!
@Pipe({ name: 'stringifyData' })
export class StringifyDataPipe implements PipeTransform {
  transform(data: DataConcentratorUnitsList[]) {
    return data.map(data => data.idNumber).join(', ');
  }
}

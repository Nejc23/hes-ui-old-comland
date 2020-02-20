import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterViewInit, NgZone } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable } from 'rxjs';
import { GridDataResult, DataStateChangeEvent, ColumnComponent, CellTemplateDirective, GridComponent } from '@progress/kendo-angular-grid';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataSourceRequestState, DataResult } from '@progress/kendo-data-query';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-kendo',
  templateUrl: './kendo.component.html'
})
export class KendoComponent implements OnInit, AfterViewInit {
  searchResult = 323;
  filters = 'no filter';

  public pageSize = 10;
  public skip = 0;

  @ContentChild('colTemplate', { static: true })
  public colTemplate: TemplateRef<any>;

  @ContentChild('headerTemplate', { static: true })
  public headerTemplate: TemplateRef<any>;

  public state: DataSourceRequestState = {
    skip: 0,
    take: 5
  };

  @ViewChild('tmp', { static: true }) kendoGridCellTemplate22: TemplateRef<any>;
  columns = [];

  public gridData: DataResult = {
    data: [
      {
        name: 1,
        iconColor: 'green',
        date: '2019-02-02',
        amount: 43,
        currency: 43,
        selIIT: false,
        valuePercent: '93.3 %'
      },
      {
        name: 3,
        iconColor: 'red',
        date: '2019-02-02',
        amount: 434,
        currency: 43,
        selIIT: false,
        valuePercent: '2.3 %'
      },
      {
        name: 33,
        iconColor: 'yellow',
        date: '2019-02-02',
        amount: 3,
        currency: 43,
        selIIT: true,
        valuePercent: '45.12 %'
      },
      {
        name: 133,
        iconColor: 'yellow',
        date: '2019-01-02',
        amount: 23,
        currency: 13,
        selIIT: true,
        valuePercent: '4.12 %'
      },
      {
        name: 53,
        iconColor: 'yellow',
        date: '2019-01-02',
        amount: 123,
        currency: 213,
        selIIT: false,
        valuePercent: '4.12 %'
      },
      {
        name: 542,
        iconColor: 'red',
        date: '2019-01-02',
        amount: 22,
        currency: 3444,
        selIIT: true,
        valuePercent: '14.22 %'
      }
    ],
    total: 102
  };

  @ViewChild(GridComponent, { static: true })
  public grid: GridComponent;

  constructor(private sidebatService: SidebarService, private i18n: I18n, public fb: FormBuilder, private ngZone: NgZone) {
    this.sidebatService.headerTitle = this.i18n('');
  }

  public edit = (dataItem, rowIndex): void => {
    console.log(dataItem, rowIndex);
  };

  ngOnInit() {
    console.log(this.state);
    this.columns = [
      { title: 'Name', field: 'name', type: 'text', isButton: false, locked: true },
      { title: 'Read status', isIcon: true, icon: 'fas fa-circle', width: 120, locked: true },
      { filter: true, title: 'Date', field: 'date', type: 'date', format: '{0:MM/dd/yyyy}', sortable: true, isButton: false },
      { filter: true, title: 'Amount', field: 'amount', type: 'numeric', sortable: true, isButton: false },
      { filter: true, title: 'Currency', field: 'currency', isButton: false },
      { isButton: true, buttonLabel: 'Edit', icon: 'edit', callbackFunc: this.edit }
    ];
  }

  public onPageChange(state: any): void {
    this.pageSize = state.take;
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.fitColumns();
    this.state = state;
    console.log(this.state);
  }

  public ngAfterViewInit(): void {
    this.fitColumns();
  }

  private fitColumns(): void {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this.grid.autoFitColumns();
      });
  }
}

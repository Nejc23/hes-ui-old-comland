import { Injectable } from '@angular/core';
import { DashboardStoreService } from './dashboard-store.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DashboardControlsForm } from '../interfaces/dashboard-controls-form.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DashboardGridMode } from '../enums/dashboard-grid-mode.enum';
import { CodelistRepositoryService } from 'src/app/shared/repository/services/codelist-repository.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DashboardGridService } from './dashboard-grid.service';
import { DashboardListWidget } from '../interfaces/dashboard-list-widget.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import { WidgetFactory } from '../../widgets/helpers/widget-factory.helper';
import { DashboardListWidgetsResponse } from 'src/app/shared/repository/interfaces/responses/dashboard-list-widgets-response.interface';
import { WidgetsList } from '../../widgets/consts/widgets-list.const';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  widgetsList: WidgetsList = new WidgetsList(this.i18n);

  constructor(
    private formBuilder: FormBuilder,
    private dashboardStore: DashboardStoreService,
    private codelistService: CodelistRepositoryService,
    private gridService: DashboardGridService,
    private i18n: I18n
  ) {}

  createControlsForm(): void {
    const form = this.getBlankControlsForm();
    this.dashboardStore.setControlsForm(form);
  }

  getBlankControlsForm(): FormGroup {
    return this.formBuilder.group({
      [nameOf<DashboardControlsForm>(o => o.dashboard)]: ['']
    });
  }

  goToEditMode() {
    this.gridService.setEditGridOptions();
    this.dashboardStore.setGridMode(DashboardGridMode.edit);
  }

  // save grid changes
  goToReadOnlyMode() {
    this.gridService.saveGridStateOnServer().subscribe(x => {
      this.gridService.setReadonlyGridOptions();
      this.dashboardStore.setGridMode(DashboardGridMode.readonly);
      this.gridService.setItemsDataFromServer();
    });
  }

  initDashboardOptions(): Observable<void> {
    return this.refreshDashboardOptions().pipe(map(() => this.selectFirstDashboard()));
  }
  refreshDashboardOptions(): Observable<void> {
    return this.codelistService.dashboardCodelist().pipe(map(x => this.dashboardStore.setDashboardOptions(x)));
  }
  selectFirstDashboard(): void {
    const form = this.dashboardStore.getControlsForm();
    const firstDashboard = this.dashboardStore.getFirstDashboardOption();
    let dashboardId = firstDashboard ? firstDashboard.id : null;
    if (this.dashboardStore.getSelectedDashboardId()) {
      dashboardId = this.dashboardStore.getSelectedDashboardId();
    }

    form.get(nameOf<DashboardControlsForm>(o => o.dashboard)).setValue(dashboardId);
  }

  isReadonlyMode(): boolean {
    return this.dashboardStore.getGridMode() === DashboardGridMode.readonly;
  }

  isEditMode(): boolean {
    return this.dashboardStore.getGridMode() === DashboardGridMode.edit;
  }

  getListWidgets(): DashboardListWidget[] {
    const factory = new WidgetFactory(this.i18n);
    return factory.getListWidgets();
  }

  setupListWidgets(): Observable<void> {
    const widgets = this.getListWidgets();
    // uncomment and use this if list of widgets must come from backend
    // return this.gridRepository.getListGridItems(this.dashboardStore.getDashboardValue()).pipe(
    return this.widgetsList.getAllWidgets().pipe(
      // function when list of all possible widgets is defined in app
      map(x => this.applyServerGridItemData(widgets, x)),
      map(() => this.dashboardStore.setListWidgets(widgets))
    );
  }

  applyServerGridItemData(widgets: DashboardListWidget[], data: DashboardListWidgetsResponse): DashboardListWidget[] {
    return _.reduce(
      widgets,
      (result, current: DashboardListWidget) => {
        const match = _.find(data.widgets, x => x.widgetType === current.widgetType);
        if (match) {
          const newGridItem = { ...current.gridItem, rows: match.rows, cols: match.cols };
          const updatedGridItemData = { ...current, gridItem: newGridItem };
          return [...result, updatedGridItemData];
        }
      },
      []
    );
  }
}

import { Injectable } from '@angular/core';
import { GridsterConfig, DisplayGrid, CompactType } from 'angular-gridster2';
import { DashboardGridItem } from '../interfaces/dashboard-grid-item.interface';
import * as _ from 'lodash/fp';
import { DashboardStoreService } from './dashboard-store.service';
import { DashboardGridState } from '../interfaces/dashboard-grid-state.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardGridMode } from '../enums/dashboard-grid-mode.enum';
import { WidgetService } from '../../widgets/services/widget.service';
import { WidgetType } from '../../widgets/enums/widget-type.enum';
import { GridRepositoryService } from 'src/app/core/repository/services/dashboards/grid-repository.service';
import {
  DashboardGridResponse,
  DashboardGridItemResponse
} from 'src/app/core/repository/interfaces/dashboards/dashboard-grid-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardGridService {
  constructor(
    private dashboardStore: DashboardStoreService,
    private gridRepository: GridRepositoryService,
    private widgetService: WidgetService
  ) {}

  createReadonlyOptions(): GridsterConfig {
    return {
      gridType: 'verticalFixed',
      minCols: 6,
      maxCols: 6,
      maxRows: 16,
      maxItemRows: 100,
      margin: 20,
      fixedRowHeight: 200,
      scrollToNewItems: true,
      useTransformPositioning: true,
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: true,
      maxItemArea: 2500,
      draggable: {
        enabled: false
      },
      resizable: {
        enabled: false
      },
      displayGrid: DisplayGrid.None
    };
  }

  createEditOptions(): GridsterConfig {
    return {
      gridType: 'verticalFixed',
      minCols: 6,
      maxCols: 6,
      maxRows: 16,
      maxItemRows: 100,
      margin: 10,
      fixedRowHeight: 200,
      scrollToNewItems: true,
      useTransformPositioning: true,
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: true,
      pushItems: true,
      maxItemArea: 2500,
      setGridSize: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: false
      },
      displayGrid: DisplayGrid.Always
    };
  }

  createItems(gridData: DashboardGridResponse): DashboardGridItem[] {
    const items = _.map(
      (x: DashboardGridItemResponse): DashboardGridItem => ({
        cols: x.cols,
        rows: x.rows,
        x: x.x,
        y: x.y,
        widgetType: x.widgetType,
        id: x.id,
        content: this.widgetService.getWidgetContent(x.widgetType),
        readings: null,
        properties: x.properties
      })
    );
    return items(gridData.items);
  }

  setGridStateFromServer(): Observable<void> {
    const dashboardId = this.dashboardStore.getDashboardValue();
    if (!dashboardId) {
      return of(null);
    }

    return this.gridRepository.getGrid(dashboardId).pipe(
      map(x => this.createGridState(x)),
      map(x => this.dashboardStore.setGridState(x))
    );
  }

  createGridState(x: DashboardGridResponse): DashboardGridState {
    return {
      dashboard: this.createItems(x),
      options: this.createReadonlyOptions(),
      refreshIntervalActive: x.refreshIntervalActive
    };
  }

  saveGridStateOnServer(): Observable<void> {
    const dashboardId = this.dashboardStore.getDashboardValue();

    if (!dashboardId) {
      return of(null);
    }

    return this.gridRepository.saveGrid(dashboardId, this.getItems(this.dashboardStore.getGridDashboard())).pipe(
      map(x => this.createGridState(x)),
      map(x => this.dashboardStore.setGridState(x))
    );
  }

  /* inserting items data into store variable and refresh dashboard items with new data */
  setItemsDataFromServer(): Observable<void> {
    const dashboardId = this.dashboardStore.getDashboardValue();
    if (!dashboardId) {
      return of(null);
    }

    this.gridRepository.getGridItemsData(dashboardId).subscribe(x => {
      const items: DashboardGridItem[] = this.dashboardStore.getGridDashboard();
      x.forEach(element => {
        const item = items.find(d => d.id === element.id);
        if (item) {
          item.readings = element;
        }
      });

      this.dashboardStore.refreshItemsWithData();
    });

    return of(null);
  }

  getItems(gridData: DashboardGridItem[]): DashboardGridResponse {
    const dashboard: DashboardGridResponse = {
      items: null,
      refreshIntervalActive: this.dashboardStore.isRefreshIntervalActive()
    };
    const items = _.map(
      (x: DashboardGridItem): DashboardGridItemResponse => ({
        cols: x.cols,
        rows: x.rows,
        x: x.x,
        y: x.y,
        widgetType: x.widgetType,
        id: x.id,
        properties: x.properties
      })
    );

    dashboard.items = items(gridData);
    return dashboard;
  }

  setReadonlyGridOptions() {
    this.dashboardStore.setGridOptions(this.createReadonlyOptions());
  }

  setEditGridOptions() {
    this.dashboardStore.setGridOptions(this.createEditOptions());
  }

  removeItemFromGrid(id: string) {
    const items = this.dashboardStore.getGridDashboard();
    const filteredItems = _.filter(x => x.id !== id, items);
    this.dashboardStore.setGridDashboard(filteredItems);
  }

  openWidgetSettings(id: string, widgetType: WidgetType) {
    this.widgetService.openSettingsModal(id, widgetType);
  }

  getGridWidgetComponent(widgetType: WidgetType) {
    return this.widgetService.getGridWidgetComponent(widgetType);
  }

  onRefreshGrid(): Observable<void> {
    if (this.dashboardStore.getGridMode() === DashboardGridMode.edit && this.dashboardStore.isRefreshIntervalActive()) {
      return of(null);
    }
    return this.setItemsDataFromServer();
  }
}

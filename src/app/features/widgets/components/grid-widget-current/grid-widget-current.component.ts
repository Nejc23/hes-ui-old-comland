import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GridItemContent } from 'src/app/features/dashboard/interfaces/grid-item-content.interface';
import { GridWidgetAccess } from '../../interfaces/grid-widget-access.interface';
import { DashboardStoreService } from 'src/app/features/dashboard/services/dashboard-store.service';
import { Subscription } from 'rxjs';
import { WidgetStatus } from '../../enums/widget-status.enum';
import { WidgetsList } from '../../consts/widgets-list.const';
import { WidgetType } from '../../enums/widget-type.enum';
import { DashboardGridItem } from 'src/app/features/dashboard/interfaces/dashboard-grid-item.interface';
import { WidgetSettingsService } from '../../services/widget-settings';
import { DefaultWidgetSettingComponent } from 'src/app/shared/modals/components/widget-settings/default-widget-setting.component';
import { DefaultSettingsFormComponent } from 'src/app/shared/modals/components/widget-settings/default-form/default-settings-form.component';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-grid-widget-current',
  templateUrl: './grid-widget-current.component.html'
})
export class GridWidgetCurrentComponent implements OnInit, OnDestroy, GridWidgetAccess {
  @Input() content: GridItemContent;
  @Input() readings: DashboardItemDataResponse;
  @Input() id: string;
  graphData = [];
  dipslayGraph = false;

  widgetDefault = new WidgetsList(this.i18n).widgetsData.widgets.find(x => x.widgetType === WidgetType.current);

  subscription: Subscription;
  item: DashboardGridItem;

  constructor(private dashboardStore: DashboardStoreService, private widgetSettingsService: WidgetSettingsService, private i18n: I18n) {
    this.subscription = this.dashboardStore.customObservable.subscribe(() => {
      this.item = this.dashboardStore.getGridDashboard().find(x => x.id === this.id);
      this.readings = this.item.readings;
      this.graphData = this.readings.graphValues;
      if (this.graphData !== undefined && this.graphData != null && this.graphData.length > 0) {
        this.graphData = [...this.graphData];
      }
    });
  }

  ngOnInit() {}

  checkDisplayGraph(): boolean {
    if (
      this.dashboardStore.getGridDashboard().find(x => x.id === this.id).properties &&
      this.dashboardStore.getGridDashboard().find(x => x.id === this.id).properties.displayGraph
    ) {
      return this.dashboardStore.getGridDashboard().find(x => x.id === this.id).properties.displayGraph;
    }

    return false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get widgetTitle() {
    return this.widgetDefault.title;
  }

  get iconClass() {
    return this.content.iconClass;
  }

  get currentValueWithUnit() {
    return `${this.readings.value} ${this.readings.unit}`;
  }

  get showExlamation() {
    if (this.item === undefined || this.item.properties === undefined) {
      return false;
    }

    if (this.item.properties === null || this.item.properties.device === null) {
      return true;
    }
    return false;
  }

  get name() {
    if (!this.showExlamation) {
      return this.readings.deviceName;
    }

    return this.readings.powerlineName;
  }

  get deviceName() {
    return this.readings.deviceName;
  }

  get lastUpdateTimestamp() {
    return this.readings.lastUpdateTimestamp;
  }

  get widgetStatus() {
    return WidgetStatus.green;
  }

  clickSettings() {
    this.widgetSettingsService.openWidgetSettings(this.id, DefaultWidgetSettingComponent, DefaultSettingsFormComponent);
  }
}

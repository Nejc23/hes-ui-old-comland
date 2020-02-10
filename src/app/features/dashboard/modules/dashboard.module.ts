import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from '../components/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardControlsComponent } from '../components/dashboard-controls.component';
import { GridComponent } from '../components/grid/grid.component';
import { GridsterModule } from 'angular-gridster2';
import { DashboardSettingsComponent } from '../components/dashboard-settings.component';
import { DashboardWidgetListComponent } from '../components/dashboard-widget-list.component';
import { GridItemControlsComponent } from '../components/grid/grid-item-controls.component';
import { GridItemContentComponent } from '../components/grid/grid-item-content.component';
import { GridWidgetCurrentComponent } from '../../widgets/components/grid-widget-current/grid-widget-current.component';
import { WidgetGridItemDirective } from '../../widgets/directives/widget-grid-item.directive';

@NgModule({
  entryComponents: [DashboardSettingsComponent, GridWidgetCurrentComponent],
  declarations: [
    DashboardComponent,
    GridComponent,
    DashboardControlsComponent,
    DashboardSettingsComponent,
    DashboardWidgetListComponent,
    GridItemControlsComponent,
    GridItemContentComponent,
    WidgetGridItemDirective,
    GridWidgetCurrentComponent
  ],
  imports: [SharedModule, DashboardRoutingModule, GridsterModule]
})
export class DashboardModule {}

import { SchedulerDcTimeSyncJobComponent } from './../features/jobs/components/dc-time-sync/scheduler-dc-time-sync-job.component';
import { PlcMeterFwUpgradeComponent } from './../features/meter-units/common/components/plc-meter-fw-upgrade/plc-meter-fw-upgrade.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BaseTemplateComponent } from './base-template/components/base-template.component';
import { SidebarComponent } from './base-template/components/sidebar.component';
import { SidebarMeterComponent } from './base-template/components/sidebar-meter.component';
import { SidebarDropdownDirective } from './base-template/directives/sidebar-dropdown.directive';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActionPreventerComponent } from './action-preventer/components/action-preventer.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleDatePipe } from './utils/pipes/locale-date.pipe';
import { CustomFormsModule } from './forms/custom-forms.module';
import { HeaderTitleComponent } from './base-template/components/header-title.component';
import { BreadcrumbsModule } from './breadcrumbs/breadcrumbs.module';
import { ToastComponent } from './toast-notification/components/toast.component';
import { CardComponent } from './card/components/card.component';
import { ModalTemplateComponent } from './modals/components/modal-template.component';
import { GridsterModule } from 'angular-gridster2';
import { WidgetSettingsFormDirective } from './modals/directives/widget-settings-form.directive';
import { DisableIfAuthorizedReadonlyDirective } from './directives/permissions/disable-if-authorized-readonly.directive';
import { DisableIfUnauthorizedDirective } from './directives/permissions/disable-if-unauthorized.directive';
import { HideIfAuthorizedReadonlyDirective } from './directives/permissions/hide-if-authorized-readonly.directive';
import { HideIfUnauthorizedDirective } from './directives/permissions/hide-if-unauthorized.directive';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { ModalConfirmComponent } from './modals/components/modal-confirm.component';
import { PipesModule } from './pipes/pipes.module';
import { SideFixedNavComponent } from './base-template/components/side-fixed-nav.component';
import { Page404Component } from './404/page-404.component';
import { SaveViewFormComponent } from '../features/data-concentrator-units/components/save-view-form/save-view-form.component';
import { AddDcuFormComponent } from '../features/data-concentrator-units/components/add-dcu-form/add-dcu-form.component';
import { RegistersSelectComponent } from '../features/registers-select/component/registers-select.component';
import { SaveViewFormMUTComponent } from '../features/meter-units/types/components/save-view-form/save-view-form-meter-units-type.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { AutoRefreshComponent } from './forms/components/auto-refresh/auto-refresh.component';
import { TouConfigSelectComponent } from '../features/tou-config-select/component/tou-config-select.component';
import { IdentityErrorComponent } from './IdentityError/identity-error.component';
import { DisableIfActionUnauthorizedDirective } from './directives/permissions/disable-if-action-unauthorized.directive';
import { HideIfActionUnauthorizedDirective } from './directives/permissions/hide-if-action-unauthorized.directive';
import { ActiveJobComponent } from './popover/components/active-job/active-job.component';
import { GridCellActiveJobStatusComponent } from './popover/components/grid-custom-components/grid-cell-active-job-status.component';
import { GridCellLinkComponent } from './popover/components/grid-custom-components/grid-cell-link.component';
import { SchedulerJobComponent } from '../features/jobs/components/scheduler-job/scheduler-job.component';
import { SchedulerDiscoveryJobComponent } from '../features/jobs/components/scheduler-discovery-job/scheduler-discovery-job.component';
import { DataConcentratorUnitsSelectComponent } from '../features/data-concentrator-units-select/component/data-concentrator-units-select.component';
import { GridSelectionHeaderComponent } from './ag-grid/components/grid-selection-header.component';
import { GridCellNameComponent } from './ag-grid/components/grid-cell-name.component';
import { GridCellIdNumberComponent } from './ag-grid/components/grid-cell-id-number.component';
import { GridCellIpComponent } from './ag-grid/components/grid-cell-ip.component';
import { AgGridSharedFunctionsService } from './ag-grid/services/ag-grid-shared-functions.service';
import { TopFixedNavComponent } from './base-template/components/top-fixed-nav.component';
import { SchedulerActiveJobsComponent } from './popover/components/scheduler-active-jobs/scheduler-active-jobs.component';
import { PlcMeterTouConfigComponent } from '../features/meter-units/common/components/plc-meter-tou-config/plc-meter-tou-config.component';
import { PlcMeterTouConfigImportComponent } from '../features/meter-units/common/components/plc-meter-tou-config-import/plc-meter-tou-config-import.component';
import { PlcMeterTemplatesImportComponent } from '../features/meter-units/common/components/plc-meter-templates-import/plc-meter-templates-import.component';
import { PlcMeterMonitorComponent } from '../features/meter-units/common/components/plc-meter-monitor/plc-meter-monitor.component';
import { PlcMeterLimiterComponent } from '../features/meter-units/common/components/plc-meter-limiter/plc-meter-limiter.component';
import { PlcMeterBreakerModeComponent } from '../features/meter-units/common/components/plc-meter-breaker-state/plc-meter-breaker-mode.component';

@NgModule({
  exports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    ActionPreventerComponent,
    LoadingBarHttpClientModule,
    TranslateModule,
    LocaleDatePipe,
    CustomFormsModule,
    HeaderTitleComponent,
    ToastComponent,
    CardComponent,
    ModalTemplateComponent,
    ModalConfirmComponent,
    NgbModule,
    BsDropdownModule,
    SaveViewFormComponent,
    SaveViewFormMUTComponent,
    AddDcuFormComponent,
    SchedulerJobComponent,
    SchedulerDiscoveryJobComponent,
    SchedulerDcTimeSyncJobComponent,
    PlcMeterTouConfigComponent,
    PlcMeterFwUpgradeComponent,
    PlcMeterMonitorComponent,
    PlcMeterLimiterComponent,
    RegistersSelectComponent,
    DataConcentratorUnitsSelectComponent,
    TouConfigSelectComponent,
    DisableIfAuthorizedReadonlyDirective,
    DisableIfUnauthorizedDirective,
    HideIfAuthorizedReadonlyDirective,
    HideIfUnauthorizedDirective,
    DisableIfActionUnauthorizedDirective,
    HideIfActionUnauthorizedDirective,
    NumberOnlyDirective,
    PipesModule,
    BreadcrumbsModule,
    AutoRefreshComponent,
    ActiveJobComponent,
    SchedulerActiveJobsComponent,
    PlcMeterTouConfigImportComponent,
    PlcMeterTemplatesImportComponent,
    PlcMeterBreakerModeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BsDropdownModule,
    RouterModule,
    TranslateModule,
    CustomFormsModule,
    BreadcrumbsModule,
    GridsterModule,
    AgGridModule.withComponents([
      GridCellActiveJobStatusComponent,
      GridCellLinkComponent,
      GridSelectionHeaderComponent,
      GridCellNameComponent,
      GridCellIdNumberComponent,
      GridCellIpComponent
    ])
  ],
  declarations: [
    BaseTemplateComponent,
    SidebarComponent,
    SidebarMeterComponent,
    SidebarDropdownDirective,
    ActionPreventerComponent,
    LocaleDatePipe,
    HeaderTitleComponent,
    SaveViewFormComponent,
    SaveViewFormMUTComponent,
    AddDcuFormComponent,
    SchedulerJobComponent,
    SchedulerDiscoveryJobComponent,
    SchedulerDcTimeSyncJobComponent,
    PlcMeterTouConfigComponent,
    PlcMeterFwUpgradeComponent,
    PlcMeterMonitorComponent,
    PlcMeterLimiterComponent,
    RegistersSelectComponent,
    DataConcentratorUnitsSelectComponent,
    TouConfigSelectComponent,
    ToastComponent,
    CardComponent,
    ModalTemplateComponent,
    ModalConfirmComponent,
    WidgetSettingsFormDirective,
    DisableIfAuthorizedReadonlyDirective,
    DisableIfUnauthorizedDirective,
    HideIfAuthorizedReadonlyDirective,
    HideIfUnauthorizedDirective,
    DisableIfActionUnauthorizedDirective,
    HideIfActionUnauthorizedDirective,
    NumberOnlyDirective,
    SideFixedNavComponent,
    TopFixedNavComponent,
    Page404Component,
    AutoRefreshComponent,
    IdentityErrorComponent,
    GridCellActiveJobStatusComponent,
    GridCellLinkComponent,
    ActiveJobComponent,
    SchedulerActiveJobsComponent,
    PlcMeterTouConfigImportComponent,
    PlcMeterTemplatesImportComponent,
    GridSelectionHeaderComponent,
    GridCellNameComponent,
    GridCellIdNumberComponent,
    GridCellIpComponent,
    PlcMeterBreakerModeComponent
  ],
  entryComponents: [
    ModalConfirmComponent,
    SaveViewFormComponent,
    SaveViewFormMUTComponent,
    AddDcuFormComponent,
    SchedulerJobComponent,
    SchedulerDiscoveryJobComponent,
    SchedulerDcTimeSyncJobComponent,
    PlcMeterTouConfigComponent,
    PlcMeterFwUpgradeComponent,
    PlcMeterMonitorComponent,
    PlcMeterLimiterComponent,
    RegistersSelectComponent,
    DataConcentratorUnitsSelectComponent,
    TouConfigSelectComponent,
    PlcMeterTouConfigImportComponent,
    PlcMeterTemplatesImportComponent,
    PlcMeterBreakerModeComponent
  ],
  providers: [AgGridSharedFunctionsService]
})
export class SharedModule {}

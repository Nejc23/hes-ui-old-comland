import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CdTimerModule } from 'angular-cd-timer';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { environment } from '../../environments/environment';
import { DataConcentratorUnitsSelectComponent } from '../features/data-concentrator-units-select/component/data-concentrator-units-select.component';
import { DcuFwUpgradeComponent } from '../features/data-concentrator-units/common/components/dcu-fw-upgrade.component';
import { AddDcuFormComponent } from '../features/data-concentrator-units/components/add-dcu-form/add-dcu-form.component';
import { EditDcuFormComponent } from '../features/data-concentrator-units/components/edit-dcu-form/edit-dcu-form.component';
import { SaveViewFormComponent } from '../features/data-concentrator-units/components/save-view-form/save-view-form.component';
import { ActiveJobsListComponent } from '../features/jobs/components/active-jobs-list/active-jobs-list.component';
import { AlarmNotificationRulesComponent } from '../features/jobs/components/scheduler-job/alarm-notification-rules.component';
import { SchedulerJobComponent } from '../features/jobs/components/scheduler-job/scheduler-job.component';
import { StatusJobComponent } from '../features/jobs/components/status-job/status-job.component';
import { GridCellActiveReadOnlyComponent } from '../features/jobs/jobs-select/components/grid-custom-components/grid-cell-active-read-only.component';
import { PlcMeterBreakerModeComponent } from '../features/meter-units/common/components/plc-meter-breaker-state/plc-meter-breaker-mode.component';
import { PlcMeterJobsRegistersComponent } from '../features/meter-units/common/components/plc-meter-jobs-registers/plc-meter-jobs-registers.component';
import { PlcMeterLimiterComponent } from '../features/meter-units/common/components/plc-meter-limiter/plc-meter-limiter.component';
import { PlcMeterMonitorComponent } from '../features/meter-units/common/components/plc-meter-monitor/plc-meter-monitor.component';
import { PlcMeterRelaysConnectComponent } from '../features/meter-units/common/components/plc-meter-relays/plc-meter-relays-connect.component';
import { PlcMeterRelaysSetModeComponent } from '../features/meter-units/common/components/plc-meter-relays/plc-meter-relays-set-mode.component';
import { PlcMeterSetDisplaySettingsComponent } from '../features/meter-units/common/components/plc-meter-set-display-settings/plc-meter-set-display-settings.component';
import { PlcMeterTemplatesImportComponent } from '../features/meter-units/common/components/plc-meter-templates-import/plc-meter-templates-import.component';
import { PlcMeterTouConfigImportComponent } from '../features/meter-units/common/components/plc-meter-tou-config-import/plc-meter-tou-config-import.component';
import { PlcMeterTouConfigComponent } from '../features/meter-units/common/components/plc-meter-tou-config/plc-meter-tou-config.component';
import { PlcReadRegistersComponent } from '../features/meter-units/common/components/plc-read-meter/plc-read-registers.component';
import { PopoverInstantValuesComponent } from '../features/meter-units/popover/popover-instant-values.component';
import { RegistersSelectComponent } from '../features/registers-select/component/registers-select.component';
import { TouConfigSelectComponent } from '../features/tou-config-select/component/tou-config-select.component';
import { AddJobComponent } from './../features/jobs/components/scheduler-job/add-job.component';
import { CronScheduleComponent } from './../features/jobs/cron-schedule/components/cron-schedule.component';
import { JobsSelectComponent } from './../features/jobs/jobs-select/components/jobs-select.component';
import { PlcMeterFwUpgradeComponent } from './../features/meter-units/common/components/plc-meter-fw-upgrade/plc-meter-fw-upgrade.component';
import { PlcMeterJobsAssignExistingComponent } from './../features/meter-units/common/components/plc-meter-jobs-assign-existing/plc-meter-jobs-assign-existing.component';
import { PlcMeterRelaysDisconnectComponent } from './../features/meter-units/common/components/plc-meter-relays/plc-meter-relays-disconnect.component';
import { PlcMeterRelaysStateComponent } from './../features/meter-units/common/components/plc-meter-relays/plc-meter-relays-state.component';
import { SecurityActivateHlsComponent } from './../features/meter-units/common/components/security/security-activate-hls.component';
import { SecurityChangePasswordComponent } from './../features/meter-units/common/components/security/security-change-password.component';
import { SecurityRekeyComponent } from './../features/meter-units/common/components/security/security-rekey.component';
import { Page404Component } from './404/page-404.component';
import { ActionPreventerComponent } from './action-preventer/components/action-preventer.component';
import { GridCellIdNumberComponent } from './ag-grid/components/grid-cell-id-number.component';
import { GridCellIpComponent } from './ag-grid/components/grid-cell-ip.component';
import { GridCellNameComponent } from './ag-grid/components/grid-cell-name.component';
import { GridSelectionHeaderScrollableComponent } from './ag-grid/components/grid-selection-header-scrollable.component';
import { GridSelectionHeaderComponent } from './ag-grid/components/grid-selection-header.component';
import { AgGridSharedFunctionsService } from './ag-grid/services/ag-grid-shared-functions.service';
import { BaseTemplateComponent } from './base-template/components/base-template.component';
import { HeaderTitleComponent } from './base-template/components/header-title.component';
import { SidebarMeterComponent } from './base-template/components/sidebar-meter.component';
import { SidebarComponent } from './base-template/components/sidebar.component';
import { TopFixedNavComponent } from './base-template/components/top-fixed-nav.component';
import { SidebarDropdownDirective } from './base-template/directives/sidebar-dropdown.directive';
import { BreadcrumbsModule } from './breadcrumbs/breadcrumbs.module';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { DisableIfActionUnauthorizedDirective } from './directives/permissions/disable-if-action-unauthorized.directive';
import { DisableIfAuthorizedReadonlyDirective } from './directives/permissions/disable-if-authorized-readonly.directive';
import { DisableIfUnauthorizedDirective } from './directives/permissions/disable-if-unauthorized.directive';
import { HideDividerIfPermissionsUnauthorizedDirective } from './directives/permissions/hide-divider-if-permissions-unauthorized.directive';
import { HideIfActionUnauthorizedDirective } from './directives/permissions/hide-if-action-unauthorized.directive';
import { HideIfAllPermissionsUnauthorizedDirective } from './directives/permissions/hide-if-all-permissions-unauthorized.directive';
import { HideIfAnyPermissionsUnauthorizedDirective } from './directives/permissions/hide-if-any-permissions-unauthorized.directive';
import { HideIfAuthorizedReadonlyDirective } from './directives/permissions/hide-if-authorized-readonly.directive';
import { HideIfPermissionUnauthorizedDirective } from './directives/permissions/hide-if-permission-unauthorized.directive';
import { HideIfUnauthorizedDirective } from './directives/permissions/hide-if-unauthorized.directive';
import { AutoRefreshComponent } from './forms/components/auto-refresh/auto-refresh.component';
import { CustomFormsModule } from './forms/custom-forms.module';
import { IdentityErrorComponent } from './IdentityError/identity-error.component';
import { ModalConfirmComponent } from './modals/components/modal-confirm.component';
import { ModalTemplateComponent } from './modals/components/modal-template.component';
import { WidgetSettingsFormDirective } from './modals/directives/widget-settings-form.directive';
import { PipesModule } from './pipes/pipes.module';
import { ActiveJobComponent } from './popover/components/active-job/active-job.component';
import { GridCellActiveJobStatusComponent } from './popover/components/grid-custom-components/grid-cell-active-job-status.component';
import { GridCellLinkComponent } from './popover/components/grid-custom-components/grid-cell-link.component';
import { SchedulerActiveJobsComponent } from './popover/components/scheduler-active-jobs/scheduler-active-jobs.component';
import { ToastComponent } from './toast-notification/components/toast.component';
import { LocaleDatePipe } from './utils/pipes/locale-date.pipe';
import { CardItemComponent } from './card-item/card-item.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { TagElementComponent } from './tag-element/tag-element.component';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    ModalTemplateComponent,
    ModalConfirmComponent,
    NgbModule,
    BsDropdownModule,
    SaveViewFormComponent,
    AddDcuFormComponent,
    EditDcuFormComponent,
    SchedulerJobComponent,
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
    PlcMeterBreakerModeComponent,
    PlcMeterRelaysConnectComponent,
    PlcMeterRelaysDisconnectComponent,
    PlcMeterRelaysStateComponent,
    PlcMeterRelaysSetModeComponent,
    PlcMeterJobsRegistersComponent,
    PlcMeterSetDisplaySettingsComponent,
    DcuFwUpgradeComponent,
    JobsSelectComponent,
    CronScheduleComponent,
    SecurityActivateHlsComponent,
    SecurityRekeyComponent,
    PopoverInstantValuesComponent,
    PlcMeterJobsAssignExistingComponent,
    SecurityChangePasswordComponent,
    HideIfAllPermissionsUnauthorizedDirective,
    HideIfAnyPermissionsUnauthorizedDirective,
    HideIfPermissionUnauthorizedDirective,
    HideDividerIfPermissionsUnauthorizedDirective,
    AlarmNotificationRulesComponent,
    PlcReadRegistersComponent,
    StatusJobComponent,
    ActiveJobsListComponent,
    PageTitleComponent
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
    AgGridModule.withComponents([
      GridCellActiveJobStatusComponent,
      GridCellLinkComponent,
      GridSelectionHeaderComponent,
      GridSelectionHeaderScrollableComponent,
      GridCellNameComponent,
      GridCellIdNumberComponent,
      GridCellIpComponent,
      GridCellActiveReadOnlyComponent
    ]),
    CdTimerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxDaterangepickerMd.forRoot({ format: environment.dateFormat, firstDay: environment.fistDay }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      extend: true,
      defaultLanguage: 'en'
    })
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
    AddDcuFormComponent,
    EditDcuFormComponent,
    SchedulerJobComponent,
    PlcMeterTouConfigComponent,
    PlcMeterFwUpgradeComponent,
    PlcMeterMonitorComponent,
    PlcMeterLimiterComponent,
    RegistersSelectComponent,
    DataConcentratorUnitsSelectComponent,
    TouConfigSelectComponent,
    ToastComponent,
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
    GridSelectionHeaderScrollableComponent,
    GridCellNameComponent,
    GridCellIdNumberComponent,
    GridCellIpComponent,
    PlcMeterBreakerModeComponent,
    PlcMeterRelaysConnectComponent,
    PlcMeterRelaysDisconnectComponent,
    PlcMeterRelaysStateComponent,
    PlcMeterRelaysSetModeComponent,
    PlcMeterJobsRegistersComponent,
    PlcMeterSetDisplaySettingsComponent,
    DcuFwUpgradeComponent,
    JobsSelectComponent,
    GridCellActiveReadOnlyComponent,
    CronScheduleComponent,
    SecurityActivateHlsComponent,
    SecurityRekeyComponent,
    PopoverInstantValuesComponent,
    PlcMeterJobsAssignExistingComponent,
    SecurityChangePasswordComponent,
    HideIfAllPermissionsUnauthorizedDirective,
    HideIfAnyPermissionsUnauthorizedDirective,
    HideIfPermissionUnauthorizedDirective,
    HideDividerIfPermissionsUnauthorizedDirective,
    AlarmNotificationRulesComponent,
    AddJobComponent,
    PlcReadRegistersComponent,
    StatusJobComponent,
    ActiveJobsListComponent,
    AddJobComponent,
    CardItemComponent,
    PageTitleComponent,
    PageLayoutComponent,
    TagElementComponent
  ],
  entryComponents: [
    ModalConfirmComponent,
    SaveViewFormComponent,
    AddDcuFormComponent,
    EditDcuFormComponent,
    SchedulerJobComponent,
    PlcMeterTouConfigComponent,
    PlcMeterFwUpgradeComponent,
    PlcMeterMonitorComponent,
    PlcMeterLimiterComponent,
    RegistersSelectComponent,
    DataConcentratorUnitsSelectComponent,
    TouConfigSelectComponent,
    PlcMeterTouConfigImportComponent,
    PlcMeterTemplatesImportComponent,
    PlcMeterBreakerModeComponent,
    PlcMeterRelaysConnectComponent,
    PlcMeterRelaysDisconnectComponent,
    PlcMeterRelaysStateComponent,
    PlcMeterRelaysSetModeComponent,
    PlcMeterJobsRegistersComponent,
    PlcMeterSetDisplaySettingsComponent,
    DcuFwUpgradeComponent,
    JobsSelectComponent,
    CronScheduleComponent,
    SecurityActivateHlsComponent,
    SecurityRekeyComponent,
    PlcMeterJobsAssignExistingComponent,
    SecurityChangePasswordComponent,
    AlarmNotificationRulesComponent,
    PlcReadRegistersComponent
  ],
  providers: [AgGridSharedFunctionsService]
})
export class SharedModule {}

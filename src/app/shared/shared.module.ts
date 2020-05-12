import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseTemplateComponent } from './base-template/components/base-template.component';
import { SidebarComponent } from './base-template/components/sidebar.component';
import { SidebarMeterComponent } from './base-template/components/sidebar-meter.component';
import { SidebarDropdownDirective } from './base-template/directives/sidebar-dropdown.directive';
import { UserLoggedInfoComponent } from './base-template/components/user-logged-info.component';
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
import { ModalChangePasswordComponent } from './modals/components/modal-change-password.component';
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
import { PlcMeterReadScheduleComponent } from '../features/meter-units/components/plc-meter-read-schedule/plc-meter-read-schedule.component';
import { SaveViewFormMUTComponent } from '../features/meter-units/types/components/save-view-form/save-view-form-meter-units-type.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { AutoRefreshComponent } from './forms/components/auto-refresh/auto-refresh.component';
import { PlcMeterTouConfigComponent } from '../features/meter-units/components/plc-meter-tou-config/plc-meter-tou-config.component';
import { TouConfigSelectComponent } from '../features/tou-config-select/component/tou-config-select.component';
import { IdentityErrorComponent } from './IdentityError/identity-error.component';
import { DisableIfActionUnauthorizedDirective } from './directives/permissions/disable-if-action-unauthorized.directive';
import { HideIfActionUnauthorizedDirective } from './directives/permissions/hide-if-action-unauthorized.directive';
import { ActiveJobsComponent } from '../features/jobs/components/active-jobs/active-jobs.component';

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
    SaveViewFormComponent,
    SaveViewFormMUTComponent,
    AddDcuFormComponent,
    PlcMeterReadScheduleComponent,
    ActiveJobsComponent,
    PlcMeterTouConfigComponent,
    RegistersSelectComponent,
    TouConfigSelectComponent,
    ModalChangePasswordComponent,
    DisableIfAuthorizedReadonlyDirective,
    DisableIfUnauthorizedDirective,
    HideIfAuthorizedReadonlyDirective,
    HideIfUnauthorizedDirective,
    DisableIfActionUnauthorizedDirective,
    HideIfActionUnauthorizedDirective,
    NumberOnlyDirective,
    PipesModule,
    BreadcrumbsModule,
    AutoRefreshComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    TranslateModule,
    CustomFormsModule,
    BreadcrumbsModule,
    GridsterModule,
    AgGridModule.withComponents([])
  ],
  declarations: [
    BaseTemplateComponent,
    SidebarComponent,
    SidebarMeterComponent,
    SidebarDropdownDirective,
    UserLoggedInfoComponent,
    ActionPreventerComponent,
    LocaleDatePipe,
    HeaderTitleComponent,
    SaveViewFormComponent,
    SaveViewFormMUTComponent,
    AddDcuFormComponent,
    PlcMeterReadScheduleComponent,
    ActiveJobsComponent,
    PlcMeterTouConfigComponent,
    RegistersSelectComponent,
    TouConfigSelectComponent,
    ToastComponent,
    CardComponent,
    ModalTemplateComponent,
    ModalConfirmComponent,
    WidgetSettingsFormDirective,
    ModalChangePasswordComponent,
    DisableIfAuthorizedReadonlyDirective,
    DisableIfUnauthorizedDirective,
    HideIfAuthorizedReadonlyDirective,
    HideIfUnauthorizedDirective,
    DisableIfActionUnauthorizedDirective,
    HideIfActionUnauthorizedDirective,
    NumberOnlyDirective,
    SideFixedNavComponent,
    Page404Component,
    AutoRefreshComponent,
    IdentityErrorComponent
  ],
  entryComponents: [
    ModalChangePasswordComponent,
    ModalConfirmComponent,
    SaveViewFormComponent,
    SaveViewFormMUTComponent,
    AddDcuFormComponent,
    PlcMeterReadScheduleComponent,
    ActiveJobsComponent,
    PlcMeterTouConfigComponent,
    RegistersSelectComponent,
    TouConfigSelectComponent
  ]
})
export class SharedModule {}

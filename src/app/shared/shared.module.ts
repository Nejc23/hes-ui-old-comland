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
    AddDcuFormComponent,
    PlcMeterReadScheduleComponent,
    RegistersSelectComponent,
    ModalChangePasswordComponent,
    DisableIfAuthorizedReadonlyDirective,
    DisableIfUnauthorizedDirective,
    HideIfAuthorizedReadonlyDirective,
    HideIfUnauthorizedDirective,
    NumberOnlyDirective,
    PipesModule,
    BreadcrumbsModule
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
    GridsterModule
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
    AddDcuFormComponent,
    PlcMeterReadScheduleComponent,
    RegistersSelectComponent,
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
    NumberOnlyDirective,
    SideFixedNavComponent,
    Page404Component
  ],
  entryComponents: [
    ModalChangePasswordComponent,
    ModalConfirmComponent,
    SaveViewFormComponent,
    AddDcuFormComponent,
    PlcMeterReadScheduleComponent,
    RegistersSelectComponent
  ]
})
export class SharedModule {}

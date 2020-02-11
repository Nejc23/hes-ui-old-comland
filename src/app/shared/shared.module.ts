import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseTemplateComponent } from './base-template/components/base-template.component';
import { SidebarComponent } from './base-template/components/sidebar.component';
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
import { TableModule } from './tables/table.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DefaultWidgetSettingComponent } from './modals/components/widget-settings/default-widget-setting.component';
import { DefaultSettingsFormComponent } from './modals/components/widget-settings/default-form/default-settings-form.component';
import { WidgetSettingsFormDirective } from './modals/directives/widget-settings-form.directive';
import { ModalChangePasswordComponent } from './modals/components/modal-change-password.component';
import { DisableIfAuthorizedReadonlyDirective } from './directives/permissions/disable-if-authorized-readonly.directive';
import { DisableIfUnauthorizedDirective } from './directives/permissions/disable-if-unauthorized.directive';
import { HideIfAuthorizedReadonlyDirective } from './directives/permissions/hide-if-authorized-readonly.directive';
import { HideIfUnauthorizedDirective } from './directives/permissions/hide-if-unauthorized.directive';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { TableService } from './tables/services/table.service';
import { ModalConfirmComponent } from './modals/components/modal-confirm.component';
import { PipesModule } from './pipes/pipes.module';

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
    TableModule,
    NgxChartsModule,
    DefaultWidgetSettingComponent,
    DefaultSettingsFormComponent,
    ModalChangePasswordComponent,
    DisableIfAuthorizedReadonlyDirective,
    DisableIfUnauthorizedDirective,
    HideIfAuthorizedReadonlyDirective,
    HideIfUnauthorizedDirective,
    NumberOnlyDirective,
    PipesModule
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
    TableModule,
    NgxChartsModule
  ],
  declarations: [
    BaseTemplateComponent,
    SidebarComponent,
    SidebarDropdownDirective,
    UserLoggedInfoComponent,
    ActionPreventerComponent,
    LocaleDatePipe,
    HeaderTitleComponent,
    ToastComponent,
    CardComponent,
    ModalTemplateComponent,
    ModalConfirmComponent,
    DefaultWidgetSettingComponent,
    DefaultSettingsFormComponent,
    WidgetSettingsFormDirective,
    ModalChangePasswordComponent,
    DisableIfAuthorizedReadonlyDirective,
    DisableIfUnauthorizedDirective,
    HideIfAuthorizedReadonlyDirective,
    HideIfUnauthorizedDirective,
    NumberOnlyDirective
  ],
  entryComponents: [DefaultWidgetSettingComponent, DefaultSettingsFormComponent, ModalChangePasswordComponent, ModalConfirmComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [TableService]
    };
  }
}

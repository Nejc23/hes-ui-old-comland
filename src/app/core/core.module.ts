import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SidebarCookieStoreService } from './../shared/base-template/components/services/sidbebar-cookie-store.service';
import { ApiUrlInterceptor } from './api-url/api-url.interceptor';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { AuthService } from './auth/services/auth.service';
import { AppConfigStoreService } from './configuration/services/app-config-store.service';
import { EnsureModuleLoadedOnceGuard } from './ensureModuleLoadedOnceGuard';
import { ErrorsInterceptor } from './error-handler/interceptors/error-handler.interceptor';
import { ErrorHandlerService } from './error-handler/services/error-handler.service';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permissions.guard';
import { HeaderInjectorInterceptor } from './header-injector/interceptors/header-injector.interceptor';
import { PermissionService } from './permissions/services/permission.service';
import { PermissionsStoreService } from './permissions/services/permissions-store.service';
import { PermissionsService } from './permissions/services/permissions.service';
import { RoleService } from './permissions/services/role.service';
import { AppStoreService } from './stores/services/app-store.service';
import { GridLayoutSessionStoreService } from './utils/services/grid-layout-session-store.service';
import { GridSettingsCookieStoreService } from './utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from './utils/services/grid-settings-session-store.service';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  exports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [
    AuthService,
    AppStoreService,
    AuthGuard,
    PermissionGuard,
    CookieService,
    PermissionsService,
    PermissionService,
    PermissionsStoreService,
    AppConfigStoreService,
    RoleService,
    ErrorHandlerService,
    GridSettingsCookieStoreService,
    GridSettingsSessionStoreService,
    SidebarCookieStoreService,
    GridLayoutSessionStoreService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInjectorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true
    }
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: ApiUrlInterceptor,
      multi: true
    }*/
    // fakeBaceknd
    // ,fakeBackendProvider
  ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  // Ensure that CoreModule is only loaded into AppModule
  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule
    };
  }
}

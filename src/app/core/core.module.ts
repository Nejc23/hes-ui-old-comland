import { SidebarSessionStoreService } from './../shared/base-template/components/services/sidbebar-session-store.service';
import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EnsureModuleLoadedOnceGuard } from './ensureModuleLoadedOnceGuard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth/services/auth.service';
import { AppStoreService } from './stores/services/app-store.service';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { HeaderInjectorInterceptor } from './header-injector/interceptors/header-injector.interceptor';
import { ErrorsInterceptor } from './error-handler/interceptors/error-handler.interceptor';
import { ApiUrlInterceptor } from './api-url/api-url.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { CookieService } from 'ngx-cookie-service';
import { PermissionsService } from './permissions/services/permissions.service';
import { PermissionsStoreService } from './permissions/services/permissions-store.service';
import { ErrorHandlerService } from './error-handler/services/error-handler.service';
import { fakeBackendProvider } from 'src/debug/interceptors/main-fake.interceptor';
import { GridSettingsCookieStoreService } from './utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from './utils/services/grid-settings-session-store.service';
import { GridLayoutSessionStoreService } from './utils/services/grid-layout-session-store.service';
import { RoleService } from './permissions/services/role.service';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  exports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [
    AuthService,
    AppStoreService,
    AuthGuard,
    PermissionsGuard,
    CookieService,
    PermissionsService,
    PermissionsStoreService,
    RoleService,
    ErrorHandlerService,
    GridSettingsCookieStoreService,
    GridSettingsSessionStoreService,
    SidebarSessionStoreService,
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiUrlInterceptor,
      multi: true
    },
    // fakeBaceknd
    fakeBackendProvider
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

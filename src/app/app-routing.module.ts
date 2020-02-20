import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseTemplateComponent } from './shared/base-template/components/base-template.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PermissionsGuard } from './core/guards/permissions.guard';
import { UserLoginComponent } from './features/users/user-login.component';
import { Page404Component } from './shared/404/page-404.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: UserLoginComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: '',
    component: BaseTemplateComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PermissionsGuard],
    runGuardsAndResolvers: 'always',
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dataConcentratorUnits',
        loadChildren: 'src/app/features/data-concentrator-units/modules/data-concentrator-units.module#DataConcentratorUnitsModule'
      },
      {
        path: 'meterUnits',
        loadChildren: 'src/app/features/meter-units/modules/meter-units.module#MeterUnitsModule'
      },
      {
        path: 'dashboard',
        loadChildren: 'src/app/features/dashboard/modules/dashboard.module#DashboardModule'
      },
      {
        path: 'users',
        loadChildren: 'src/app/features/users/modules/user.module#UserModule'
      },
      {
        path: 'help',
        loadChildren: 'src/app/features/help/modules/help.module#HelpModule'
      },
      {
        path: 'devextreme',
        loadChildren: 'src/app/features/samples/devextreme/modules/devextreme.module#DevextremeModule'
      }
    ]
  },
  { path: '404', component: Page404Component },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload',
      enableTracing: false,
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseTemplateComponent } from './shared/base-template/components/base-template.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PermissionsGuard } from './core/guards/permissions.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: BaseTemplateComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PermissionsGuard],
    runGuardsAndResolvers: 'always',
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

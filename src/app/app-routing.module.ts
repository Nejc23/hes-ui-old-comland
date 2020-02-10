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
        loadChildren: () => import('src/app/features/dashboard/modules/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users',
        loadChildren: () => import('src/app/features/users/modules/user.module').then(m => m.UserModule)
      },
      {
        path: 'help',
        loadChildren: () => import('src/app/features/help/modules/help.module').then(m => m.HelpModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

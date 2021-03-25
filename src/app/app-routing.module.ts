import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseTemplateComponent } from './shared/base-template/components/base-template.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PermissionsGuard } from './core/guards/permissions.guard';
import { UserLoginComponent } from './features/users/user-login.component';
import { Page404Component } from './shared/404/page-404.component';
import { IdentityErrorComponent } from './shared/IdentityError/identity-error.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dataConcentratorUnits',
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
      {
        path: 'dataConcentratorUnits',
        loadChildren: () =>
          import('src/app/features/data-concentrator-units/modules/data-concentrator-units.module').then(
            (m) => m.DataConcentratorUnitsModule
          )
      },
      {
        path: 'meterUnits',
        loadChildren: () => import('src/app/features/meter-units/common/modules/meter-units.module').then((m) => m.MeterUnitsModule)
      },
      {
        path: 'schedulerJobs',
        loadChildren: () => import('src/app/features/jobs/modules/scheduler-jobs.module').then((m) => m.SchedulerJobsModule)
      },
      {
        path: 'alarmsEvents',
        loadChildren: () => import('src/app/features/alarms-events/modules/alarms-events.module').then((m) => m.AlarmsEventsModule)
      },
      {
        path: 'configuration',
        loadChildren: () => import('src/app/features/configuration/modules/configuration.module').then((m) => m.ConfigurationModule)
      }
    ]
  },
  {
    path: 'identityError',
    component: IdentityErrorComponent,
    runGuardsAndResolvers: 'always'
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

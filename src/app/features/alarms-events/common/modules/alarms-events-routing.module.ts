import { PermissionEnumerator } from './../../../../core/permissions/enumerators/permission-enumerator.model';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlarmsEventsComponent } from '../../components/alarms-events.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: `Alarms & Events`,
      permission: PermissionEnumerator.View_Alarms
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: AlarmsEventsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmsEventsRoutingModule {
  constructor() {
    routes.map((x) => {
      x.children !== undefined
        ? x.children.map((y) => {
            y.children !== undefined
              ? y.children.map((z) =>
                  z.data.breadcrumb !== null ? (z.data.breadcrumb = `${z.data.breadcrumb}`) : (z.data.breadcrumb = null)
                )
              : (y = y);
            y.data.breadcrumb !== null ? (y.data.breadcrumb = `${y.data.breadcrumb}`) : (y.data.breadcrumb = null);
          })
        : (x = x);
      x.data.breadcrumb = `${x.data.breadcrumb}`;
    });
    // routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

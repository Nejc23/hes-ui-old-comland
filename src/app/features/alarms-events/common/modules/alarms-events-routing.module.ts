import { PermissionEnumerator } from '../../../../core/permissions/enumerators/permission-enumerator.model';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlarmsEventsListComponent } from '../../components/alarms-events-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'MENU.ALARMS-EVENTS',
      permission: PermissionEnumerator.View_Alarms
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: AlarmsEventsListComponent
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
  }
}

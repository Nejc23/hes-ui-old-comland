import { Breadcrumb } from './../../../../shared/breadcrumbs/interfaces/breadcrumb.interface';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { AlarmsEventsComponent } from '../../components/alarms-events.component';

// import { AllForJobComponent } from '../../all-for-job/components/all-for-job.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: $localize`Alarms & Events`,
      permission: FunctionalityEnumerator.alarmsEvents
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
                  z.data.breadcrumb !== null ? (z.data.breadcrumb = $localize`${z.data.breadcrumb}`) : (z.data.breadcrumb = null)
                )
              : (y = y);
            y.data.breadcrumb !== null ? (y.data.breadcrumb = $localize`${y.data.breadcrumb}`) : (y.data.breadcrumb = null);
          })
        : (x = x);
      x.data.breadcrumb = $localize`${x.data.breadcrumb}`;
    });
    // routes.forEach(x => (x.data.breadcrumb = i18n(x.data.breadcrumb)));
  }
}

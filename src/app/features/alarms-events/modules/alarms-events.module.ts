import { AlarmsEventsRoutingModule } from './../common/modules/alarms-events-routing.module';
import { NgModule } from '@angular/core';
import { AlarmsEventsComponent } from '../components/alarms-events.component';

@NgModule({
  entryComponents: [],
  declarations: [AlarmsEventsComponent],
  imports: [AlarmsEventsRoutingModule],
  exports: []
})
export class AlarmsEventsModule {}

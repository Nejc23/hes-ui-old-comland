import { Component } from '@angular/core';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'meter-unit-detail.component.html'
})
export class MeterUnitDetailComponent {
  constructor(private breadcrumbService: BreadcrumbService, private router: Router) {
    breadcrumbService.setPageName('Meter Unit');
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.MU;
  }

  // actions - rights
  get actionMUBreakerStatus() {
    return ActionEnumerator.MUBreakerStatus;
  }
  get actionMUConnect() {
    return ActionEnumerator.MUConnect;
  }
  get actionMUDisconnect() {
    return ActionEnumerator.MUDisconnect;
  }
  get actionMUReadJobs() {
    return ActionEnumerator.MUReadJobs;
  }
  get actionMUSetLimiter() {
    return ActionEnumerator.MUSetLimiter;
  }
  get actionMUTOU() {
    return ActionEnumerator.MUTOU;
  }
  get actionMUUpgrade() {
    return ActionEnumerator.MUUpgrade;
  }

  public editMeterUnit() {}

  public onScheduleReadJobs() {}

  public onUpgrade() {}

  public onActivateUpgrade() {}

  public onConnect() {}

  public onDisconnect() {}

  public onBreakerStatus() {}

  public onTou() {}

  public onSetLimiter() {}

  public onSetMonitor() {}
}

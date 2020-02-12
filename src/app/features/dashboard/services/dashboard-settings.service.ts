import { Injectable } from '@angular/core';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DashboardStoreService } from './dashboard-store.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { DashboardRepositoryService } from 'src/app/core/repository/services/dashboards/dashboard-repository.service';
import { DashboardModel } from 'src/app/core/repository/interfaces/dashboards/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardSettingsService {
  successMessageCreate = 'Dashboard created';
  successMessageUpdate = 'Dashboard updated';
  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private dashboardStore: DashboardStoreService,
    private dashboardRepository: DashboardRepositoryService
  ) {
    this.successMessageCreate = $localize`Dashboard created`;
    this.successMessageUpdate = $localize`Dashboard updated`;
  }

  createForm(formState: DashboardModel): FormGroup {
    return this.formBuilder.group({
      [nameOf<DashboardModel>(o => o.id)]: [formState.id, Validators.required],
      [nameOf<DashboardModel>(o => o.dashboardName)]: [formState.dashboardName, Validators.required],
      [nameOf<DashboardModel>(o => o.refreshEveryMinute)]: [formState.refreshEveryMinute]
    });
  }

  setupSettings(): Observable<void> {
    const dashboardId = this.dashboardStore.getDashboardValue();
    return this.dashboardRepository.getDashboard(dashboardId).pipe(
      map(x => this.createForm(x)),
      map(x => this.dashboardStore.setSettingsForm(x))
    );
  }

  save(): Observable<DashboardModel> {
    const form = this.dashboardStore.getSettingsForm();
    const dashboardId = this.dashboardStore.getDashboardValue();
    const request = this.dashboardRepository.saveDashboard(dashboardId, form.value);
    return this.formUtils.saveForm(form, request, this.successMessageUpdate);
  }

  create(): Observable<DashboardModel> {
    const form = this.dashboardStore.getSettingsForm();
    const request = this.dashboardRepository.createDashboard(form.value);
    return this.formUtils.saveForm(form, request, this.successMessageCreate);
  }
}

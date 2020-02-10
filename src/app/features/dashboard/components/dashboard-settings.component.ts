import { Component, OnInit, Input } from '@angular/core';
import { DashboardSettingsService } from '../services/dashboard-settings.service';
import { DashboardStoreService } from '../services/dashboard-store.service';
import { DashboardState } from '../interfaces/dashboard-state.interface';
import { Observable, pipe, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DashboardModel } from '../interfaces/dashboard-model.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tap, map } from 'rxjs/operators';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DashboardControlsForm } from '../interfaces/dashboard-controls-form.interface';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html'
})
export class DashboardSettingsComponent implements OnInit {
  @Input() isNew = false;

  state$: Observable<DashboardState>;
  form: DashboardModel = {
    id: 0,
    dashboardName: '',
    refreshEveryMinute: false
  };
  dashboardId = 0;
  constructor(
    private dashboardSettings: DashboardSettingsService,
    private dashboardStore: DashboardStoreService,
    private dashboardService: DashboardService,
    private i18n: I18n,
    private modal: NgbActiveModal
  ) {}

  ngOnInit() {
    if (this.isNew) {
      const x = this.dashboardSettings.createForm(this.form);
      this.dashboardStore.setSettingsForm(x);
    } else {
      this.dashboardSettings.setupSettings().subscribe(() => {});
    }

    this.state$ = this.dashboardStore.stateObservable;
  }

  save() {
    if (this.isNew) {
      this.createNewDasboard();
    } else {
      this.updateDashboard();
    }
  }

  private createNewDasboard() {
    this.dashboardSettings
      .create()
      .pipe(tap(() => this.modal.close()))
      .subscribe(x => {
        if (x != null) {
          const form = this.dashboardStore.getControlsForm();
          form.get(nameOf<DashboardControlsForm>(o => o.dashboard)).setValue(x.id);
          of();
        }
      });
  }

  private updateDashboard() {
    this.dashboardSettings
      .save()
      .pipe(tap(() => this.modal.close()))
      .subscribe(x => {
        if (x != null) {
          this.dashboardSettings.setupSettings().subscribe(() => {});
        }
      });
  }

  onDismiss() {
    this.modal.dismiss();
  }

  get refreshProperty() {
    return nameOf<DashboardModel>(o => o.refreshEveryMinute);
  }

  get dashboardNameProperty() {
    return nameOf<DashboardModel>(o => o.dashboardName);
  }

  getForm(state: DashboardState): FormGroup {
    return state.settingsForm;
  }

  isFormSet(state: DashboardState): boolean {
    return state.settingsForm ? true : false;
  }
}

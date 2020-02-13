import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardState } from '../interfaces/dashboard-state.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { DashboardStoreService } from '../services/dashboard-store.service';
import { FormGroup } from '@angular/forms';
import { DashboardGridState } from '../interfaces/dashboard-grid-state.interface';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DashboardRefreshService } from '../services/dashboard-refresh.service';
import { DashboardEventsService } from '../services/dashboard-events.service';
import { DashboardGridService } from '../services/dashboard-grid.service';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { DashboardSettingsComponent } from './dashboard-settings.component';
import * as _ from 'lodash';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [ModalService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  state$: Observable<DashboardState>;

  active = new ReplaySubject(1);
  isEmpty = false;
  isLoading = true;
  constructor(
    private dashboardService: DashboardService,
    private dashboardStore: DashboardStoreService,
    private dashboardRefreshService: DashboardRefreshService,
    private dashboardEvents: DashboardEventsService,
    private dashboardGrid: DashboardGridService,
    private sidebatService: SidebarService,
    private gridService: DashboardGridService,
    private modalService: ModalService,
    private i18n: I18n
  ) {
    this.sidebatService.headerTitle = this.i18n(`Dashboards`);
  }

  get formFunctionality() {
    return FunctionalityEnumerator.dashboard;
  }

  ngOnInit() {
    this.dashboardRefreshService.setRefreshInterval();
    this.dashboardService.createControlsForm();
    this.dashboardService
      .initDashboardOptions()
      .pipe(switchMap(() => this.dashboardService.setupListWidgets()))
      .subscribe(() => {
        this.dashboardGrid.setGridStateFromServer().subscribe(() => {
          this.dashboardGrid.setItemsDataFromServer();
          this.isLoading = false;
        });
      });

    this.state$ = this.dashboardStore.stateObservable;
    this.dashboardEvents
      .getRefreshGrid$()
      .pipe(
        switchMap(() => this.dashboardGrid.onRefreshGrid()),
        takeUntil(this.active)
      )
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.active.next();
    this.dashboardRefreshService.removeRefreshInterval();
  }

  getControlsForm(state: DashboardState): FormGroup {
    return state.controlsForm;
  }

  getGridState(state: DashboardState): DashboardGridState {
    return state.gridState;
  }

  getPowerlineOptions(state: DashboardState): Codelist<number>[] {
    return state.powerlineOptions;
  }

  getDashboardOptions(state: DashboardState): Codelist<number>[] {
    if (this.isLoading === false && state.dashboardOptions.length === 0) {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
    return state.dashboardOptions;
  }

  isEditMode(): boolean {
    return this.dashboardService.isEditMode();
  }

  addFirstDashboard() {
    const modalRef = this.modalService.open(DashboardSettingsComponent);
    const component: DashboardSettingsComponent = modalRef.componentInstance;
    component.isNew = true;
    modalRef.result
      .then(() => {
        this.gridService.setGridStateFromServer().subscribe();
        this.dashboardService.goToEditMode();
      })
      .catch(() => {});
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DashboardControlsForm } from '../interfaces/dashboard-controls-form.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DashboardService } from '../services/dashboard.service';
import { DashboardGridService } from '../services/dashboard-grid.service';
import { DashboardSettingsComponent } from './dashboard-settings.component';
import { DashboardRefreshService } from '../services/dashboard-refresh.service';
import { DashboardGridState } from '../interfaces/dashboard-grid-state.interface';
import { SelectConfig } from 'src/app/shared/forms/interfaces/select-config.interface';
import { DashboardStoreService } from '../services/dashboard-store.service';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { PermissionsService } from 'src/app/core/permissions/services/permissions.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { Codelist } from 'src/app/core/repository/interfaces/codelists/codelist.interface';

@Component({
  selector: 'app-dashboard-controls',
  templateUrl: './dashboard-controls.component.html',
  providers: [ModalService]
})
export class DashboardControlsComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() powerlineOptions: Codelist<number>;
  @Input() dashboardOptions: Array<Codelist<number>>;
  @Input() gridState: DashboardGridState;

  configInputSelect: SelectConfig = { labelField: '', valueField: '', searchField: [], showAddButton: this.canEditData() };

  get formFunctionality() {
    return FunctionalityEnumerator.dashboard;
  }

  constructor(
    private i18n: I18n,
    private dashboardService: DashboardService,
    private gridService: DashboardGridService,
    private modalService: ModalService,
    private dashboardRefresh: DashboardRefreshService,
    private dashboardStore: DashboardStoreService,
    private authorizationService: PermissionsService
  ) {}

  canEditData() {
    return this.authorizationService.hasEditAccess(FunctionalityEnumerator.dashboard);
  }

  ngOnInit() {}

  onEditButtonClick() {
    this.dashboardService.goToEditMode();
  }

  onReadonlyButtonClick() {
    this.dashboardService.goToReadOnlyMode();
  }

  onRefreshClick() {
    this.dashboardRefresh.refreshDashboard();
  }

  onSettingsButtonClick() {
    const modalRef = this.modalService.open(DashboardSettingsComponent);
    const component: DashboardSettingsComponent = modalRef.componentInstance;
    component.isNew = false;
    modalRef.result.then().catch(() => {});
  }

  onSelectItem(obj: Codelist<number>) {
    this.dashboardStore.setSelectedDashboardId(obj.id);
    this.gridService.setGridStateFromServer().subscribe(() => {
      this.gridService.onRefreshGrid();
    });
  }

  onAddNewDashboard() {
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

  get dashboardProperty() {
    return nameOf<DashboardControlsForm>(o => o.dashboard);
  }

  canShowRefreshButton(): boolean {
    return this.gridState && !this.gridState.refreshIntervalActive;
  }

  isReadonlyMode(): boolean {
    // console.log(`this.dashboardOptions.id=${JSON.stringify(this.dashboardOptions)}, length=${this.dashboardOptions.length}`)
    return this.dashboardService.isReadonlyMode() && this.dashboardOptions.length > 0;
  }

  isEditMode(): boolean {
    return this.dashboardService.isEditMode();
  }
}

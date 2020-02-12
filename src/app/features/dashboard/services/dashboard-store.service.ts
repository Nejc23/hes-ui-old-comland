import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/stores/helpers/store.helper';
import { DashboardState } from '../interfaces/dashboard-state.interface';
import { FormGroup } from '@angular/forms';
import { DashboardGridState } from '../interfaces/dashboard-grid-state.interface';
import { DashboardGridMode } from '../enums/dashboard-grid-mode.enum';
import { DashboardControlsForm } from '../interfaces/dashboard-controls-form.interface';
import { GridsterConfig } from 'angular-gridster2';
import { DashboardGridItem } from '../interfaces/dashboard-grid-item.interface';
import { DashboardListWidget } from '../interfaces/dashboard-list-widget.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { Subject } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardStoreService extends Store<DashboardState> {
  private customSubject = new Subject<any>();
  customObservable = this.customSubject.asObservable();

  constructor() {
    super({
      controlsForm: null,
      gridState: null,
      gridMode: DashboardGridMode.readonly,
      powerlineOptions: [],
      dashboardOptions: [],
      settingsForm: null,
      listWidgets: [],
      refreshInterval: null,
      selectedDashboardId: null
    });
  }

  setListWidgets(widgets: DashboardListWidget[]) {
    this.setState({
      ...this.state,
      listWidgets: widgets
    });
  }
  getListWidgets() {
    return this.state.listWidgets;
  }

  setControlsForm(controlsForm: FormGroup) {
    this.setState({
      ...this.state,
      controlsForm
    });
  }

  setGridState(gridState: DashboardGridState) {
    this.setState({
      ...this.state,
      gridState
    });
  }
  getGridState() {
    return this.state.gridState;
  }

  setGridMode(mode: DashboardGridMode) {
    this.setState({
      ...this.state,
      gridMode: mode
    });
  }

  setPowerlineOptions(options: Codelist<number>[]) {
    this.setState({
      ...this.state,
      powerlineOptions: options
    });
  }

  setDashboardOptions(options: Codelist<number>[]) {
    this.setState({
      ...this.state,
      dashboardOptions: options
    });
  }

  setSettingsForm(settingsForm) {
    this.setState({
      ...this.state,
      settingsForm
    });
  }

  setGridDashboard(dashboard: DashboardGridItem[]) {
    this.setState({
      ...this.state,
      gridState: {
        ...this.state.gridState,
        dashboard
      }
    });
  }

  setGridOptions(options: GridsterConfig) {
    this.setState({
      ...this.state,
      gridState: {
        ...this.state.gridState,
        options
      }
    });
  }

  setRefreshInterval(refreshInterval: number) {
    this.setState({
      ...this.state,
      refreshInterval
    });
  }

  addGridItem(item: DashboardGridItem) {
    this.setState({
      ...this.state,
      gridState: {
        ...this.state.gridState,
        dashboard: [...this.state.gridState.dashboard, item]
      }
    });
  }

  setSelectedDashboardId(selectedDashboardId: number) {
    this.setState({
      ...this.state,
      selectedDashboardId
    });
  }

  getControlsForm(): FormGroup {
    return this.state.controlsForm;
  }

  getSettingsForm(): FormGroup {
    return this.state.settingsForm;
  }

  getFirstDashboardOption(): Codelist<number> {
    return this.state.dashboardOptions.length ? this.state.dashboardOptions[0] : null;
  }
  getDashboardValue(): number {
    const dashboardId = this.state.controlsForm.get(nameOf<DashboardControlsForm>(o => o.dashboard)).value;
    return dashboardId;
  }

  getGridMode(): DashboardGridMode {
    return this.state.gridMode;
  }

  getGridDashboard(): DashboardGridItem[] {
    return this.state.gridState.dashboard;
  }

  isRefreshIntervalActive(): boolean {
    return this.state.gridState.refreshIntervalActive;
  }

  refreshItemsWithData() {
    this.customSubject.next('');
  }

  getSelectedDashboardId(): number {
    return this.state.selectedDashboardId;
  }
}

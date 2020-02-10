import { FormGroup } from '@angular/forms';
import { DashboardGridState } from './dashboard-grid-state.interface';
import { DashboardGridMode } from '../enums/dashboard-grid-mode.enum';
import { Codelist } from 'src/app/shared/forms/interfaces/codelist.interface';
import { DashboardListWidget } from './dashboard-list-widget.interface';

export interface DashboardState {
  controlsForm: FormGroup;
  gridState: DashboardGridState;
  gridMode: DashboardGridMode;
  powerlineOptions: Codelist<number>[];
  dashboardOptions: Codelist<number>[];
  settingsForm: FormGroup;
  listWidgets: DashboardListWidget[];
  refreshInterval: number; // id from setInterval function
  selectedDashboardId: number;
}

import { GridsterConfig } from 'angular-gridster2';
import { DashboardGridItem } from './dashboard-grid-item.interface';

export interface DashboardGridState {
  options: GridsterConfig;
  dashboard: Array<DashboardGridItem>;
  refreshIntervalActive: boolean;
}

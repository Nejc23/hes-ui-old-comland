import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';

export interface SidebarItem {
  title: string;
  routeLink: string;
  queryParams?: any;
  icon?: string;
  children: Array<SidebarItem>;
  hasChildren: boolean;
  opened?: string;
  permission?: FunctionalityEnumerator;
  openInNewTab?: boolean;
  isBorder?: boolean;
  isRouteAbsolute?: boolean;
}

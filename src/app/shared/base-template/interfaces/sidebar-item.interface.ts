import { PermissionEnumerator } from './../../../core/permissions/enumerators/permission-enumerator.model';

export interface SidebarItem {
  title: string;
  routeLink: string;
  queryParams?: any;
  icon?: string;
  isIconOutlined?: boolean;
  children: Array<SidebarItem>;
  hasChildren: boolean;
  opened?: string;
  permission?: PermissionEnumerator;
  openInNewTab?: boolean;
  isBorder?: boolean;
  isRouteAbsolute?: boolean;
}

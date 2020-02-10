import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';

export interface SidebarItem {
  title: string;
  routeLink: string;
  icon?: string;
  children: Array<SidebarItem>;
  hasChildren: boolean;
  opened?: string;
  permission?: FunctionalityEnumerator;
  openInNewTab?: boolean;
}

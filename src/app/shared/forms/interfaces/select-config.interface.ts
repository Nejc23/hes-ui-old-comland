export interface SelectConfig {
  labelField: string;
  valueField: string;
  searchField: Array<string>;
  maxItems?: number;
  preselectFirst?: boolean;
  showAddButton?: boolean;
}

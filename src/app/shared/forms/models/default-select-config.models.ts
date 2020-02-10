import { SelectConfig } from '../interfaces/select-config.interface';

export class DefaultSelectConfig implements SelectConfig {
  labelField = 'value';
  valueField = 'id';
  searchField = ['value'];
  maxItems = 1;
  preselectFirst = false;
  showAddButton = false;

  constructor(labelField: string = 'value', valueField: string = 'id', searchField: Array<string> = ['value'], maxItems: number = 1) {
    this.labelField = labelField;
    this.valueField = valueField;
    this.searchField = searchField;
    this.maxItems = maxItems;
  }
}

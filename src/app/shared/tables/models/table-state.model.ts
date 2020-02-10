import { TableRequest } from '../interfaces/table-request.interface';
import { environment } from 'src/environments/environment';
import { tableCssClasses } from '../consts/table-css-classes.const';
import { TableMessage } from '../helpers/table-message.helper';
import { SortPropDir } from '@swimlane/ngx-datatable/lib/types/sort-prop-dir.type';
import { SortDirection } from '@swimlane/ngx-datatable';

export class TableState {
  isInitialized = false;
  loading = false;
  rows: Array<any> = [];

  messages: TableMessage = new TableMessage();
  cssClasses = tableCssClasses;

  initialSort: SortPropDir = { dir: SortDirection.desc, prop: 'id' };

  tableRequest: TableRequest = {
    filters: [],
    sort: { descending: true, property: 'id' },
    pageSettings: {
      offset: 0,
      pageSize: 10,
      recordCount: 0
    }
  };
}

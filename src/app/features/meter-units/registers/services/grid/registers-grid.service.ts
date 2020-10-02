import { environment } from 'src/environments/environment';
import { Injectable, PipeTransform } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { formatDate } from '@angular/common';
import { GridCellDateComponent } from '../../components/grid/grid-custom-components/grid-cell-date.component';

@Injectable({
  providedIn: 'root'
})
export class RegistersGridService {
  constructor(private i18n: I18n) {}

  setGridColumns() {
    return [
      {
        field: 'timestamp',
        suppressMenu: true,
        sortable: true,
        headerName: this.i18n('Timestamp'),
        headerTooltip: this.i18n('Timestamp'),
        cellRendererFramework: GridCellDateComponent
        // cellRenderer: (data:any) => {
        //   return data && data.value ? formatDate(data.value, environment.dateTimeFormat, selectedLocale) : ''; // return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        // }
      },
      {
        field: 'value',
        suppressMenu: true,
        sortable: true,
        headerName: this.i18n('Value'),
        headerTooltip: this.i18n('Value')
      },
      {
        field: 'status',
        suppressMenu: true,
        sortable: true,
        headerName: this.i18n('Status'),
        headerTooltip: this.i18n('Status')
      }
    ];
  }

  // public setFrameworkComponents() {
  //   return {
  //     gridCellDateComponent: GridCellDateComponent,
  //   };
  // }
}

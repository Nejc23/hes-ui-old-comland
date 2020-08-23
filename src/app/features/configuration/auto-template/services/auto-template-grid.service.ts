import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { configAgGrid } from 'src/environments/config';
import { GridCellEditActionsComponent } from '../../components/grid-custom-components/grid-cell-edit-actions.component';
import { GridCellAddBtnComponent } from '../../components/grid-custom-components/grid-cell-add-btn.component';
import { GridRequiredCellEditorComponent } from '../../components/grid-custom-components/grid-required-cell-editor.component';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesGridService {
  constructor(private i18n: I18n) {}

  /**
   * Set grid settings master
   */
  public setGridOptions() {
    return {
      editType: 'fullRow',

      defaultColDef: {
        sortable: false,
        resizable: false,
        checkboxSelection: false,
        filter: false,
        flex: 1
      },
      animateRows: configAgGrid.animateRows,
      debug: configAgGrid.debug,
      suppressRowClickSelection: true,
      suppressCellSelection: true
    };
  }

  setGridDefaultColumns() {
    return [
      { field: 'autoTemplateRuleId', hide: true },
      {
        field: 'propertyName',
        headerName: this.i18n('Obis'),
        cellEditor: 'gridRequiredCellEditorComponent',
        cellEditorParams: { formName: 'propertyName' },
        valueSetter: params => {
          if (params.oldValue !== params.newValue) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        field: 'propertyValue',
        cellEditor: 'gridRequiredCellEditorComponent',
        cellEditorParams: { formName: 'propertyValue' },
        headerName: this.i18n('Regex'),
        valueSetter: params => {
          if (params.oldValue !== params.newValue) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        field: 'autoTemplateRuleId',
        pinned: 'right',
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        suppressMenu: true,
        editable: false,
        suppressMovable: true,
        cellRendererFramework: GridCellEditActionsComponent,
        headerName: ''
      }
    ];
  }

  public setFrameworkComponents() {
    return {
      gridCellAddBtnComponent: GridCellAddBtnComponent,
      gridRequiredCellEditorComponent: GridRequiredCellEditorComponent
    };
  }
}

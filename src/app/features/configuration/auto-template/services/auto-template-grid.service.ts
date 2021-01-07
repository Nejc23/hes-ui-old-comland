import { Injectable } from '@angular/core';
import { configAgGrid } from 'src/environments/config';
import { GridCellEditActionsComponent } from '../components/grid-custom-components/grid-cell-edit-actions.component';
import { GridCellAddBtnComponent } from '../components/grid-custom-components/grid-cell-add-btn.component';
import { GridRequiredCellEditorComponent } from '../components/grid-custom-components/grid-required-cell-editor.component';
import { GridCellRemoveBtnComponent } from '../components/grid-custom-components/grid-cell-remove-btn.component';
import { GridCellNextRunNoEventComponent } from '../components/grid-custom-components/grid-cell-next-run-no-event.component';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesGridService {
  constructor() {}

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
        headerName: $localize`Obis`,
        cellEditor: 'gridRequiredCellEditorComponent',
        cellEditorParams: { formName: 'propertyName' },
        valueSetter: (params) => {
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
        headerName: $localize`Regex`,
        valueSetter: (params) => {
          if (params.oldValue !== params.newValue) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        field: 'autoTemplateRuleId',
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        suppressMenu: true,
        editable: false,
        suppressMovable: true,
        sortable: false,
        filter: false,
        cellRendererFramework: GridCellEditActionsComponent,
        headerName: '',
        cellClass: 'actions-button-cell'
      }
    ];
  }

  public setFrameworkComponentsJobs() {
    return {
      gridCellNextRunComponent: GridCellNextRunNoEventComponent
    };
  }

  setGridDefaultColumnsJobs() {
    return [
      {
        field: 'type',
        headerName: $localize`Job Type`,
        headerTooltip: $localize`Job Type`
      },
      {
        field: 'description',
        headerName: $localize`Description`,
        headerTooltip: $localize`Description`
      },
      {
        field: 'nextRun',
        cellRenderer: 'gridCellNextRunComponent',
        headerName: $localize`Next run`,
        headerTooltip: $localize`Next run`
      },
      {
        field: 'owner',
        headerName: $localize`Owner`,
        headerTooltip: $localize`Owner`
      },
      {
        field: 'id',
        width: 70,
        minWidth: 70,
        maxWidth: 70,
        suppressMenu: true,
        editable: false,
        suppressMovable: true,
        sortable: false,
        filter: false,
        cellRendererFramework: GridCellRemoveBtnComponent,
        headerName: '',
        cellClass: 'actions-button-cell'
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

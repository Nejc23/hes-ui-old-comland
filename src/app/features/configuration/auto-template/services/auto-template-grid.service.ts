import { Injectable } from '@angular/core';
import { configAgGrid } from 'src/environments/config';
import { GridCellEditActionsComponent } from '../components/grid-custom-components/grid-cell-edit-actions.component';
import { GridCellAddBtnComponent } from '../components/grid-custom-components/grid-cell-add-btn.component';
import { GridRequiredCellEditorComponent } from '../components/grid-custom-components/grid-required-cell-editor.component';
import { GridCellRemoveBtnComponent } from '../components/grid-custom-components/grid-cell-remove-btn.component';
import { GridCellNextRunNoEventComponent } from '../components/grid-custom-components/grid-cell-next-run-no-event.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesGridService {
  constructor(private translate: TranslateService) {}

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
        headerName: this.translate.instant('GRID.OBIS'),
        cellEditor: 'gridRequiredCellEditorComponent',
        cellEditorParams: { formName: 'propertyName' },
        valueSetter: (params) => {
          return params.oldValue !== params.newValue;
        }
      },
      {
        field: 'propertyValue',
        cellEditor: 'gridRequiredCellEditorComponent',
        cellEditorParams: { formName: 'propertyValue' },
        headerName: this.translate.instant('GRID.REGEX'),
        valueSetter: (params) => {
          return params.oldValue !== params.newValue;
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
        headerName: this.translate.instant('GRID.JOB-TYPE'),
        headerTooltip: this.translate.instant('GRID.JOB-TYPE')
      },
      {
        field: 'description',
        headerName: this.translate.instant('GRID.JOB-DESCRIPTION'),
        headerTooltip: this.translate.instant('GRID.JOB-DESCRIPTION')
      },
      {
        field: 'nextRun',
        cellRenderer: 'gridCellNextRunComponent',
        headerName: this.translate.instant('GRID.NEXT-RUN'),
        headerTooltip: this.translate.instant('GRID.NEXT-RUN')
      },
      {
        field: 'owner',
        headerName: this.translate.instant('GRID.OWNER'),
        headerTooltip: this.translate.instant('GRID.OWNER')
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

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridUtils {
  static resizeColumns(gridColumnApi: any, gridOptions: any) {
    gridColumnApi.autoSizeAllColumns(false);

    const grid: any = gridOptions.api;
    const panel = grid.gridPanel;

    const availableWidth = panel.eBodyViewport.clientWidth;
    const columns = panel.columnController.getAllDisplayedColumns();
    const usedWidth = panel.columnController.getWidthOfColsInList(columns);

    let pinnedRightWidth = 0;
    const columnStates = gridColumnApi.getColumnState();

    const pinnedColumn = columnStates.find(c => c.pinned === 'right');

    if (pinnedColumn) {
      pinnedRightWidth = pinnedColumn.width;
    }

    if (usedWidth < availableWidth + pinnedRightWidth) {
      // expand only the last visible nonpinned column

      const lastVisibleColumnIndex = columnStates.map(c => !c.hide && !c.pinned).lastIndexOf(true);
      if (lastVisibleColumnIndex > -1) {
        columnStates[lastVisibleColumnIndex].width =
          columnStates[lastVisibleColumnIndex].width + (availableWidth - usedWidth) + pinnedRightWidth;
        gridColumnApi.applyColumnState({ state: columnStates });
      }
    }
  }
}

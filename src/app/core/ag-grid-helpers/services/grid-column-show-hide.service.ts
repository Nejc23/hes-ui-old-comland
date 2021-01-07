import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridColumnShowHideService {
  // Observable array string sources
  private gridColumnVisibleSetSource = new Subject<string[]>();
  private gridColumnVisibleChangedSource = new Subject<string[]>();

  // Observable array string streams
  listOfColumnVisibilitySet$ = this.gridColumnVisibleSetSource.asObservable();
  listOfColumnsVisibilityChanged$ = this.gridColumnVisibleChangedSource.asObservable();

  // Service commands
  listOfColumnVisibilitySet(columnVisibleList: string[]) {
    this.gridColumnVisibleSetSource.next(columnVisibleList);
  }

  listOfColumnsVisibilityChanged(columnVisibleList: string[]) {
    this.gridColumnVisibleChangedSource.next(columnVisibleList);
  }

  /**
   * Function show only columns defined in param listOfColumnsToBeDisplayed, other columns hides
   * @param gridColumnApi grid column api
   * @param listOfColumnsToBeDisplayed list of columnd ids to be visible on grid
   */
  public refreshGridWithColumnsVisibility(gridColumnApi: any, listOfColumnsToBeDisplayed: string[]) {
    const listCurrentDisplayedColumnsOnGrid = gridColumnApi
      .getAllDisplayedColumns()
      .filter((y) => y.userProvidedColDef.headerName !== undefined && y.userProvidedColDef.headerName.length > 0)
      .map((a: { colId: string }) => a.colId);

    const differenceForHide = listCurrentDisplayedColumnsOnGrid.filter((x) => !listOfColumnsToBeDisplayed.includes(x));
    differenceForHide.forEach((element) => {
      gridColumnApi.setColumnVisible(element, false);
    });

    const differenceForShow = listOfColumnsToBeDisplayed.filter((x) => !listCurrentDisplayedColumnsOnGrid.includes(x));
    differenceForShow.forEach((element) => {
      gridColumnApi.setColumnVisible(element, true);
    });
  }

  /**
   * function emit event to set visible columns
   * @param gridColumnApi grid column api
   */
  public sendColumnVisibilityChanged(gridColumnApi: any) {
    this.listOfColumnVisibilitySet(
      gridColumnApi
        .getAllDisplayedColumns()
        .filter((y) => y.userProvidedColDef.headerName !== undefined && y.userProvidedColDef.headerName.length > 0)
        .map((a) => a.colId)
    );
  }
}

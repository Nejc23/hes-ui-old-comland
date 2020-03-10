import { Component, ElementRef } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-grid-selection-header',
  templateUrl: './grid-selection-header.component.html'
})
export class GridSelectionHeaderComponent implements IHeaderAngularComp {
  public params: any;
  private ascSort: string;
  private descSort: string;
  private noSort: string;
  private elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  agInit(params): void {
    this.params = params;

    params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
    this.onSortChanged();
  }

  onSortChanged() {
    this.ascSort = this.descSort = this.noSort = 'inactive';
    if (this.params.column.isSortAscending()) {
      this.ascSort = 'active';
    } else if (this.params.column.isSortDescending()) {
      this.descSort = 'active';
    } else {
      this.noSort = 'active';
    }
  }
}

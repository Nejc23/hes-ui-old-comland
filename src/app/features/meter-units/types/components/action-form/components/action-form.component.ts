import { SettingsStoreEmitterService } from '../../../../../../core/repository/services/settings-store/settings-store-emitter.service';
import { FiltersInfo } from '../../../../../../shared/forms/interfaces/filters-info.interface';
import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActionFormStaticTextService } from '../services/action-form-static-text.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { MeterUnitsTypeGridService } from '../../../services/meter-units-type-grid.service';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit, OnDestroy {
  meterUnitTypeid = 0;
  private paramsSub: Subscription;

  form: FormGroup;
  searchTextEmpty = true;
  sessionNameForGridState = 'grdStateMUT';

  columns$: Codelist<string>[] = [];

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();
  @Input() gridColumns = [];

  @ViewChild('modalFilter', { static: true }) input;

  @Output() toggleFilter: EventEmitter<void> = new EventEmitter<void>();
  @Input() filtersInfo: FiltersInfo;
  @Input() isFilterOpened = false;

  subscription: Subscription;

  private eventSettingsStoreLoadedSubscription: Subscription;

  @Output() toggleWildcards: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() useWildcards: boolean;

  constructor(
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private gridColumnShowHideService: GridColumnShowHideService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService
  ) {
    this.paramsSub = route.params.subscribe((params) => {
      this.meterUnitTypeid = params.id;
      /*    this.sessionNameForGridState = this.sessionNameForGridState.includes('grdStateMUT') ?  this.sessionNameForGridState : 'grdStateMUT';
      const search = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
      if (this.form) {
        this.form.get('content').setValue(search.searchText);
      }*/
    });

    // subscribe to changes of visibility of columns on grid
    this.subscription = gridColumnShowHideService.listOfColumnVisibilitySet$.subscribe((visibleColumnList) => {
      this.setColumnVisibilityForm(visibleColumnList);
    });
  }

  ngOnInit() {
    this.staticTextService.preventCloseDropDownWhenClickInsideMenu();
    this.setColumnsListForArrayOfCheckBox();

    const searchText = this.meterUnitsTypeGridService.getSessionSettingsSearchedText();
    this.form = this.createForm(searchText === '' ? null : searchText);

    this.eventSettingsStoreLoadedSubscription = this.settingsStoreEmitterService.eventEmitterSettingsLoaded.subscribe(() => {
      const searchTextUpdated = this.meterUnitsTypeGridService.getSessionSettingsSearchedText();
      this.form.get(this.searchProperty).setValue(searchTextUpdated === '' ? null : searchTextUpdated);
      const useWildcardsUpdated = this.meterUnitsTypeGridService.getSessionSettingsSearchedWildcards();
      this.useWildcards = useWildcardsUpdated;
    });
  }

  insertedValue($event: string) {
    if ($event !== null) {
      if ($event !== undefined) {
        this.searchTextEmpty = $event.length === 0;
      } else {
        this.searchTextEmpty = true;
      }
      this.searchChange.emit($event);
    }
  }

  doToggleWildcards($event: boolean) {
    if ($event !== null) {
      this.toggleWildcards.emit($event);
    }
  }

  get searchProperty() {
    return 'content';
  }
  createForm(search: string): FormGroup {
    return this.fb.group({
      ['content']: search,
      ['columns']: [[]],
      ['selectAll']: [false]
    });
  }

  onFilter() {}

  onRefresh() {
    this.refresh.emit();
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    this.staticTextService.removePopupBackdropIfClickOnMenu();
    this.subscription.unsubscribe();

    if (this.eventSettingsStoreLoadedSubscription) {
      this.eventSettingsStoreLoadedSubscription.unsubscribe();
    }
  }

  get columnsProperty() {
    return 'columns';
  }

  get selectAllProperty() {
    return 'selectAll';
  }

  /// set dropdown checkboxes of visible columns
  setColumnVisibilityForm(visibleColumnList: string[]) {
    const listCheckBoxColumns = this.columns$.map((a) => a.id);
    if (
      visibleColumnList.length === listCheckBoxColumns.length &&
      visibleColumnList.sort().every((value, index) => value === listCheckBoxColumns.sort()[index])
    ) {
      this.form.get(this.selectAllProperty).setValue(true);
    } else {
      this.form.get(this.selectAllProperty).setValue(false);
    }

    this.form.get(this.columnsProperty).setValue(visibleColumnList);
  }

  showHideAll() {
    // show all columns
    if (this.form.get(this.selectAllProperty).value) {
      this.gridColumnShowHideService.listOfColumnsVisibilityChanged(this.columns$.map((a) => a.id));
    } else {
      // hide all columns
      this.gridColumnShowHideService.listOfColumnsVisibilityChanged([]);
    }
  }

  showHideFromArrayOfCheckBoxes() {
    const listOfVisibleCols = this.form.get(this.columnsProperty).value;
    this.gridColumnShowHideService.listOfColumnsVisibilityChanged(listOfVisibleCols);
  }

  setColumnsListForArrayOfCheckBox() {
    if (this.gridColumns != null) {
      this.gridColumns
        .filter((x) => x.headerName !== undefined && x.headerName.length > 0)
        .forEach((element) => {
          this.columns$.push({ id: element.field, value: element.headerName });
        });
    }
  }

  doToggleFilter() {
    this.toggleFilter.emit();
  }
}

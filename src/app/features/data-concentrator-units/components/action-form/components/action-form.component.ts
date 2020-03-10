import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ActionFormStaticTextService } from '../services/action-form-static-text.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { FilterFormService } from '../services/filter-form.service';
import { Observable } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { nameOfFactory } from 'src/app/shared/utils/consts/nameOfFactory.const';
import { Columns } from '../interfaces/columns.interfaces';
import { DataConcentratorUnitsGridService } from '../../../services/data-concentrator-units-grid.service';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit, OnDestroy {
  nameOf = nameOfFactory<Columns>();
  form: FormGroup;
  searchTextEmpty = true;
  sessionNameForGridState = 'grdStateDCU';

  columns$: Codelist<string>[] = [];

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() columnsChange: EventEmitter<boolean> = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild('modalFilter', { static: true }) input;

  constructor(
    private i18n: I18n,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private service: FilterFormService
  ) {}

  ngOnInit() {
    this.dataConcentratorUnitsGridService.setGridDefaultColumns().forEach(element => {
      /*   this.columns$.push({
        id: element.dataField,
        value: element.caption
      });*/
    });

    this.staticTextService.preventCloseDropDownWhenClickInsideMenu();

    const search = this.gridSettingsSessionStoreService.getGridSearchText(this.sessionNameForGridState);
    this.form = this.createForm(search);
    this.insertedValue(search);
  }

  insertedValue($event: string) {
    if ($event !== undefined) {
      this.searchTextEmpty = $event.length === 0;
    } else {
      this.searchTextEmpty = true;
    }
    setTimeout(() => {
      this.searchChange.emit($event);
    }, 600);
  }

  get searchProperty() {
    return 'content';
  }
  createForm(search: string): FormGroup {
    return this.fb.group({
      ['content']: search,
      ['columns']: [[]]
    });
  }

  onFilter() {}

  onRefresh() {
    this.refresh.emit();
  }

  ngOnDestroy() {
    this.staticTextService.removePopupBackdropIfClickOnMenu();
  }

  get columnsProperty() {
    return this.nameOf('columns');
  }

  change() {
    console.log(this.form.get('columns').value);
  }
}

import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActionFormStaticTextService } from '../services/action-form-static-text.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  searchTextEmpty = true;
  sessionNameForGridState = 'grdStateDCU';

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() columnsChange: EventEmitter<boolean> = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild('modalFilter', { static: true }) input;

  constructor(
    private i18n: I18n,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService
  ) {}

  ngOnInit() {
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
      ['content']: search
    });
  }
  nameOf(arg0: string) {
    throw new Error('Method not implemented.');
  }

  onFilter() {}

  onColumns() {
    this.columnsChange.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }

  ngOnDestroy() {
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}

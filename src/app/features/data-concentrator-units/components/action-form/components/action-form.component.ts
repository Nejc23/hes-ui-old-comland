import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActionFormStaticTextService } from '../services/action-form-static-text.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { SaveViewFormComponent } from '../../save-view-form/save-view-form.component';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  searchTextEmpty = true;
  sessionNameForGridState = 'grdStateDCU';

  columns$: Codelist<string>[] = [];

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild('modalFilter', { static: true }) input;

  constructor(
    private i18n: I18n,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
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
    this.searchChange.emit($event);
  }

  get searchProperty() {
    return 'content';
  }
  createForm(search: string): FormGroup {
    return this.fb.group({
      ['content']: search
    });
  }

  onFilter() {}

  onRefresh() {
    this.refresh.emit();
  }

  ngOnDestroy() {
    this.staticTextService.removePopupBackdropIfClickOnMenu();
  }

  openSaveLayoutModal($event: any) {
    const modalRef = this.modalService.open(SaveViewFormComponent);
    modalRef.result.then().catch(() => {});
  }
}

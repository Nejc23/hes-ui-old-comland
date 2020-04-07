import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActionFormStaticTextService } from '../services/action-form-static-text.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { SaveViewFormMUTComponent } from '../../save-view-form/save-view-form-meter-units-type.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit, OnDestroy {
  meterUnitTypeid = 0;
  private paramsSub: Subscription;

  form: FormGroup;
  searchTextEmpty = true;
  sessionNameForGridState = 'grdStateMUT-typeId-';

  columns$: Codelist<string>[] = [];

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();

  @ViewChild('modalFilter', { static: true }) input;

  constructor(
    private i18n: I18n,
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) {
    this.paramsSub = route.params.subscribe(params => {
      this.meterUnitTypeid = params.id;
      /*    this.sessionNameForGridState = this.sessionNameForGridState.includes('grdStateMUT-typeId-' + this.meterUnitTypeid) ?  this.sessionNameForGridState : 'grdStateMUT-typeId-' + this.meterUnitTypeid;
      const search = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
      if (this.form) {
        this.form.get('content').setValue(search.searchText);
      }*/
    });
  }

  ngOnInit() {
    this.staticTextService.preventCloseDropDownWhenClickInsideMenu();

    const search = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    this.form = this.createForm(search.searchText);
    this.insertedValue(search.searchText);
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
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    this.staticTextService.removePopupBackdropIfClickOnMenu();
  }

  openSaveLayoutModal($event: any) {
    const modalRef = this.modalService.open(SaveViewFormMUTComponent);
    const component: SaveViewFormMUTComponent = modalRef.componentInstance;
    component.meterUnitsTypeId = this.meterUnitTypeid;
    modalRef.result.then().catch(() => {});
  }
}

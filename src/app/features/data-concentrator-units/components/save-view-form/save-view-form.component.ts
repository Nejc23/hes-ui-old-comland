import { Component, OnInit } from '@angular/core';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { filter } from 'rxjs/operators';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';

@Component({
  selector: 'app-save-view-form',
  templateUrl: './save-view-form.component.html'
})
export class SaveViewFormComponent implements OnInit {
  sessionNameForGridLayout = 'grdLayoutDCU';
  cookieNameForGridSettings = 'grdColDCU';
  form: FormGroup;
  dcuLayouts$: Observable<DcuLayout[]>;
  data: DcuLayout[];
  selectedRow = -1;
  dontSelectFilter = false;
  sessionLayout: DcuLayout;
  cookieSettings: any;

  constructor(
    private dcuService: DataConcentratorUnitsService,
    private formBuilder: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private formUtils: FormsUtilsService,
    private toast: ToastNotificationService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private eventService: DataConcentratorUnitsGridEventEmitterService
  ) {
    this.form = this.createForm(null, null);
  }

  ngOnInit() {
    this.dcuLayouts$ = this.dcuService.getDcuLayout();
    this.dcuLayouts$.subscribe(x => {
      this.data = x;
      this.sessionLayout = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridLayout) as DcuLayout;
      this.cookieSettings = this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
      // console.log(`sessionLayout GET = ${JSON.stringify(this.sessionLayout)}`);
      if (this.sessionLayout) {
        this.sessionLayout.gridLayout = this.cookieSettings;
        if (this.sessionLayout.id) {
          this.form = this.createForm(x, this.sessionLayout);
        } else {
          const currentLayout: DcuLayout = {
            id: -1,
            name: '',
            statusesFilter: this.sessionLayout.statusesFilter,
            typesFilter: this.sessionLayout.typesFilter,
            tagsFilter: this.sessionLayout.tagsFilter,
            vendorFilter: this.sessionLayout.vendorFilter,
            gridLayout: this.sessionLayout.gridLayout
          };
          x.push(currentLayout);
          this.form = this.createForm(x, currentLayout);
        }
      }
    });
  }

  createForm(layouts: DcuLayout[], selected: DcuLayout): FormGroup {
    return this.formBuilder.group({
      ['name']: [selected !== null ? selected.name : '']
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }

  save(asNew: boolean) {
    this.sessionLayout.id = asNew ? -1 : this.sessionLayout.id;
    this.sessionLayout.name = this.form.get(this.namePropety).value;
    this.sessionLayout.gridLayout = this.cookieSettings;
    if (this.sessionLayout.id && this.sessionLayout.id > 0) {
      this.dcuService.saveDcuLayout(this.sessionLayout.id, this.sessionLayout);
    } else {
      this.dcuService
        .createDcuLayout(this.sessionLayout)
        .toPromise()
        .then(x => {
          this.sessionLayout.id = x ? x.id : -1;
        });
    }
    this.eventService.layoutChange(this.sessionLayout);
    this.modal.close();
  }

  get namePropety() {
    return 'name';
  }

  showButtons(filterIdx: number) {
    this.selectedRow = filterIdx;
  }

  isButtonVisible(filterIdx): boolean {
    return filterIdx === this.selectedRow;
  }

  selectSavedLayoutClicked(filterIdx: number) {
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridLayout, this.data[filterIdx]);
    this.sessionLayout = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridLayout);
    if (this.sessionLayout) {
      this.sessionLayout.gridLayout = this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
    }
    this.form.get(this.namePropety).setValue(this.sessionLayout.name);
    this.eventService.layoutChange(this.sessionLayout);
    this.modal.close();
  }

  deleteSavedLayoutClicked(filterIdx: number) {
    this.dontSelectFilter = true;
    this.dcuService.deleteDcuLayout(this.data[filterIdx].id);
    this.data.splice(filterIdx, 1);
    this.dcuLayouts$ = of(this.data);
    console.log('Delete clicked!');
  }
}

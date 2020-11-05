import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { MeterUnitsTypeGridEventEmitterService } from '../../services/meter-units-type-grid-event-emitter.service';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

@Component({
  selector: 'app-save-view-form-meter-units-type',
  templateUrl: './save-view-form-meter-units-type.component.html'
})
export class SaveViewFormMUTComponent implements OnInit {
  @Input() meterUnitsTypeId: number;

  sessionNameForGridLayout = 'grdLayoutMUT-typeId-';
  cookieNameForGridSettings = 'grdColMUT-typeId-';
  form: FormGroup;
  mutLayouts$: Observable<MeterUnitsLayout[]>;
  data: MeterUnitsLayout[];
  selectedRow = -1;
  dontSelectFilter = false;
  sessionLayout: MeterUnitsLayout;
  cookieSettings: any;

  constructor(
    private mutService: MeterUnitsService,
    private formBuilder: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private modal: NgbActiveModal,
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private eventService: MeterUnitsTypeGridEventEmitterService
  ) {
    this.form = this.createForm(null, null);
  }

  ngOnInit() {
    this.sessionNameForGridLayout = this.sessionNameForGridLayout.includes('grdLayoutMUT-typeId-' + this.meterUnitsTypeId)
      ? this.sessionNameForGridLayout
      : 'grdLayoutMUT-typeId-' + this.meterUnitsTypeId;
    this.cookieNameForGridSettings = this.cookieNameForGridSettings.includes('grdColMUT-typeId-' + this.meterUnitsTypeId)
      ? this.cookieNameForGridSettings
      : 'grdColMUT-typeId-' + this.meterUnitsTypeId;
    this.mutLayouts$ = this.mutService.getMeterUnitsLayout(this.meterUnitsTypeId);
    this.mutLayouts$.subscribe(x => {
      this.data = x;
      this.sessionLayout = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridLayout) as MeterUnitsLayout;
      this.cookieSettings = this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
      // console.log(`sessionLayout GET = ${JSON.stringify(this.sessionLayout)}`);
      if (this.sessionLayout) {
        this.sessionLayout.gridLayout = this.cookieSettings;
        if (this.sessionLayout.id) {
          this.form = this.createForm(x, this.sessionLayout);
        } else {
          const currentLayout: MeterUnitsLayout = {
            id: -1,
            name: '',
            statusesFilter: this.sessionLayout.statusesFilter,
            tagsFilter: this.sessionLayout.tagsFilter,
            vendorsFilter: this.sessionLayout.vendorsFilter,
            firmwareFilter: this.sessionLayout.firmwareFilter,
            breakerStateFilter: this.sessionLayout.breakerStateFilter,
            ciiStateFilter: this.sessionLayout.ciiStateFilter,
            gridLayout: this.sessionLayout.gridLayout,
            showOptionFilter: this.sessionLayout.showOptionFilter,
            showMeterUnitsWithoutTemplateFilter: this.sessionLayout.showMeterUnitsWithoutTemplateFilter,
            showOnlyMeterUnitsWithMBusInfoFilter: this.sessionLayout.showOnlyMeterUnitsWithMBusInfoFilter,
            readStatusFilter: this.sessionLayout.readStatusFilter,
            showOnlyImageReadyForActivationFilter: this.sessionLayout.showOnlyImageReadyForActivationFilter
          };
          x.push(currentLayout);
          this.form = this.createForm(x, currentLayout);
        }
      }
    });
  }

  createForm(layouts: MeterUnitsLayout[], selected: MeterUnitsLayout): FormGroup {
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
      this.mutService.saveMeterUnitsLayout(this.meterUnitsTypeId, this.sessionLayout.id, this.sessionLayout);
    } else {
      this.mutService
        .createMeterUnitsLayout(this.meterUnitsTypeId, this.sessionLayout)
        .toPromise()
        .then(x => {
          this.sessionLayout.id = x ? x.id : -1;
        });
    }
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridLayout, this.sessionLayout);
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
    this.mutService.deleteMeterUnitsLayout(this.meterUnitsTypeId, this.data[filterIdx].id);
    this.data.splice(filterIdx, 1);
    this.mutLayouts$ = of(this.data);
  }
}

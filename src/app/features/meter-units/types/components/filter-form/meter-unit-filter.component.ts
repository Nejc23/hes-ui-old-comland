import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { ActivatedRoute } from '@angular/router';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { CodelistHelperService } from 'src/app/core/repository/services/codelists/codelist-helper.repository.service';
import { rangeFilterValidator } from 'src/app/shared/validators/range-filter-validator';

@Component({
  selector: 'app-meter-unit-filter',
  templateUrl: './meter-unit-filter.component.html'
})
export class MeterUnitFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter();
  sessionNameForGridFilter = 'grdLayoutMUT-typeId-';
  sessionNameForGridState = 'grdStateMUT-typeId-';

  form: FormGroup;

  meterUnitStatuses$: Observable<Codelist<number>[]>;
  meterUnitVendors$: Observable<Codelist<number>[]>;
  mutFilters$: Observable<MeterUnitsLayout[]>;
  data: MeterUnitsLayout[];
  meterUnitTags$: Observable<Codelist<number>[]>;
  disconnectorState$: Observable<Codelist<number>[]>;
  firmware$: Observable<Codelist<number>[]>;
  operatorsList$ = this.codelistHelperService.operationsList();

  currentStatuses: Codelist<number>[];
  currentTypes: Codelist<number>[];
  currentVendorId: number;
  currentTags: Codelist<number>[];
  selectedRow = -1;
  dontSelectFilter = false;

  sessionFilter: MeterUnitsLayout;
  paramsSub: Subscription;
  id = 0;

  @Output() toggleFilter = new EventEmitter();

  constructor(
    private codelistService: CodelistMeterUnitsRepositoryService,
    private mutService: MeterUnitsService,
    public fb: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    public gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private i18n: I18n,
    private route: ActivatedRoute,
    private codelistHelperService: CodelistHelperService
  ) {
    this.form = this.createForm(null, null);
    this.paramsSub = route.params.subscribe(params => {
      this.id = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT-typeId-' + params.id)
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT-typeId-' + params.id;

      this.sessionNameForGridState = this.sessionNameForGridState.includes('grdStateMUT-typeId-' + params.id)
        ? this.sessionNameForGridState
        : 'grdStateMUT-typeId-' + params.id;

      // this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT-typeId-' + this.id) ?  this.sessionNameForGridFilter : 'grdLayoutMUT-typeId-' + this.id ;
    });
  }

  // called on init
  ngOnInit(): void {
    this.mutFilters$ = of([]); // this.mutService.getMeterUnitsLayout(this.id); // TODO uncomment when implemented
    this.mutFilters$.subscribe(x => {
      this.data = x;
      this.fillformFromSession(this.data);
    });
    this.meterUnitVendors$ = this.codelistService.meterUnitVendorCodelist(this.id);
    this.meterUnitStatuses$ = this.codelistService.meterUnitStatusCodelist(this.id);
    this.meterUnitTags$ = of([]); // this.codelistService.meterUnitTagCodelist(this.id); // TODO uncomment when implemented
    this.disconnectorState$ = this.codelistService.meterUnitDisconnectorStateCodelist(this.id); // TODO uncomment when implemented
    this.firmware$ = this.codelistService.meterUnitFirmwareCodelist(this.id);
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  doFillData() {
    // change filter outside of grid ???
    this.fillformFromSession(this.data);
  }

  fillformFromSession(x: MeterUnitsLayout[]) {
    this.sessionFilter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
    if (this.sessionFilter) {
      if (this.sessionFilter.id) {
        this.form = this.createForm(x, this.sessionFilter);
      } else {
        const currentFilter: MeterUnitsLayout = {
          id: -1,
          name: '',
          statusesFilter: this.sessionFilter.statusesFilter,
          readStatusFilter: this.sessionFilter.readStatusFilter,
          tagsFilter: this.sessionFilter.tagsFilter,
          vendorFilter: this.sessionFilter.vendorFilter,
          firmwareFilter: this.sessionFilter.firmwareFilter,
          breakerStateFilter: this.sessionFilter.breakerStateFilter,
          showOnlyMeterUnitsWithMBusInfoFilter: this.sessionFilter.showOnlyMeterUnitsWithMBusInfoFilter,
          showDeletedMeterUnitsFilter: this.sessionFilter.showDeletedMeterUnitsFilter,
          showMeterUnitsWithoutTemplateFilter: this.sessionFilter.showMeterUnitsWithoutTemplateFilter,
          showOnlyImageReadyForActivationFilter: this.sessionFilter.showOnlyImageReadyForActivationFilter,
          gridLayout: ''
        };
        x.push(currentFilter);
        this.form = this.createForm(x, currentFilter);
      }
    } else {
      this.form = this.createForm(null, null);
    }
  }

  createForm(filters: MeterUnitsLayout[], selected: MeterUnitsLayout): FormGroup {
    return this.fb.group(
      {
        ['statuses']: [filters && selected ? selected.statusesFilter : []],
        ['tags']: [filters && selected ? selected.tagsFilter : []],
        ['filters']: [filters ? filters : []],
        ['vendor']: [filters && selected ? selected.vendorFilter : null],
        ['firmware']: [filters && selected ? selected.firmwareFilter : []],
        ['breakerState']: [filters && selected ? selected.breakerStateFilter : []],
        ['operation']: [
          filters && selected.readStatusFilter && selected.readStatusFilter.operation
            ? selected.readStatusFilter.operation
            : { id: '', value: '' }
        ],
        ['value1']: [filters && selected.readStatusFilter ? selected.readStatusFilter.value1 : 0],
        ['value2']: [filters && selected.readStatusFilter ? selected.readStatusFilter.value2 : 0],
        ['showDeletedMeterUnits']: [filters && selected ? selected.showDeletedMeterUnitsFilter : false],
        ['showOnlyMeterUnitsWithMBusInfo']: [filters && selected ? selected.showOnlyMeterUnitsWithMBusInfoFilter : false],
        ['showMeterUnitsWithoutTemplate']: [filters && selected ? selected.showMeterUnitsWithoutTemplateFilter : false],
        ['showOnlyImageReadyForActivation']: [filters && selected ? selected.showOnlyImageReadyForActivationFilter : false]
      },
      { validator: rangeFilterValidator }
    );
  }

  get statusesProperty() {
    return 'statuses';
  }

  get tagsProperty() {
    return 'tags';
  }

  get filtersProperty() {
    return 'filters';
  }

  get vendorProperty() {
    return 'vendor';
  }

  get operationProperty() {
    return 'operation';
  }

  get value1Property() {
    return 'value1';
  }

  get value2Property() {
    return 'value2';
  }

  get firmwareProperty() {
    return 'firmware';
  }

  get breakerStateProperty() {
    return 'breakerState';
  }

  get showDeletedMeterUnitsProperty() {
    return 'showDeletedMeterUnits';
  }

  get showMeterUnitsWithoutTemplateProperty() {
    return 'showMeterUnitsWithoutTemplate';
  }

  get showOnlyMeterUnitsWithMBusInfoProperty() {
    return 'showOnlyMeterUnitsWithMBusInfo';
  }

  get showOnlyImageReadyForActivationProperty() {
    return 'showOnlyImageReadyForActivation';
  }

  refresh() {}

  clearButtonClicked() {
    this.gridFilterSessionStoreService.clearGridLayout();

    // refresh form
    this.doFillData();

    // close tool-panel
    this.filterChange.emit();
  }

  applyButtonClicked() {
    if (!this.form.valid) {
      return;
    }

    const currentFilter: MeterUnitsLayout = {
      id: this.sessionFilter.id ? this.sessionFilter.id : 0,
      name: this.sessionFilter.name ? this.sessionFilter.name : '',
      statusesFilter: this.form.get(this.statusesProperty).value,
      readStatusFilter: {
        operation: { id: '', value: '' },
        value1: 0,
        value2: 0
      },
      /*   this.form.get(this.operationProperty).value !== undefined && this.form.get(this.operationProperty).value != null
          ? {
              operation: this.form.get(this.operationProperty).value,
              value1: this.form.get(this.value1Property).value,
              value2: this.form.get(this.operationProperty).value.id === 'In Range' ? this.form.get(this.value2Property).value : 0
            }
          : {
              operation: { id: '', value: '' },
              value1: 0,
              value2: 0
            },*/
      firmwareFilter: this.form.get(this.firmwareProperty).value,
      breakerStateFilter: this.form.get(this.breakerStateProperty).value,
      tagsFilter: this.form.get(this.tagsProperty).value,
      vendorFilter: this.form.get(this.vendorProperty).value,
      showOnlyMeterUnitsWithMBusInfoFilter: this.form.get(this.showOnlyMeterUnitsWithMBusInfoProperty).value,
      showDeletedMeterUnitsFilter: this.form.get(this.showDeletedMeterUnitsProperty).value,
      showMeterUnitsWithoutTemplateFilter: this.form.get(this.showMeterUnitsWithoutTemplateProperty).value,
      showOnlyImageReadyForActivationFilter: this.form.get(this.showOnlyImageReadyForActivationProperty).value,
      gridLayout: ''
    };
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, currentFilter);

    // close tool-panel
    // this.params.api.closeToolPanel();
    this.filterChange.emit();
  }

  errorValidatorReadStatusComponents() {
    if (this.form.errors != null && this.form.errors.outOfRange) {
      return this.i18n('Value must be in range 0-100');
    } else if (this.form.errors != null && this.form.errors.incorrectValueRange) {
      return this.i18n('Range is not correct');
    }
  }

  doToggleFilter() {
    this.toggleFilter.emit();
  }
}

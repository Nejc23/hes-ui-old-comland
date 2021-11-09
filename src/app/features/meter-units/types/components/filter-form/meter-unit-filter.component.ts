import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { ActivatedRoute } from '@angular/router';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { CodelistHelperService } from 'src/app/core/repository/services/codelists/codelist-helper.repository.service';
import { rangeFilterValidator } from 'src/app/shared/validators/range-filter-validator';
import * as _ from 'lodash';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meter-unit-filter',
  templateUrl: './meter-unit-filter.component.html'
})
export class MeterUnitFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter();
  sessionNameForGridFilter = 'grdLayoutMUT';
  sessionNameForGridState = 'grdStateMUT';

  form: FormGroup;

  meterUnitStatuses$: Observable<Codelist<number>[]>;
  meterUnitVendors$: Observable<Codelist<number>[]>;
  mutFilters$: Observable<MeterUnitsLayout[]>;
  data: MeterUnitsLayout[];
  meterUnitTags$: Observable<Codelist<number>[]>;
  disconnectorState$: Observable<Codelist<number>[]>;
  ciiState$: Observable<Codelist<number>[]>;
  firmware$: Observable<Codelist<number>[]>;
  operatorsList$ = this.codelistHelperService.operationsList();
  showOptionFilter$ = this.codelistHelperService.showOptionFilterList();

  deviceMediums$: Observable<Codelist<number>[]>;
  protocolTypes$: Observable<Codelist<number>[]>;

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

  private eventSettingsStoreLoadedSubscription: Subscription;

  constructor(
    private codelistService: CodelistMeterUnitsRepositoryService,
    private mutService: MeterUnitsService,
    public fb: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    public gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private route: ActivatedRoute,
    private codelistHelperService: CodelistHelperService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private translate: TranslateService
  ) {
    this.form = this.createForm(null, null);
    this.paramsSub = route.params.subscribe((params) => {
      this.id = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT')
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT';

      this.sessionNameForGridState = this.sessionNameForGridState.includes('grdStateMUT') ? this.sessionNameForGridState : 'grdStateMUT';

      // this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT') ?  this.sessionNameForGridFilter : 'grdLayoutMUT';
    });

    this.applyFilter = _.debounce(this.applyFilter, 1000);
  }

  get statesProperty() {
    return 'states';
  }

  get tagsProperty() {
    return 'tags';
  }

  get filtersProperty() {
    return 'filters';
  }

  get vendorsProperty() {
    return 'vendors';
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

  get ciiStateProperty() {
    return 'ciiState';
  }

  get showOptionFilterProperty() {
    return 'showOptionFilter';
  }

  get protocolProperty() {
    return 'protocol';
  }

  get mediumProperty() {
    return 'medium';
  }

  // called on init
  ngOnInit(): void {
    this.mutFilters$ = of([]); // this.mutService.getMeterUnitsLayout(this.id); // TODO uncomment when implemented
    this.mutFilters$.subscribe((x) => {
      this.data = x;
      this.fillformFromSession(this.data);
    });
    this.meterUnitVendors$ = this.codelistService.meterUnitVendorCodelist(this.id);
    this.meterUnitStatuses$ = this.codelistService.meterUnitStatusCodelist(this.id);
    this.meterUnitTags$ = of([]); // this.codelistService.meterUnitTagCodelist(this.id); // TODO uncomment when implemented
    this.disconnectorState$ = this.codelistService.meterUnitDisconnectorStateCodelist(this.id); // TODO uncomment when implemented
    this.ciiState$ = this.codelistService.meterUnitCiiStateCodelist(this.id);
    this.firmware$ = this.codelistService.meterUnitFirmwareCodelist(this.id);

    this.deviceMediums$ = this.codelistService.meterUnitDeviceMediumCodelist();
    this.protocolTypes$ = this.codelistService.meterUnitProtocolTypeCodelist();

    this.eventSettingsStoreLoadedSubscription = this.settingsStoreEmitterService.eventEmitterSettingsLoaded.subscribe(() => {
      this.doFillData();
    });
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    if (this.eventSettingsStoreLoadedSubscription) {
      this.eventSettingsStoreLoadedSubscription.unsubscribe();
    }
  }

  /*
  get showMeterUnitsWithoutTemplateProperty() {
    return 'showMeterUnitsWithoutTemplate';
  }

  get showOnlyMeterUnitsWithMBusInfoProperty() {
    return 'showOnlyMeterUnitsWithMBusInfo';
  }

  get showOnlyImageReadyForActivationProperty() {
    return 'showOnlyImageReadyForActivation';
  }*/

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
          statesFilter: this.sessionFilter.statesFilter,
          readStatusFilter: this.sessionFilter.readStatusFilter,
          tagsFilter: this.sessionFilter.tagsFilter,
          vendorsFilter: this.sessionFilter.vendorsFilter,
          firmwareFilter: this.sessionFilter.firmwareFilter,
          breakerStateFilter: this.sessionFilter.breakerStateFilter,
          ciiStateFilter: this.sessionFilter.ciiStateFilter,
          showOptionFilter: this.sessionFilter.showOptionFilter,
          showOnlyMeterUnitsWithMBusInfoFilter: this.sessionFilter.showOnlyMeterUnitsWithMBusInfoFilter,
          showMeterUnitsWithoutTemplateFilter: this.sessionFilter.showMeterUnitsWithoutTemplateFilter,
          showOnlyImageReadyForActivationFilter: this.sessionFilter.showOnlyImageReadyForActivationFilter,
          gridLayout: '',
          mediumFilter: this.sessionFilter.mediumFilter,
          protocolFilter: this.sessionFilter.protocolFilter
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
        ['states']: [filters && selected ? selected.statesFilter : []],
        ['tags']: [filters && selected ? selected.tagsFilter : []],
        ['filters']: [filters ? filters : []],
        ['vendors']: [filters && selected ? selected.vendorsFilter : null],
        ['firmware']: [filters && selected ? selected.firmwareFilter : []],
        ['breakerState']: [filters && selected ? selected.breakerStateFilter : []],
        ['ciiState']: [filters && selected ? selected.ciiStateFilter : []],
        ['operation']: [
          filters && selected.readStatusFilter && selected.readStatusFilter.operation
            ? selected.readStatusFilter.operation
            : { id: '', value: '' }
        ],
        ['value1']: [filters && selected.readStatusFilter ? selected.readStatusFilter.value1 : 0],
        ['value2']: [filters && selected.readStatusFilter ? selected.readStatusFilter.value2 : 0],
        /*['showOnlyMeterUnitsWithMBusInfo']: [filters && selected ? selected.showOnlyMeterUnitsWithMBusInfoFilter : false],
        ['showMeterUnitsWithoutTemplate']: [filters && selected ? selected.showMeterUnitsWithoutTemplateFilter : false],
        ['showOnlyImageReadyForActivation']: [filters && selected ? selected.showOnlyImageReadyForActivationFilter : false],*/
        ['showOptionFilter']: [filters && selected ? selected.showOptionFilter : []],
        [this.mediumProperty]: [filters && selected ? selected.mediumFilter : []],
        [this.protocolProperty]: [filters && selected ? selected.protocolFilter : []]
      },
      { validators: [rangeFilterValidator] }
    );
  }

  refresh() {}

  clearButtonClicked() {
    this.gridFilterSessionStoreService.clearGridLayout();

    // refresh form
    this.doFillData();

    // close tool-panel
    this.filterChange.emit();
  }

  applyFilter() {
    if (!this.form.valid) {
      return;
    }
    const currentFilter: MeterUnitsLayout = {
      id: this.sessionFilter.id ? this.sessionFilter.id : 0,
      name: this.sessionFilter.name ? this.sessionFilter.name : '',
      statesFilter: this.form.get(this.statesProperty).value,
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
      ciiStateFilter: this.form.get(this.ciiStateProperty).value,
      tagsFilter: this.form.get(this.tagsProperty).value,
      vendorsFilter: this.form.get(this.vendorsProperty).value,
      showOptionFilter: this.form.get(this.showOptionFilterProperty).value,
      showOnlyMeterUnitsWithMBusInfoFilter: null, // this.form.get(this.showOnlyMeterUnitsWithMBusInfoProperty).value,
      showMeterUnitsWithoutTemplateFilter:
        this.form.get(this.showOptionFilterProperty).value.filter((x) => x.id === 1).length > 0
          ? false
          : this.form.get(this.showOptionFilterProperty).value.filter((x) => x.id === 2).length > 0
          ? true
          : null,
      // this.form.get(this.showMeterUnitsWithoutTemplateProperty).value,
      showOnlyImageReadyForActivationFilter:
        this.form.get(this.showOptionFilterProperty).value.filter((x) => x.id === 3).length > 0 ? true : false,
      // this.form.get(this.showOnlyImageReadyForActivationProperty).value,
      gridLayout: '',
      mediumFilter: this.form.get(this.mediumProperty).value,
      protocolFilter: this.form.get(this.protocolProperty).value
    };

    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, currentFilter);

    // close tool-panel
    // this.params.api.closeToolPanel();
    this.filterChange.emit();
  }

  errorValidatorReadStatusComponents() {
    if (this.form.errors != null && this.form.errors.outOfRange) {
      return this.translate.instant('COMMON.0-100-RANGE');
    } else if (this.form.errors != null && this.form.errors.incorrectValueRange) {
      return this.translate.instant('COMMON.INCORRECT-RANGE');
    }
  }

  doToggleFilter() {
    this.toggleFilter.emit();
  }

  getFilterTitle(): string {
    return this.translate.instant('FILTER.FILTERS');
  }
}

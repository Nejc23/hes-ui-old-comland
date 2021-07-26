import { SettingsStoreEmitterService } from './../../../../core/repository/services/settings-store/settings-store-emitter.service';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { CodelistHelperService } from 'src/app/core/repository/services/codelists/codelist-helper.repository.service';
import { rangeFilterValidator } from 'src/app/shared/validators/range-filter-validator';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dc-filter',
  templateUrl: './dc-filter.component.html'
})
export class DcFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter();

  sessionNameForGridFilter = 'grdLayoutDCU';
  sessionNameForGridState = 'grdStateDCU';
  form: FormGroup;

  dcuStatuses$: Observable<Codelist<number>[]>;
  dcuStatuses: Codelist<number>[] = [];
  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  dcuFilters$: Observable<DcuLayout[]>;
  data: DcuLayout[];
  dcuTags$: Observable<Codelist<number>[]>;
  dcuTags: Codelist<number>[];
  operatorsList$ = this.codelistHelperService.operationsList();

  currentStatuses: Codelist<number>[];
  currentTypes: Codelist<number>[];
  currentVendorId: number;
  currentTags: Codelist<number>[];
  selectedRow = -1;
  dontSelectFilter = false;

  sessionFilter: DcuLayout;

  @Output() toggleFilter = new EventEmitter();

  private eventSettingsStoreLoadedSubscription: Subscription;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    public fb: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    public gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private codelistHelperService: CodelistHelperService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private translate: TranslateService
  ) {
    this.form = this.createForm(null, null);
    this.applyFilter = _.debounce(this.applyFilter, 1000);
  }

  // called on init
  ngOnInit(): void {
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();
    this.dcuFilters$ = of([]); // this.dcuService.getDcuLayout();  // TODO uncomment when implemented
    this.dcuFilters$.subscribe((x) => {
      this.data = x;
      this.fillformFromSession(this.data);
    });

    this.dcuStatuses$ = this.codelistService.dcuStatusCodelist();
    this.dcuStatuses$.subscribe((y) => (this.dcuStatuses = y));

    this.dcuTags$ = of([]); // this.codelistService.dcuTagCodelist(); // TODO uncomment when implemented
    this.dcuTags$.subscribe((y) => (this.dcuTags = y));

    // this.params.api.addEventListener('modelUpdated', this.doFillData.bind(this));

    this.eventSettingsStoreLoadedSubscription = this.settingsStoreEmitterService.eventEmitterSettingsLoaded.subscribe(() => {
      this.doFillData();
    });
  }

  doFillData() {
    // todo change filter outside of grid ???
    this.fillformFromSession(this.data);
  }

  fillformFromSession(x: DcuLayout[]) {
    this.sessionFilter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
    if (this.sessionFilter && typeof x !== 'undefined') {
      if (this.sessionFilter.id) {
        this.form = this.createForm(x, this.sessionFilter);
      } else {
        const currentFilter: DcuLayout = {
          id: -1,
          name: '',
          statusesFilter: this.sessionFilter.statusesFilter,
          readStatusFilter: this.sessionFilter.readStatusFilter,
          typesFilter: this.sessionFilter.typesFilter,
          tagsFilter: this.sessionFilter.tagsFilter,
          vendorsFilter: this.sessionFilter.vendorsFilter,
          gridLayout: ''
        };
        x.push(currentFilter);
        this.form = this.createForm(x, currentFilter);
      }
    } else {
      this.form = this.createForm(null, null);
    }
  }

  createForm(filters: DcuLayout[], selected: DcuLayout): FormGroup {
    return this.fb.group(
      {
        ['statuses']: [filters && selected ? selected.statusesFilter : []],
        ['tags']: [filters && selected ? selected.tagsFilter : []],
        ['types']: [filters && selected ? selected.typesFilter : []],
        ['filters']: [filters ? filters : []],
        ['vendors']: [filters && selected ? selected.vendorsFilter : []],
        ['operation']: [
          filters && selected.readStatusFilter && selected.readStatusFilter.operation
            ? selected.readStatusFilter.operation
            : { id: '', value: '' }
        ],
        ['value1']: [filters && selected.readStatusFilter ? selected.readStatusFilter.value1 : 0],
        ['value2']: [filters && selected.readStatusFilter ? selected.readStatusFilter.value2 : 0]
      },
      { validators: [rangeFilterValidator] }
    );
  }

  get statusesProperty() {
    return 'statuses';
  }

  get tagsProperty() {
    return 'tags';
  }

  get typesProperty() {
    return 'types';
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

  refresh() {}

  clearButtonClicked() {
    this.gridFilterSessionStoreService.clearGridLayout();

    // reset form;
    this.doFillData();

    // close tool-panel
    // this.params.api.closeToolPanel();
    this.filterChange.emit();
  }

  applyFilter() {
    if (!this.form.valid) {
      return;
    }

    const currentFilter: DcuLayout = {
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
      typesFilter: this.form.get(this.typesProperty).value,
      tagsFilter: this.form.get(this.tagsProperty).value,
      vendorsFilter: this.form.get(this.vendorsProperty).value,
      gridLayout: ''
    };
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, currentFilter);

    this.filterChange.emit();
    // close tool-panel
    // this.params.api.closeToolPanel();
  }

  errorValidatorReadStatusComponents() {
    if (this.form.errors != null && this.form.errors.outOfRange) {
      return this.translate.instant('FORM.ERROR.RANGE-VALUE');
    } else if (this.form.errors != null && this.form.errors.incorrectValueRange) {
      return this.translate.instant('FORM.ERROR.RANGE-INCORRECT');
    }
  }

  doToggleFilter() {
    this.toggleFilter.emit();
  }

  ngOnDestroy() {
    if (this.eventSettingsStoreLoadedSubscription) {
      this.eventSettingsStoreLoadedSubscription.unsubscribe();
    }
  }
}

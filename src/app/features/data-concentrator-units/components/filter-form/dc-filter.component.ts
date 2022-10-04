import { SettingsStoreEmitterService } from './../../../../core/repository/services/settings-store/settings-store-emitter.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import * as moment from 'moment';
import { dateServerFormat } from '../../../../shared/forms/consts/date-format';
import { EventManagerService } from '../../../../core/services/event-manager.service';

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

  slaOperations: Codelist<number>[] = [
    { id: 3, value: this.translate.instant('COMMON.GRATER-THAN') },
    { id: 5, value: this.translate.instant('COMMON.LESS-THAN') }
  ];

  lastCommunicationOptions: Codelist<number>[] = [
    { id: 5, value: this.translate.instant('FORM.OLDER-THAN') }, // less than x days
    { id: 3, value: this.translate.instant('FORM.NEWER-THAN') } // grater than x days
  ];
  lastCommunicationFormattedDateValue = '';

  sessionFilter: DcuLayout;

  @Output() toggleFilter = new EventEmitter();

  private eventSettingsStoreLoadedSubscription: Subscription;
  private clearFilterSubscription: Subscription;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    public fb: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    public gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private codelistHelperService: CodelistHelperService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private translate: TranslateService,
    private eventsService: EventManagerService
  ) {
    this.form = this.createForm(null, null);
    this.applyFilter = _.debounce(this.applyFilter, 1000);
  }

  get statesProperty() {
    return 'states';
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

  get slaOperation() {
    return 'slaOperation';
  }

  get lastCommunicationValue() {
    return 'lastCommunicationValue';
  }

  get lastCommunicationOption() {
    return 'lastCommunicationOption';
  }

  get slaValue() {
    return 'slaValue';
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
    // this.dcuStatuses$.subscribe((y) => (this.dcuStatuses = y));
    //
    // this.dcuTags$ = of([]); // this.codelistService.dcuTagCodelist(); // TODO uncomment when implemented
    // this.dcuTags$.subscribe((y) => (this.dcuTags = y));

    // this.params.api.addEventListener('modelUpdated', this.doFillData.bind(this));

    this.eventSettingsStoreLoadedSubscription = this.settingsStoreEmitterService.eventEmitterSettingsLoaded.subscribe(() => {
      this.doFillData();
    });

    this.clearFilterSubscription = this.eventsService.getCustom('ClearDcFilter').subscribe((res) => {
      this.clearButtonClicked();
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
          statesFilter: this.sessionFilter.statesFilter,
          readStatusFilter: this.sessionFilter.readStatusFilter,
          typesFilter: this.sessionFilter.typesFilter,
          tagsFilter: this.sessionFilter.tagsFilter,
          vendorsFilter: this.sessionFilter.vendorsFilter,
          gridLayout: '',
          slaFilter: this.sessionFilter.slaFilter,
          lastCommunicationFilter: this.sessionFilter.lastCommunicationFilter
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
        ['states']: [filters && selected ? selected.statesFilter : []],
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
        ['value2']: [filters && selected.readStatusFilter ? selected.readStatusFilter.value2 : 0],
        [this.slaOperation]: [filters && selected ? this.slaOperations.find((item) => item.id === selected.slaFilter?.id) : null],
        [this.slaValue]: [filters && selected ? selected.slaFilter?.value : 1],
        [this.lastCommunicationOption]: [
          filters && selected ? this.lastCommunicationOptions.find((item) => item.id === selected.lastCommunicationFilter?.id) : null
        ],
        [this.lastCommunicationValue]: [filters && selected ? selected.lastCommunicationFilter?.value : 1]
      },
      { validators: [rangeFilterValidator] }
    );
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

  applyFilter(slaFilter = false, lastCommunication = false) {
    if (slaFilter && !this.form?.controls?.slaValue?.value) {
      return;
    }
    if (lastCommunication && !this.form?.controls?.lastCommunicationValue?.value) {
      return;
    } else {
      this.lastCommunicationFormattedDateValue = moment()
        .set('minute', 0)
        .set('hours', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .subtract(this.form?.controls?.lastCommunicationValue?.value, 'days')
        .format(dateServerFormat);
    }
    if (!this.form.valid) {
      return;
    }

    const currentFilter: DcuLayout = {
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
      typesFilter: this.form.get(this.typesProperty).value,
      tagsFilter: this.form.get(this.tagsProperty).value,
      vendorsFilter: this.form.get(this.vendorsProperty).value,
      gridLayout: '',
      slaFilter:
        this.form?.controls?.slaOperation?.value?.id && this.form?.controls?.slaValue?.value
          ? {
              id: this.form.controls.slaOperation.value.id,
              value: this.form.controls.slaValue.value
            }
          : null,
      lastCommunicationFilter:
        this.form?.controls?.lastCommunicationOption?.value?.id && this.form?.controls?.lastCommunicationValue?.value
          ? {
              id: this.form.controls.lastCommunicationOption.value.id,
              value: this.form?.controls?.lastCommunicationValue?.value,
              date: this.lastCommunicationFormattedDateValue
            }
          : null
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

  ngOnDestroy() {
    if (this.eventSettingsStoreLoadedSubscription) {
      this.eventSettingsStoreLoadedSubscription.unsubscribe();
    }
    if (this.clearFilterSubscription) {
      this.clearFilterSubscription.unsubscribe();
    }
  }
}

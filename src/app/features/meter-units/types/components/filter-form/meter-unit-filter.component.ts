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
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { TranslateService } from '@ngx-translate/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { EventManagerService } from '../../../../../core/services/event-manager.service';
import readXlsxFile from 'read-excel-file';
import { environment } from '../../../../../../environments/environment';

interface MetersIdsFilterData {
  ids: number[];
  field: string;
}

@Component({
  selector: 'app-meter-unit-filter',
  templateUrl: './meter-unit-filter.component.html'
})
export class MeterUnitFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter();
  sessionNameForGridFilter = 'grdLayoutMUT';
  sessionNameForGridState = 'grdStateMUT';

  @Output() outputFormEvent = new EventEmitter<any>();

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

  slaOperations: Codelist<number>[] = [
    { id: 3, value: this.translate.instant('COMMON.GRATER-THAN') },
    { id: 5, value: this.translate.instant('COMMON.LESS-THAN') }
  ];

  deviceMediums$: Observable<Codelist<number>[]>;
  protocolTypes: Codelist<number>[];

  currentStatuses: Codelist<number>[];
  currentTypes: Codelist<number>[];
  currentTags: Codelist<number>[];

  sessionFilter: MeterUnitsLayout;
  paramsSub: Subscription;
  id = 0;

  @Output() toggleFilter = new EventEmitter();

  // hardcoded dropdown for import file field
  filterFromFiles: Codelist<string>[] = [
    { id: 'serialNumber', value: this.translate.instant('FORM.SERIAL-NUMBER') },
    { id: 'logicalDeviceName', value: this.translate.instant('GRID.LOGICAL-DEVICE-NAME') },
    { id: 'externalId', value: this.translate.instant('FORM.EXTERNAL-ID') }
  ];

  // todo
  allowedExt = ['csv', 'xlsx'];
  acceptExtensions = ['.csv', '.xlsx'];
  uploadedData = '';
  meterIds: Array<number> = [];
  fileValid = false;
  showImportError = false;
  clearFile = false;

  meterIdsFilterEvent: MetersIdsFilterData;
  maxImportNumber = environment.importIdsMaxLength;
  uploadDropSubtitle = this.translate.instant('COMMON.IMPORT-SUBTITLE-CSV-XLSX');
  maximumImportErrorText = '';

  public files: Array<any> = [];

  private eventSettingsStoreLoadedSubscription: Subscription;
  private clearFilterSubscription: Subscription;

  constructor(
    private codelistService: CodelistMeterUnitsRepositoryService,
    private mutService: MeterUnitsService,
    public fb: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    public gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private route: ActivatedRoute,
    private codelistHelperService: CodelistHelperService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private translate: TranslateService,
    private ngxCsvParser: NgxCsvParser,
    private eventsService: EventManagerService
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

    // this.applyFilter = _.debounce(this.applyFilter, 1000);
    this.clearFilterSubscription = this.eventsService.getCustom('ClearFilter').subscribe((res) => {
      this.clearButtonClicked();
    });
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

  get importDevicesField() {
    return 'importDevicesField';
  }

  get fileProperty() {
    return 'fileSelect';
  }

  get slaOperation() {
    return 'slaOperation';
  }

  get slaValue() {
    return 'slaValue';
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
    this.codelistService.meterUnitProtocolTypeCodelist().subscribe((res) => {
      this.protocolTypes = res;
      this.protocolTypes.map((protocol) => (protocol.value = this.translate.instant('PROTOCOL.' + protocol.value)));
    });

    this.eventSettingsStoreLoadedSubscription = this.settingsStoreEmitterService.eventEmitterSettingsLoaded.subscribe(() => {
      this.doFillData();
    });
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

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    if (this.eventSettingsStoreLoadedSubscription) {
      this.eventSettingsStoreLoadedSubscription.unsubscribe();
    }

    if (this.clearFilterSubscription) {
      this.clearFilterSubscription.unsubscribe();
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
          protocolFilter: this.sessionFilter.protocolFilter,
          slaFilter: this.sessionFilter.slaFilter
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
        [this.protocolProperty]: [filters && selected ? selected.protocolFilter : []],
        [this.importDevicesField]: [this.filterFromFiles[0]],
        [this.fileProperty]: null,
        [this.slaOperation]: [filters && selected ? this.slaOperations.find((item) => item.id === selected.slaFilter?.id) : null],
        [this.slaValue]: [filters && selected ? selected.slaFilter?.value : 1]
      },
      { validators: [rangeFilterValidator] }
    );
  }

  refresh() {}

  clearButtonClicked() {
    this.gridFilterSessionStoreService.clearGridLayout();

    this.form.get(this.importDevicesField).setValue(this.filterFromFiles[0]);
    this.form.get(this.fileProperty).setValue(null);
    this.form.get(this.slaValue).setValue(null);
    this.eventsService.emitCustom('ClearMeterIdsFilter', this.meterIdsFilterEvent);
    this.clearFile = true;
    this.meterIds = [];
    this.fileValid = false;
    // refresh form
    this.doFillData();
    // close tool-panel
    this.filterChange.emit();
  }

  applyFilter(slaFilter = false) {
    if (slaFilter && !this.form?.controls?.slaOperation?.value) {
      return;
    }
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
      showMeterUnitsWithoutTemplateFilter: this.form.get(this.showOptionFilterProperty).value
        ? this.form.get(this.showOptionFilterProperty).value.filter((x) => x.id === 1).length > 0
          ? false
          : this.form.get(this.showOptionFilterProperty).value.filter((x) => x.id === 2).length > 0
          ? true
          : null
        : false,
      // this.form.get(this.showMeterUnitsWithoutTemplateProperty).value,
      showOnlyImageReadyForActivationFilter: this.form.get(this.showOptionFilterProperty).value
        ? this.form.get(this.showOptionFilterProperty).value.filter((x) => x.id === 3).length > 0
        : false,
      // this.form.get(this.showOnlyImageReadyForActivationProperty).value,
      gridLayout: '',
      mediumFilter: this.form.get(this.mediumProperty).value,
      protocolFilter: this.form.get(this.protocolProperty).value,
      slaFilter:
        this.form?.controls?.slaOperation?.value?.id && this.form?.controls?.slaValue?.value
          ? {
              id: this.form.controls.slaOperation.value.id,
              value: this.form.controls.slaValue.value
            }
          : null
    };
    this.outputFormEvent.emit(currentFilter);
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, currentFilter);

    // close tool-panel
    // this.params.api.closeToolPanel();
    this.filterChange.emit();
  }

  selected(event: any) {
    event.files.forEach((file: FileInfo) => {
      if (file.rawFile) {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.uploadedData = reader.result as string;

          if (file.extension === '.csv') {
            this.ngxCsvParser
              .parse(file.rawFile, { header: false, delimiter: ',' })
              .pipe()
              .subscribe(
                (result: Array<any>) => {
                  this.parseFile(result);
                },
                (error: NgxCSVParserError) => {
                  console.log('csv error:');
                  console.log(error);
                  this.fileValid = false;
                }
              );
            // xlsx
          } else {
            readXlsxFile(file.rawFile).then(
              (rows) => {
                this.parseFile(rows);
              },
              () => {
                console.log('xlsx error');
                this.fileValid = false;
              }
            );
          }
        };
        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  removed(event: any) {
    this.uploadedData = '';
    this.fileValid = false;
  }

  applyMeterIdsToGrid() {
    if (this.fileValid) {
      this.eventsService.emitCustom('ApplyMeterIdsFilter', this.meterIdsFilterEvent);
    }
  }

  parseFile(ids) {
    const importDevicesField = this.form.get(this.importDevicesField).value;
    this.clearFilters();
    this.form.get(this.importDevicesField).setValue(importDevicesField);
    this.showImportError = false;
    this.fileValid = false;
    this.meterIds = ids;
    if (this.meterIds.length > environment.importIdsMaxLength) {
      this.maximumImportErrorText = this.translate.instant('PLC-METER.MAXIMUM-IMPORT-ERROR', {
        value1: this.meterIds.length,
        value2: this.maxImportNumber
      });
      this.showImportError = true;
    } else {
      this.fileValid = true;
      this.meterIdsFilterEvent = {
        ids: this.meterIds,
        field: this.form.get(this.importDevicesField).value.id
      };
    }
    if (this.form.get(this.importDevicesField).value.id) {
      this.eventsService.emitCustom('ApplyMeterIdsFilter', this.meterIdsFilterEvent);
    }
  }

  fieldChanged(event: any) {
    this.meterIdsFilterEvent = {
      ids: this.meterIds,
      field: this.form.get(this.importDevicesField).value.id
    };
    this.applyMeterIdsToGrid();
  }

  clearFilters() {
    this.gridFilterSessionStoreService.clearGridLayout();
    this.doFillData();
  }
}

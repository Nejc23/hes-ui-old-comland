import { Component, EventEmitter, Output } from '@angular/core';
import { IToolPanel, IToolPanelParams } from '@ag-grid-community/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';

@Component({
  selector: 'app-grid-custom-filter',
  templateUrl: './grid-custom-filter.component.html'
})
export class GridCustomFilterComponent implements IToolPanel {
  private params: IToolPanelParams;

  sessionNameForGridFilter = 'grdLayoutDCU';
  form: FormGroup;

  dcuStatuses$: Observable<Codelist<number>[]>;
  dcuStatuses: Codelist<number>[] = [];
  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  dcuFilters$: Observable<DcuLayout[]>;
  data: DcuLayout[];
  dcuTags$: Observable<Codelist<number>[]>;
  dcuTags: Codelist<number>[];

  currentStatuses: Codelist<number>[];
  currentTypes: Codelist<number>[];
  currentVendorId: number;
  currentTags: Codelist<number>[];
  selectedRow = -1;
  dontSelectFilter = false;

  sessionFilter: DcuLayout;

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    public fb: FormBuilder,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private i18n: I18n
  ) {
    this.form = this.createForm(null, null);
  }

  // called on init
  agInit(params: IToolPanelParams): void {
    this.params = params;

    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();
    this.dcuFilters$ = this.dcuService.getDcuLayout();
    this.dcuFilters$.subscribe(x => {
      this.data = x;
      this.sessionFilter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
      // console.log(`sessionFilter GET = ${JSON.stringify(this.sessionFilter)}`);
      if (this.sessionFilter) {
        if (this.sessionFilter.id) {
          this.form = this.createForm(x, this.sessionFilter);
        } else {
          const currentFilter: DcuLayout = {
            id: -1,
            name: 'Unknown',
            statusesFilter: this.sessionFilter.statusesFilter,
            typesFilter: this.sessionFilter.typesFilter,
            tagsFilter: this.sessionFilter.tagsFilter,
            vendorFilter: this.sessionFilter.vendorFilter,
            gridLayout: ''
          };
          x.push(currentFilter);
          this.form = this.createForm(x, currentFilter);
        }
      }
    });

    this.dcuStatuses$ = this.codelistService.dcuStatusCodelist();
    this.dcuStatuses$.subscribe(y => (this.dcuStatuses = y));

    this.dcuTags$ = this.codelistService.dcuTagCodelist();
    this.dcuTags$.subscribe(y => (this.dcuTags = y));

    this.params.api.addEventListener('modelUpdated', this.doFillData.bind(this));
  }

  doFillData() {
    // todo change filter outside of grid ???
    console.log('model changed');
  }

  createForm(filters: DcuLayout[], selected: DcuLayout): FormGroup {
    return this.fb.group({
      ['statuses']: [filters && selected ? selected.statusesFilter : []],
      ['tags']: [filters && selected ? selected.tagsFilter : []],
      ['types']: [filters && selected ? selected.typesFilter : []],
      ['filters']: [filters ? filters : []],
      ['vendor']: [filters && selected ? selected.vendorFilter : null]
    });
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

  get vendorProperty() {
    return 'vendor';
  }

  refresh() {}

  clearButtonClicked() {
    this.sessionFilter = null;
    this.form = this.createForm(null, null);
  }

  applyButtonClicked() {
    const currentFilter: DcuLayout = {
      id: this.sessionFilter.id,
      name: this.sessionFilter.name,
      statusesFilter: this.form.get(this.statusesProperty).value,
      typesFilter: this.form.get(this.typesProperty).value,
      tagsFilter: this.form.get(this.tagsProperty).value,
      vendorFilter: this.form.get(this.vendorProperty).value,
      gridLayout: ''
    };
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, currentFilter);

    // close tool-panel
    this.params.api.closeToolPanel();
  }
}

import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Observable, of } from 'rxjs';
import { DcuLayout } from '../../../../../core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import * as _ from 'lodash';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html'
})
export class FilterFormComponent implements OnInit, OnDestroy {
  sessionNameForGridFilter = 'grdFilterDCU';
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

  ngOnInit() {
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
            gridLayout: this.sessionFilter.gridLayout
          };
          x.push(currentFilter);
          this.form = this.createForm(x, currentFilter);
        }
      }
    });

    // this.dcuFilters$.toPromise().then((x: any) => {
    //   console.log(`sessionFilter SET = ${JSON.stringify(x)}`)
    //     this.gridFilterSessionStoreService.setGridFilter(this.sessionNameForGridFilter, x);
    // });

    this.dcuStatuses$ = this.codelistService.dcuStatusCodelist();
    this.dcuStatuses$.subscribe(y => (this.dcuStatuses = y));

    this.dcuTags$ = this.codelistService.dcuTagCodelist();
    this.dcuTags$.subscribe(y => (this.dcuTags = y));
  }

  ngOnDestroy(): void {
    //
  }

  createForm(filters: DcuLayout[], selected: DcuLayout): FormGroup {
    // console.log('createForm()');
    // const selectedValue = _.find(filters, x => x.id === selected);
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

  clearButtonClicked() {
    this.sessionFilter = null;
    this.form = this.createForm(null, null);
  }

  saveButtonClicked() {
    this.applyButtonClicked();
    this.sessionFilter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter);
    if (this.sessionFilter.id) {
      this.dcuService.saveDcuLayout(this.sessionFilter.id, this.sessionFilter);
    } else {
      this.dcuService
        .createDcuLayout(this.sessionFilter)
        .toPromise()
        .then(x => {
          this.sessionFilter.id = x ? x.id : -1;
          this.sessionFilter.name = this.i18n('NEW FILTER');
          this.applyButtonClicked();
        });
    }
    console.log(`save() - sessionFilter 3 = ${JSON.stringify(this.sessionFilter)}`);
  }

  change() {
    console.log(this.form.get('types').value);
  }

  applyButtonClicked() {
    const currentFilter: DcuLayout = {
      id: this.sessionFilter.id,
      name: this.sessionFilter.name,
      statusesFilter: this.form.get(this.statusesProperty).value,
      typesFilter: this.form.get(this.typesProperty).value,
      tagsFilter: this.form.get(this.tagsProperty).value,
      vendorFilter: this.form.get(this.vendorProperty).value,
      gridLayout: null
    };
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, currentFilter);
  }

  savedFilterClicked(filterIdx: number) {
    if (!this.dontSelectFilter) {
      this.form = this.createForm(this.data, this.data[filterIdx]);
      // this.gridFilterSessionStoreService.setGridFilter(this.sessionNameForGridFilter, this.data[filterIdx]);
      console.log(`selectSavedFilter id = ${this.data[filterIdx].id}, JSON = ${JSON.stringify(this.data[filterIdx])}`);
    }
    this.dontSelectFilter = false;
  }

  showButtons(filterIdx: number) {
    this.selectedRow = filterIdx;
  }

  isButtonVisible(filterIdx): boolean {
    return filterIdx === this.selectedRow;
  }

  selectSavedFilterClicked(filterIdx: number) {
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, this.data[filterIdx]);
    this.sessionFilter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter);
  }

  deleteSavedFilterClicked(filterIdx: number) {
    this.dontSelectFilter = true;
    this.dcuService.deleteDcuLayout(this.data[filterIdx].id);
    this.data.splice(filterIdx, 1);
    this.dcuFilters$ = of(this.data);
    console.log('Delete clicked!');
  }
}

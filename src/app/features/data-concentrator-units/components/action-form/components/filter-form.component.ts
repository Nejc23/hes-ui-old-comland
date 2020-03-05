import { OnInit, Component, OnDestroy } from '@angular/core';
import { FilterFormService } from '../services/filter-form.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Observable } from 'rxjs';
import { DcuFilter } from '../../../../../core/repository/interfaces/data-concentrator-units/dcu-filter.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { GridFilterSessionStoreService } from 'src/app/core/utils/services/grid-filter-session-store.service';
import { DcuFiltersInterceptor } from 'src/debug/interceptors/data-concentrator-units/dcu-filters.interceptor';

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
  dcuFilters$: Observable<DcuFilter[]>;
  dcuTags$: Observable<Codelist<number>[]>;
  dcuTags: Codelist<number>[];

  currentStatuses: Codelist<number>[];
  currentTypes: Codelist<number>[];
  currentVendorId: number;
  currentTags: Codelist<number>[];

  constructor(
    private codelistService: CodelistRepositoryService,
    private dcuService: DataConcentratorUnitsService,
    public fb: FormBuilder,
    private gridFilterSessionStoreService: GridFilterSessionStoreService
  ) {
    this.form = this.createForm(null, 0);
  }

  ngOnInit() {
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();
    this.dcuFilters$ = this.dcuService.getDcuFilter();
    this.dcuFilters$.subscribe(x => {
      // TODO: read selected filter from local storage
      const sessionFilter = this.gridFilterSessionStoreService.getGridFilter(this.sessionNameForGridFilter);
      if (sessionFilter) {
        x.push(sessionFilter);
        const count = x.length;
        console.log(`sessionFilter GET = ${JSON.stringify(sessionFilter)}`);
        this.form = this.createForm(x, count - 1);
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
    const currentFilter: DcuFilter = {
      id: null,
      name: null,
      statuses: this.form.get(this.statusesProperty).value,
      types: this.form.get(this.typesProperty).value,
      tags: this.form.get(this.tagsProperty).value,
      vendor: this.form.get(this.vendorProperty).value
    };
    console.log(`currentFilter SET = ${JSON.stringify(currentFilter)}`);
    this.gridFilterSessionStoreService.setGridFilter(this.sessionNameForGridFilter, currentFilter);
  }

  createForm(filters: DcuFilter[], selected: number): FormGroup {
    console.log('createForm()');
    const values = filters && filters[selected];
    return this.fb.group({
      ['statuses']: [values ? filters[selected].statuses : []],
      ['tags']: [values ? filters[selected].tags : []],
      ['types']: [values ? filters[selected].types : []],
      ['filters']: [filters ? filters : []],
      ['vendor']: [values ? filters[selected].vendor : null]
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

  save() {
    console.log(this.form.value);
  }

  change() {
    console.log(this.form.get('types').value);
  }
}

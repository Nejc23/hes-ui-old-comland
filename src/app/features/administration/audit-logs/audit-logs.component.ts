import { Component, ElementRef, OnInit } from '@angular/core';
import { GridColumn, GridColumnType, GridFilter, PageChangedEvent } from '../../../shared/data-table/data-table.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { AuditService } from '../../../api/audit/services/audit.service';
import { debounceTime } from 'rxjs/operators';
import { filterOperationEnum } from '../../global/enums/filter-operation-global.enum';
import { IActionFilterParams } from '../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { GridResponse } from '../../../core/repository/interfaces/helpers/grid-response.interface';
import { BreadcrumbService } from '../../../shared/breadcrumbs/services/breadcrumb.service';

export interface AuditLog {
  createdBy: string;
  createdDate: string;
  event: string;
  externalId: string;
  properties: any;
}

export interface AuditLogPayload {
  events: [];
  filter: IActionFilterParams[];
  startTime: Date;
  endTime: Date;
  pageNumber: number;
  pageSize: number;
}

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  auditLogsForm: FormGroup;
  auditLogData: GridResponse<AuditLog> = {
    data: [],
    totalCount: 0
  };
  payload: AuditLogPayload;
  eventsDataFilter = [];
  filtersConfiguration: GridFilter[] = [];
  // exportOptions: Array<any> = [
  //   {
  //     text: 'CSV'
  //   }
  // ];

  auditLogsColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'createdDate',
      translationKey: 'GRID.TIMESTAMP',
      type: GridColumnType.DATE_TIME,
      width: 120
    },
    {
      field: 'createdBy',
      translationKey: 'GRID.USER',
      width: 160
    },
    {
      field: 'event',
      translationKey: 'GRID.EVENT',
      width: 80
    },
    {
      field: 'description',
      translationKey: 'GRID.DESCRIPTION',
      width: 300
    }
  ];

  auditLogsPageNumber = 1;
  auditLogsPageSize = 20;
  auditLogsLoading = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private auditService: AuditService,
    private elRef: ElementRef,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.payload = {
      events: [],
      filter: [],
      startTime: new Date(),
      endTime: new Date(),
      pageNumber: 1,
      pageSize: this.auditLogsPageSize
    };
    this.auditLogsForm = this.createForm();
    this.auditLogsForm.valueChanges.pipe(debounceTime(700)).subscribe(() => {
      this.auditLogsPageNumber = 0;
      this.getData();
    });
    // get data from BE
    this.setFilters();
    this.setBreadcrumbs();
  }

  setBreadcrumbs() {
    this.breadcrumbService.setPageName(this.translate.instant('MENU.AUDIT-LOGS'));
  }

  calculateHeight() {
    return window.innerHeight - 324;
  }

  createForm(): FormGroup {
    return this.fb.group({
      createdBy: '',
      event: '',
      startDate: [moment().set('hours', 0).set('minutes', 0).set('second', 0).set('milliseconds', 0).toDate(), Validators.required],
      endDate: [moment().add(1, 'hour').set('minute', 0).toDate()],
      startTime: ['00:00'],
      endTime: ['00:00']
    });
  }

  getData(refresh = false) {
    this.auditLogsLoading = true;
    if (this.auditLogsPageNumber === 0) {
      this.auditLogsPageNumber++;
    }
    const startDate = new Date(this.auditLogsForm.get('startDate').value);
    const endDate = new Date(this.auditLogsForm.get('endDate').value);
    startDate.setSeconds(0, 0);
    endDate.setSeconds(0, 0);
    // moment(startDate.format(dateServerFormat);
    this.setPayloadData(startDate, endDate);
    this.auditService.logPost({ body: this.payload }).subscribe((res) => {
      this.auditLogData.data = res.data;
      this.auditLogData.totalCount = res.totalCount;
      this.auditLogsLoading = false;
      this.translateItems();
      if (refresh) {
        this.auditLogData.data = [...this.auditLogData.data];
      }
    });
  }

  setPayloadData(startDate, endDate) {
    const filter: IActionFilterParams[] = [];
    if (this.auditLogsForm?.get('createdBy')?.value) {
      filter.push({
        propName: 'createdBy',
        propValue: this.auditLogsForm?.get('createdBy')?.value,
        filterOperation: filterOperationEnum.contains
      });
    }
    let events: any = [];
    if (this.auditLogsForm?.get('event')?.value) {
      events = this.auditLogsForm?.get('event')?.value.map((item) => item.value);
    }
    this.payload = {
      events: events,
      filter: filter,
      startTime: startDate,
      endTime: endDate,
      pageNumber: this.auditLogsPageNumber,
      pageSize: this.auditLogsPageSize
    };
  }

  setFilters() {
    this.auditService.eventTypesGet().subscribe((res) => {
      res.map((x) =>
        this.eventsDataFilter.push({
          value: x.type,
          text: this.translate.instant('AUDIT-LOG.TITLE.' + x.value?.toUpperCase())
        })
      );
      this.filtersConfiguration.push({
        field: 'event',
        values: this.eventsDataFilter,
        label: 'FORM.EVENT',
        isMultiselect: true,
        width: 'tw-w-80'
      });
    });
    this.filtersConfiguration.push({
      field: 'createdBy',
      isStringValue: true,
      value: '',
      label: 'USER'
    });
  }

  translateItems() {
    this.auditLogData.data.forEach((item) => {
      item.properties.auditExternalId = item.externalId;
      delete item.properties['auditExternalId'];
      if (Object.keys(item.properties).length !== 0) {
        item['description'] = this.translate.instant('AUDIT-LOG.' + item.event?.toUpperCase(), item.properties);
      }
      item.event = this.translate.instant('AUDIT-LOG.TITLE.' + item.event?.toUpperCase());
    });
  }

  loadMoreData(event: PageChangedEvent) {
    this.auditLogsPageNumber = event.pageNumber;
    if (event.rowsPerPage && event.rowsPerPage !== this.auditLogsPageSize) {
      this.auditLogsPageNumber = 1;
      this.auditLogsPageSize = event.rowsPerPage;
    }
    this.getData(true);
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }
}

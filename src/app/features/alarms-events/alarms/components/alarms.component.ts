import { AlarmingService } from '../../../../core/repository/services/alarming/alarming.service';
import { IActionRequestParamsAlarms } from '../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAlarmsList } from 'src/app/core/repository/interfaces/alarming/alarms-list.interface';
import { filterSortOrderEnum } from 'src/app/features/global/enums/filter-operation-global.enum';
import * as moment from 'moment';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { EventData } from 'src/app/api/alarms-events/event-data-dto';
import { DataProcessingService } from 'src/app/core/repository/services/data-processing/data-processing.service';
import { EventDataRequestDto } from 'src/app/api/alarms-events/event-data-request-dto';
import { Observable } from 'rxjs';
import { GridColumn, GridColumnType, PageChangedEvent } from 'src/app/shared/data-table/data-table.component';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-alarms-events-alarms',
  templateUrl: './alarms.component.html',
  styles: []
})
export class AlarmsComponent implements OnInit {
  // Alarms
  alarmsDataList$: Observable<GridResponse<IAlarmsList>>;
  alarmsDataList: GridResponse<IAlarmsList>;
  alarmsForm: FormGroup;
  alarmsPageNumber = 1;
  alarmsPageSize = 20;
  alarmsDataListCount = 0;
  alarmsLoading = false;

  public alarmsSort: SortDescriptor[] = [
    {
      field: 'alarmTimestamp',
      dir: 'desc'
    }
  ];

  alarmsDataColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'alarmTimestamp',
      translationKey: 'GRID.TIMESTAMP',
      type: GridColumnType.DATE_TIME,
      width: 100
    },
    {
      field: 'eventId',
      translationKey: 'GRID.ID',
      width: 50
    },
    {
      field: 'severity',
      translationKey: 'GRID.SEVERITY',
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: 'LOW',
          color: 'blue'
        },
        {
          enumValue: 'MEDIUM',
          color: 'orange'
        },
        {
          enumValue: 'HIGH',
          color: 'red'
        }
      ],
      width: 100
    },
    {
      field: 'description',
      translationKey: 'GRID.DESCRIPTION',
      width: 200
    },
    {
      field: 'manufacturer',
      translationKey: 'GRID.VENDOR',
      width: 100,
      class: 'text-uppercase'
    },
    {
      field: 'sourceType',
      translationKey: 'GRID.SOURCE-TYPE',
      width: 100
    },
    {
      field: 'protocol',
      translationKey: 'GRID.PROTOCOL',
      width: 100
    }
  ];

  // Events
  eventsDataList$: Observable<EventData>;
  eventsDataList: EventData;
  eventsForm: FormGroup;
  eventsPageNumber = 1;
  eventsPageSize = 20;
  eventsDataListCount = 0;
  eventsLoading = false;

  eventsDataColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'timeStamp',
      translationKey: 'GRID.TIMESTAMP',
      type: GridColumnType.DATE_TIME,
      width: 100
    },
    {
      field: 'eventIdRaw',
      translationKey: 'GRID.EVENT-ID-RAW',
      width: 50
    },
    {
      field: 'eventId',
      translationKey: 'GRID.EVENT-ID',
      width: 50
    },
    {
      field: 'description',
      translationKey: 'GRID.DESCRIPTION',
      width: 200
    },
    {
      field: 'serialNumber',
      translationKey: 'GRID.METER-ID',
      width: 150
    },
    {
      field: 'manufacturer',
      translationKey: 'GRID.VENDOR',
      width: 100,
      class: 'text-uppercase'
    },
    {
      field: 'protocol',
      translationKey: 'GRID.PROTOCOL',
      width: 100,
      class: 'text-uppercase'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private alarmingService: AlarmingService,
    private breadcrumbService: BreadcrumbService,
    private dataProcessingService: DataProcessingService,
    private elRef: ElementRef
  ) {
    this.alarmsForm = this.createAlarmsForm();
    this.eventsForm = this.createEventsForm();

    this.getEventsDataList();
  }

  get startTimeAlarmsProperty(): string {
    return 'startDate';
  }

  get endTimeAlarmsProperty(): string {
    return 'endDate';
  }

  get startTimeEventsProperty(): string {
    return 'startDate';
  }

  get endTimeEventsProperty(): string {
    return 'endDate';
  }

  ngOnInit() {
    this.breadcrumbService.setPageName('');
  }

  createAlarmsForm(): FormGroup {
    return this.formBuilder.group({
      [this.startTimeAlarmsProperty]: [moment().subtract(1, 'days'), Validators.required],
      [this.endTimeAlarmsProperty]: [moment(), Validators.required],
      startTime: ['00:00'],
      endTime: ['00:00']
    });
  }

  createEventsForm(): FormGroup {
    return this.formBuilder.group({
      [this.startTimeEventsProperty]: [moment().subtract(1, 'days'), Validators.required],
      [this.endTimeEventsProperty]: [moment(), Validators.required],
      startTime: ['00:00'],
      endTime: ['00:00']
    });
  }

  getAlarmsDataList() {
    if (this.alarmsPageNumber === 0) {
      this.alarmsPageNumber++;
    }

    const startDate = new Date(this.alarmsForm.get(this.startTimeAlarmsProperty).value);
    startDate.setSeconds(0, 0);
    const endDate = new Date(this.alarmsForm.get(this.endTimeAlarmsProperty).value);
    endDate.setSeconds(0, 0);

    const request: IActionRequestParamsAlarms = {
      startTime: startDate,
      endTime: endDate,
      pageNumber: this.alarmsPageNumber,
      pageSize: this.alarmsPageSize,
      sort: [
        {
          index: 0,
          propName: this.alarmsSort[0].field,
          sortOrder: this.alarmsSort[0].dir === 'asc' ? filterSortOrderEnum.asc : filterSortOrderEnum.desc
        }
      ],
      textSearch: null
    };

    this.eventsLoading = true;

    this.alarmsDataList$ = this.alarmingService.getGridAlarms(request);
    this.alarmsDataList$.subscribe((data) => {
      this.alarmsDataList = data;
      this.eventsLoading = false;
      if (data) {
        this.alarmsDataListCount = data.totalCount;
        if (this.alarmsDataListCount === 0) {
          this.alarmsPageNumber = 0;
        }
      } else {
        this.alarmsDataListCount = 0;
      }
    });
  }

  public alarmsSortChange(sort: SortDescriptor[]): void {
    this.alarmsSort = sort;
    this.getAlarmsDataList();
  }

  getEventsDataList() {
    if (this.eventsPageNumber === 0) {
      this.eventsPageNumber++;
    }

    const startDate = new Date(this.eventsForm.get(this.startTimeEventsProperty).value);
    startDate.setSeconds(0, 0);
    const endDate = new Date(this.eventsForm.get(this.endTimeEventsProperty).value);
    endDate.setSeconds(0, 0);

    const request: EventDataRequestDto = {
      startTime: startDate,
      endTime: endDate,
      pageNumber: this.eventsPageNumber,
      pageSize: this.eventsPageSize
    };

    this.eventsLoading = true;

    this.eventsDataList$ = this.dataProcessingService.getEventsData(request);
    this.eventsDataList$.subscribe((data) => {
      this.eventsDataList = data;
      this.eventsLoading = false;
      if (data) {
        this.eventsDataListCount = data.totalRowCount;
        if (this.eventsDataListCount === 0) {
          this.eventsPageNumber = 0;
        }
      } else {
        this.eventsDataListCount = 0;
      }
    });
  }

  loadMoreAlarmsData(event: PageChangedEvent) {
    this.alarmsPageNumber = event.pageNumber;
    if (event.rowsPerPage && event.rowsPerPage !== this.alarmsPageSize) {
      this.alarmsPageNumber = 1;
      this.alarmsPageSize = event.rowsPerPage;
    }
    this.getAlarmsDataList();
  }

  loadMoreEventsData(event: PageChangedEvent) {
    this.eventsPageNumber = event.pageNumber;
    if (event.rowsPerPage && event.rowsPerPage !== this.eventsPageSize) {
      this.eventsPageNumber = 1;
      this.eventsPageSize = event.rowsPerPage;
    }
    this.getEventsDataList();
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  calculateHeight() {
    return window.innerHeight - 370;
  }
}

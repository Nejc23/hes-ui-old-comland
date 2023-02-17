import { AlarmingService } from '../../../../core/repository/services/alarming/alarming.service';
import { IActionRequestParamsAlarms } from '../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAlarmsList } from 'src/app/core/repository/interfaces/alarming/alarms-list.interface';
import { filterSortOrderEnum } from 'src/app/features/global/enums/filter-operation-global.enum';
import * as moment from 'moment';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { EventData } from 'src/app/api/alarms-events/event-data-dto';
import { forkJoin, Observable } from 'rxjs';
import { GridColumn, GridColumnType, GridFilter, PageChangedEvent } from 'src/app/shared/data-table/data-table.component';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { SortDescriptor } from '@progress/kendo-data-query';
import { debounceTime } from 'rxjs/operators';
import { GetDataV2Service } from 'src/app/api/data-processing/services';
import { EventDataRequest, ExportEventDataRequest } from 'src/app/api/data-processing/models';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { TranslateService } from '@ngx-translate/core';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';

@Component({
  selector: 'app-alarms-events-alarms',
  templateUrl: './alarms-events.component.html',
  styleUrls: ['./alarms-events.component.scss']
})
export class AlarmsEventsComponent implements OnInit {
  // Alarms
  alarmsDataList$: Observable<GridResponse<IAlarmsList>>;
  alarmsDataList: GridResponse<IAlarmsList>;
  alarmsForm: FormGroup;
  alarmsPageNumber = 1;
  alarmsPageSize = 20;
  alarmsDataListCount = 0;
  alarmsLoading = false;
  wildCardsSearch = false;

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
          color: 'white-on-blue'
        },
        {
          enumValue: 'MEDIUM',
          color: 'white-on-orange'
        },
        {
          enumValue: 'HIGH',
          color: 'white-on-red'
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
      field: 'sourceId',
      translationKey: 'GRID.DEVICE-ID',
      width: 100,
      class: 'text-uppercase'
    },
    {
      field: 'manufacturer',
      translationKey: 'GRID.VENDOR',
      width: 100
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
      translationKey: 'GRID.DEVICE-ID',
      width: 150
    },
    {
      field: 'manufacturer',
      translationKey: 'GRID.VENDOR',
      width: 100
    },
    {
      field: 'protocol',
      translationKey: 'GRID.PROTOCOL',
      width: 100,
      class: 'text-uppercase'
    }
  ];

  // Events search & filter
  wildCardsImageUrl = 'assets/images/icons/grain-icon.svg';
  filters: Array<GridFilter> = [];
  protocols: string[];
  manufacturers: string[];
  eventIds: Array<any>;
  rawEventIds: Array<any>;

  eventsSort: SortDescriptor[] = [
    {
      field: 'timeStamp',
      dir: 'desc'
    }
  ];

  exportOptions: Array<any> = [
    {
      text: 'Excel'
    },
    {
      text: 'CSV'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private alarmingService: AlarmingService,
    private breadcrumbService: BreadcrumbService,
    private elRef: ElementRef,
    private dataV2Service: GetDataV2Service,
    private toast: ToastNotificationService,
    private templatingService: TemplatingService,
    private translate: TranslateService,
    private codelistMeterUnitsRepositoryService: CodelistMeterUnitsRepositoryService
  ) {
    this.alarmsForm = this.createAlarmsForm();
    this.eventsForm = this.createEventsForm();
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

    this.eventsForm.valueChanges.pipe(debounceTime(700)).subscribe((data) => {
      this.eventsPageNumber = 0;
      this.getEventsDataList();
    });
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
    this.getGetCodeLists();

    return this.formBuilder.group({
      eventsSearchValue: null,
      [this.startTimeEventsProperty]: [moment().subtract(1, 'days'), Validators.required],
      [this.endTimeEventsProperty]: [moment(), Validators.required],
      startTime: ['00:00'],
      endTime: ['00:00'],
      manufacturer: null,
      protocol: null,
      eventIds: [],
      rawEventIds: []
    });
  }

  getGetCodeLists() {
    forkJoin({
      eventMappings: this.templatingService.getGetEventMappingGroupCodeTables(),
      protocols: this.codelistMeterUnitsRepositoryService.meterUnitProtocolTypeCodelist(),
      manufacturers: this.codelistMeterUnitsRepositoryService.meterUnitVendorCodelist(0)
    }).subscribe(({ eventMappings: eventCodeTable, protocols, manufacturers }) => {
      const epointEventListItems: Array<{ value: number; text: string }> = [];
      const rawEventListItems = [...epointEventListItems];

      eventCodeTable.epointEventCodeTable.map((x) => epointEventListItems.push({ value: x.id, text: x.id + ': ' + x.description }));
      this.eventIds = epointEventListItems;

      eventCodeTable.rawEventCodeTable.map((x) => rawEventListItems.push({ value: x.id, text: x.id + ': ' + x.description }));
      this.rawEventIds = rawEventListItems;

      this.protocols = protocols.map((protocol) => protocol.value);
      this.manufacturers = manufacturers.map((manufacturer) => manufacturer.value);
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
    this.eventsLoading = true;

    if (this.eventsPageNumber === 0) {
      this.eventsPageNumber++;
    }

    const startDate = new Date(this.eventsForm.get(this.startTimeEventsProperty).value);
    startDate.setSeconds(0, 0);
    const endDate = new Date(this.eventsForm.get(this.endTimeEventsProperty).value);
    endDate.setSeconds(0, 0);

    const request: EventDataRequest = {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      pageNumber: this.eventsPageNumber,
      pageSize: this.eventsPageSize,
      searchInput: this.getDropdownSelectedValue('eventsSearchValue'),
      wildCardsSearch: this.wildCardsSearch,
      manufacturer: this.getDropdownSelectedValue('manufacturer'),
      protocol: this.getDropdownSelectedValue('protocol'),
      sortBy: this.eventsSort[0].field,
      sortDir: this.eventsSort[0].dir === 'asc' ? 'asc' : 'desc',
      requestId: '',
      eventIds: this.getDropdownSelectedValue('eventIds')?.map((x) => x.value),
      rawEventIds: this.getDropdownSelectedValue('rawEventIds')?.map((x) => x.value)
    };

    this.dataV2Service.v2GetEventsDataPost({ body: request }).subscribe(
      (data) => {
        this.eventsLoading = false;
        this.eventsDataList = data;
        if (data) {
          this.eventsDataListCount = data.totalRowCount;
          if (this.eventsDataListCount === 0) {
            this.eventsPageNumber = 0;
          }
        } else {
          this.eventsDataListCount = 0;
        }
        this.filters = [
          {
            field: 'rawEventIds',
            values: this.rawEventIds,
            label: 'GRID.EVENT-ID-RAW',
            isMultiselect: true
          },
          {
            field: 'eventIds',
            values: this.eventIds,
            label: 'GRID.EVENT-ID',
            isMultiselect: true
          },
          {
            field: 'manufacturer',
            values: this.manufacturers,
            label: 'GRID.VENDOR'
          },
          {
            field: 'protocol',
            values: this.protocols,
            label: 'GRID.PROTOCOL'
          }
        ];
      },
      () => {
        this.toast.errorToast(this.translate.instant('COMMON.TOO-MANY-RECORDS-SEARCH'));
        this.eventsLoading = false;
      }
    );
  }

  get permissionExportEvents() {
    return PermissionEnumerator.Export_Events;
  }

  getDropdownSelectedValue(fieldName: string) {
    const dropdownField = this.eventsForm.controls[fieldName];

    if (dropdownField && dropdownField.value !== 'All') {
      return this.eventsForm.controls[fieldName].value;
    }
    return null;
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

  sortChange(sort: SortDescriptor[]) {
    if (sort[0].dir || sort[0].field === 'timeStamp') {
      this.eventsSort = sort;
    } else {
      // if no direction is given, fall back to default sort
      this.eventsSort = [
        {
          field: 'timeStamp',
          dir: 'desc'
        }
      ];
    }
    this.getEventsDataList();
  }

  toggleWildcards(event: boolean) {
    this.wildCardsSearch = event;
    this.getEventsDataList();
  }

  exportData(event: any) {
    if (event && event.text) {
      let exportFileType: string;
      switch (event.text) {
        case 'CSV':
          exportFileType = 'csv';
          break;
        case 'Excel':
        default:
          exportFileType = 'xlsx';
          break;
      }

      const startDate = new Date(this.eventsForm.get(this.startTimeEventsProperty).value);
      startDate.setSeconds(0, 0);
      const endDate = new Date(this.eventsForm.get(this.endTimeEventsProperty).value);
      endDate.setSeconds(0, 0);

      const request: ExportEventDataRequest = {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        searchInput: this.getDropdownSelectedValue('eventsSearchValue'),
        wildCardsSearch: this.wildCardsSearch,
        manufacturer: this.getDropdownSelectedValue('manufacturer'),
        protocol: this.getDropdownSelectedValue('protocol'),
        exportFileType: exportFileType,
        pageSize: 0,
        pageNumber: 0,
        requestId: '',
        eventIds: this.getDropdownSelectedValue('eventIds')?.map((x) => x.value),
        rawEventIds: this.getDropdownSelectedValue('rawEventIds')?.map((x) => x.value)
      };

      this.dataV2Service.v2ExportEventsDataPost({ body: request }).subscribe(
        (res) => {
          const dateTimeNow = new Date().toISOString().slice(0, -5); // Formats date as 2022-04-01T12_55_52
          const filename: string = `e-Point-events_export_${dateTimeNow}.${exportFileType}`;

          const binaryData = [];
          binaryData.push(res.body);

          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
          downloadLink.setAttribute('download', filename);

          document.body.appendChild(downloadLink);
          downloadLink.click();
        },
        (err) => {
          const reader = new FileReader();
          const that = this;
          reader.onloadend = function (e) {
            let errorMessage = JSON.parse((<any>e.target).result)?.exportError[0];
            if (!errorMessage) {
              errorMessage = 'Error at exporting. Please try again';
            }
            that.toast.errorToast(errorMessage);
          };
          reader.readAsText(err.error);
        }
      );
    }
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  calculateHeight() {
    return window.innerHeight - 370;
  }
}

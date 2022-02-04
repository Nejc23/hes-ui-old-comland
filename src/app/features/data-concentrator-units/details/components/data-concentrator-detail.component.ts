import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { dataConcentratorUnits } from 'src/app/core/consts/route.const';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { PermissionService } from 'src/app/core/permissions/services/permission.service';
import { DataConcentratorUnit } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-unit.interface';
import { DcuUpdateRequest } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-update-request.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { ModalService } from '../../../../core/modals/services/modal.service';
import { EditDataConcentratorFormComponent } from '../../components/edit-dcu-form/edit-data-concentrator-form.component';
import { DcuForm } from '../../interfaces/dcu-form.interface';
import { icon, latLng, marker, tileLayer } from 'leaflet';
import { brand } from 'src/environments/brand/default/brand';
import { MiniCardItemType } from '../../../../shared/mini-card-item/mini-card-item.component';
import { GridColumn, GridColumnType, GridFilter, GridRowAction } from '../../../../shared/data-table/data-table.component';
import { MeterUnitsService } from '../../../../core/repository/services/meter-units/meter-units.service';
import { IActionRequestParams } from '../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { MeterUnitsList } from '../../../../core/repository/interfaces/meter-units/meter-units-list.interface';
import { DcOperationsService } from '../../services/dc-operations.service';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { RegistersFilter } from '../../../meter-units/registers/interfaces/data-processing-request.interface';
import { DataProcessingService } from '../../../../core/repository/services/data-processing/data-processing.service';
import { EventsByTimestamp } from '../../../meter-units/registers/interfaces/events-processing.interface';
import { EventRegisterValue } from '../../../../core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { JobsService } from '../../../../core/repository/services/jobs/jobs.service';
import { ModalConfirmComponent } from '../../../../shared/modals/components/modal-confirm.component';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { JobTypeEnumeration } from '../../../jobs/enums/job-type.enum';
import { SchedulerJobComponent } from '../../../jobs/components/scheduler-job/scheduler-job.component';
import { CodelistMeterUnitsRepositoryService } from '../../../../core/repository/services/codelists/codelist-meter-units-repository.service';
import { SchedulerJobsEventEmitterService } from '../../../jobs/services/scheduler-jobs-event-emitter.service';
import { OperationType } from '../../components/operations/dc-operations.component';
import { DeviceState } from '../../../../core/repository/interfaces/meter-units/meter-unit-details.interface';
import { EventManagerService } from '../../../../core/services/event-manager.service';
import { dateServerFormat } from '../../../../shared/forms/consts/date-format';

@Component({
  selector: 'app-data-concentrator-detail',
  templateUrl: './data-concentrator-detail.component.html',
  styleUrls: ['./data-concentrator-detail.component.scss']
})
export class DataConcentratorDetailComponent implements OnInit, OnDestroy {
  @ViewChild('popover') popover;

  form: FormGroup;
  editForm: FormGroup;
  eventsForm: FormGroup;

  saveError: string;
  edit = false;
  public credentialsVisible = false;
  public routerLinkUrl = '/dataConcentratorUnits';
  concentratorId = '';
  data: DataConcentratorUnit;
  dcuStatuses$: Observable<Codelist<number>[]>;
  dcuTypes$: Observable<Codelist<number>[]>;
  dcuVendors$: Observable<Codelist<number>[]>;
  meterStatusData = [];
  tags = [];
  alarms = [];
  map: any;
  options: any;
  miniCardItemTypeEnum = MiniCardItemType;
  activeJobs: any = [];
  jobsLoading = false;
  meters: Array<MeterUnitsList> = [];
  metersTotal = 0;
  events: EventRegisterValue[] = [];
  eventsTotal = 0;
  meterStatusSupportedTypes = ['DC450G3', 'AmeraDC'];
  showMeterStatusWidget = false;
  openEdit = false;
  metersGridPageNumber = 1;
  metersPageSize = 20;
  eventIds = [];
  eventsLoading = false;
  eventsByTimestamp: EventsByTimestamp[];
  hours = false;

  chartVisible = true;
  saveData = false;

  selectedStartDate;
  selectedEndDate;

  messageEnabled = this.translate.instant('JOB.SCHEDULER-JOB-ENABLED');
  messageDisabled = this.translate.instant('JOB.SCHEDULER-JOB-DISABLED');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');

  DeviceStateEnum = DeviceState;

  eventsColumnsConfiguration: Array<GridColumn> = [
    {
      translationKey: 'Timestamp',
      field: 'timestamp'
    },
    {
      translationKey: 'ID',
      field: 'value'
    },
    {
      translationKey: 'Description',
      field: 'description'
    }
  ];
  metersColumnsConfiguration: Array<GridColumn> = [
    {
      translationKey: 'Name',
      field: 'logicalDeviceName'
    },
    {
      translationKey: 'Serial',
      field: 'serialNumber'
    },
    {
      translationKey: 'Systitle',
      field: 'systitle'
    },
    {
      translationKey: 'Installation Status',
      field: 'status',
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: 'Installed',
          color: 'green'
        },
        {
          enumValue: 'ReadyForReConnection',
          color: 'yellow'
        }
      ]
    }
  ];
  // metersFiltersConfiguration: Array<GridFilter> = [
  //   {
  //     // label: 'Status',
  //     field: 'status',
  //     values: ['INSTALLED', 'LOST'] // mock
  //   }
  // ];
  // location mock
  layer = marker([46.2434, 14.4192], {
    icon: icon({
      iconSize: [64, 64],
      iconAnchor: [13, 41],
      iconUrl: 'assets/images/icons/marker-' + brand.brand.toLowerCase() + '.svg'
    })
  });
  activeJobsRowActionsConfiguration: Array<GridRowAction> = [
    {
      actionName: 'settings',
      iconName: 'settings-icon'
    },
    {
      actionName: 'runJob',
      iconName: 'play-icon'
    }
  ];
  activeJobsColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'description',
      translationKey: 'FORM.NAME'
    },
    {
      field: 'type',
      translationKey: 'FORM.TYPE'
    },
    {
      field: 'nextRun',
      translationKey: 'FORM.NEXT-START',
      type: GridColumnType.DATE_TIME
    }
  ];

  componentType = OperationType;

  eventsFiltersConfiguration: Array<GridFilter> = [];
  private dcuConcentratorDeleted: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private formUtils: FormsUtilsService,
    private codelistService: CodelistRepositoryService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private breadcrumbService: BreadcrumbService,
    private permissionService: PermissionService,
    private dcOperationsService: DcOperationsService,
    private dcuEventsService: DataConcentratorUnitsGridEventEmitterService,
    private modalService: ModalService,
    private translate: TranslateService,
    private elRef: ElementRef,
    private meterUnitsTypeService: MeterUnitsService,
    private router: Router,
    private dataProcessingService: DataProcessingService,
    private activeJobsService: JobsService,
    private toast: ToastNotificationService,
    private codelistMeterUnitsRepositoryService: CodelistMeterUnitsRepositoryService,
    private schedulerJobsEventService: SchedulerJobsEventEmitterService,
    private eventsService: EventManagerService
  ) {
    this.eventsService.getCustom('RefreshConcentratorEvent').subscribe((res) => {
      this.getData();
    });
    this.options = {
      layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }), this.layer],
      zoom: 13,
      center: latLng(46.2434, 14.4192) //location mock
    };
  }

  get nameProperty() {
    return nameOf<DcuForm>((o) => o.name);
  }

  get serialNumberProperty() {
    return nameOf<DcuForm>((o) => o.serialNumber);
  }

  get hostname() {
    return nameOf<DcuForm>((o) => o.hostname);
  }

  get timezone() {
    return nameOf<DcuForm>((o) => o.timeZoneName);
  }

  get installedDate() {
    return nameOf<DcuForm>((o) => o.firstInstallDate);
  }

  get userNameProperty() {
    return nameOf<DcuForm>((o) => o.userName);
  }

  get typeProperty() {
    return nameOf<DcuForm>((o) => o.type);
  }

  get vendorProperty() {
    return nameOf<DcuForm>((o) => o.manufacturer);
  }

  get statusProperty() {
    return nameOf<DcuForm>((o) => o.status);
  }

  get addressProperty() {
    return nameOf<DcuForm>((o) => o.address);
  }

  get tagsProperty() {
    return nameOf<DcuForm>((o) => o.tags);
  }

  get macProperty() {
    return nameOf<DcuForm>((o) => o.mac);
  }

  get latitudeProperty() {
    return nameOf<DcuForm>((o) => o.latitude);
  }

  get longitudeProperty() {
    return nameOf<DcuForm>((o) => o.longitude);
  }

  get externalIdProperty() {
    return nameOf<DcuForm>((o) => o.externalId);
  }

  get permissionEdit() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  get plcStatus() {
    return nameOf<DcuForm>((o) => o.plcStatus);
  }

  get startDateProperty(): string {
    return 'startDate';
  }

  get endDateProperty(): string {
    return 'endDate';
  }

  get startTimeProperty() {
    return nameOf<RegistersFilter>((o) => o.startTime);
  }

  get endTimeProperty() {
    return nameOf<RegistersFilter>((o) => o.endTime);
  }

  get registerProperty() {
    return 'register';
  }

  ngOnInit() {
    this.eventsForm = this.createEventsForm();
    this.concentratorId = this.route.snapshot.paramMap.get('id');
    this.dcuStatuses$ = this.codelistService.dcuStatusCodelist();
    this.dcuTypes$ = this.codelistService.dcuTypeCodelist();
    this.dcuVendors$ = this.codelistService.dcuVendorCodelist();

    // get DCU
    this.getData();

    this.dcuConcentratorDeleted = this.dcuEventsService.eventEmitterConcentratorDeleted.subscribe((x) => {
      this.router.navigate([dataConcentratorUnits]);
    });
  }

  ngOnDestroy(): void {
    if (this.dcuConcentratorDeleted) {
      this.dcuConcentratorDeleted.unsubscribe();
    }
  }

  getData() {
    this.saveData = false;
    if (this.concentratorId.length > 0) {
      this.dataConcentratorUnitsService.getDataConcentratorUnit(this.concentratorId).subscribe((response: DataConcentratorUnit) => {
        this.data = response;
        if (this.meterStatusSupportedTypes.find((val) => val.toLowerCase() === this.data.typeValue?.toLowerCase())) {
          this.showMeterStatusWidget = true;
        }
        this.breadcrumbService.setPageName(this.data.name);
        if (this.data.firstInstallDate) {
          // format date
          this.data.firstInstallDate =
            moment(this.data.firstInstallDate).format(environment.dateDisplayFormat) +
            ' ' +
            moment(this.data.firstInstallDate).format(environment.timeFormatLong);
        }
        this.form = this.createForm();
        this.editForm = this.createEditForm();
        this.eventsForm = this.createEventsForm();

        // Credentials are visible just for AC750
        this.credentialsVisible = this.data && this.data.typeId === 2;
        this.setCredentialsControls(this.credentialsVisible);

        this.loadGridData(this.metersGridPageNumber);
        this.loadRegistersData();
        this.getActiveJobs();
        // notifications
        this.alarms = [
          {
            timestamp: '28.12.1986',
            id: 99999,
            description: 'JAVA_APP',
            type: 'ALERT'
          },
          {
            timestamp: '02.06.2021 00:05:02',
            id: 333,
            description: 'JAVA_APP________AAAAAAAAAAAAAAAA',
            type: 'ALERT'
          },
          {
            timestamp: '28.12.1986',
            id: 333,
            description: 'JAVA_APP',
            type: 'NOTIFICATION'
          },
          {
            timestamp: '28.12.1986',
            id: 333,
            description: 'JAVA_APP',
            type: 'NOTIFICATION'
          },
          {
            timestamp: '28.12.1986',
            id: 333,
            description: 'JAVA_APP',
            type: 'NOTIFICATION'
          }
        ];
        // todo colors
        this.tags = [
          'first',
          'second',
          'fifth',
          'very long taaag',
          '123',
          'first',
          'second',
          'fifth',
          'very long taaag',
          '123',
          'first',
          'second',
          'fifth',
          'very long taaag',
          '123'
        ];

        // mock todo object
        this.meterStatusData = [
          {
            name: 'Installed',
            value: 7
          },
          {
            name: 'Installing',
            value: 5
          },
          {
            name: 'Awaiting',
            value: 2
          },
          {
            name: 'Lost',
            value: 1
          },
          {
            name: 'Other',
            value: 6
          },
          {
            name: 'Blacklist',
            value: 3
          },
          {
            name: 'Disappeared',
            value: 5
          },
          {
            name: 'Deinstalled',
            value: 8
          }
        ];
      });
    } else {
      this.form = this.createForm();
    }
  }

  updateData(updatedValues: DcuUpdateRequest) {
    this.data.hostname = updatedValues.hostname;
    this.data.name = updatedValues.name;
    this.data.serialNumber = updatedValues.serialNumber;
    this.data.externalId = updatedValues.externalId;
    this.data.username = updatedValues.userName;
    this.data.address = updatedValues.address;

    this.form = this.createForm();
    this.editForm = this.createEditForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.nameProperty]: [this.data ? this.data.name : null, Validators.required],
        [this.serialNumberProperty]: [this.data ? this.data.serialNumber : null, Validators.required], // [this.statusProperty]: [this.data ? { id: this.data.statusId, value: this.data.statusValue } : null, [Validators.required]],
        [this.typeProperty]: [
          this.data && this.data.typeId > 0 ? { id: this.data.typeId, value: this.data.typeValue } : null,
          [Validators.required]
        ],
        [this.vendorProperty]: [this.data ? { id: this.data.manufacturerId, value: this.data.manufacturerValue } : null],
        [this.hostname]: [this.data ? this.data.hostname : null],
        [this.installedDate]: [this.data ? this.data.firstInstallDate : null],
        [this.userNameProperty]: [this.data ? this.data.username : null],
        [this.externalIdProperty]: [this.data ? this.data.externalId : null],
        [this.macProperty]: [this.data ? this.data.mac : null],
        [this.timezone]: [this.data ? this.data.timeZoneName : null],
        [this.addressProperty]: [this.data ? this.data.address : null],
        [this.plcStatus]: [this.data ? this.data.plcStatus : null],
        [this.tagsProperty]: [this.data ? this.data.tags : null]
      },
      { updateOn: 'blur' }
    );
  }

  createEditForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameProperty]: [this.data ? this.data.name : null, Validators.required],
      [this.serialNumberProperty]: [this.data ? this.data.serialNumber : null, Validators.required],
      [this.externalIdProperty]: [this.data ? this.data.externalId : null],
      [this.typeProperty]: [this.data && this.data.typeId > 0 ? { id: this.data.typeId, value: this.data.typeValue } : null],
      [this.vendorProperty]: [this.data ? { id: this.data.manufacturerId, value: this.data.manufacturerValue } : null],
      [this.addressProperty]: [this.data ? this.data.address : null],
      [this.macProperty]: [this.data ? this.data.mac : null],
      [this.hostname]: [this.data ? this.data.hostname : null, Validators.required],
      [this.userNameProperty]: [this.data ? this.data.username : null]
    });
  }

  fillData(): DcuForm {
    const formData: DcuForm = {
      id: this.concentratorId,
      name: this.form.get(this.nameProperty).value,
      serialNumber: this.form.get(this.serialNumberProperty).value,
      externalId: this.form.get(this.externalIdProperty).value,
      hostname: this.form.get(this.hostname).value,
      tags: this.form.get(this.tagsProperty).value,
      type: this.form.get(this.typeProperty).value,
      manufacturer: this.form.get(this.vendorProperty).value,
      status: this.form.get(this.statusProperty).value,
      mac: this.form.get(this.macProperty).value,
      address: this.form.get(this.addressProperty).value,
      latitude: null, // this.form.get(this.latitudeProperty).value,
      longitude: null // this.form.get(this.longitudeProperty).value,
    };

    if (this.credentialsVisible) {
      formData.userName = this.form.get(this.userNameProperty).value;
    }

    return formData;
  }

  editDcu() {
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef = this.modalService.open(EditDataConcentratorFormComponent, options);
    const component: EditDataConcentratorFormComponent = modalRef.componentInstance;
    component.concentratorId = this.concentratorId;
    component.form = this.editForm;
    component.credentialsVisible = this.credentialsVisible;

    modalRef.result
      .then((data) => {
        this.updateData(data);
      })
      .catch(() => {});
  }

  saveDcu() {
    const dcuFormData = this.fillData();
    const request = this.dataConcentratorUnitsService.updateDcu(this.concentratorId, dcuFormData);
    const successMessage = this.translate.instant('DCU.DCU-UPDATED-SUCCESSFULLY');

    try {
      this.formUtils.saveForm(this.form, request, successMessage).subscribe(
        (result) => {
          if (result) {
            this.getData();
          }
        },
        (errResult) => {
          console.log('Error saving form: ', errResult);
          this.saveError = errResult && errResult.error ? errResult.error[0] : null;
        } // error
      );
    } catch (error) {
      console.log('Edit-DCU Form Error:', error);
    }
  }

  setCredentialsControls(credentialsVisible: boolean) {
    // Disable fields just for form validation. Disabled fields are also not validated in custom matchPasswordsValidator.
    if (credentialsVisible) {
      this.form.get(this.userNameProperty).enable();
    } else {
      this.form.get(this.userNameProperty).disable();
    }
  }

  public onTabSelect(e) {
    console.log(e);
  }

  editButtonClicked() {
    this.openEdit = true;
  }

  closeSlideOut() {
    this.openEdit = false;
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  // setDate() {
  //   this.showData(this.selectedRegister, true);
  // }

  loadGridData(pageNumber: number) {
    this.eventsLoading = true;
    const requestParam: IActionRequestParams = {
      pageSize: this.metersPageSize,
      pageNumber: pageNumber,
      textSearch: {
        value: this.data.name,
        propNames: ['deviceId', 'status', 'name', 'serialNumber', 'logicalDeviceName', 'moduleId', 'parent', 'vendor', 'medium', 'id'],
        useWildcards: true
      },
      sort: [
        {
          propName: 'Name',
          index: 0,
          sortOrder: 'Descending'
        }
      ]
    };
    this.meterUnitsTypeService.getGridMeterUnits(requestParam).subscribe((res) => {
      // loading data from backend
      this.meters.push(...res.data);
      // KendoUI change detection for grid rerender
      this.meters = [...this.meters];
      this.metersTotal = res.totalCount;
    });
  }

  refreshData() {
    this.getData();
    this.openEdit = false;
  }

  createEventsForm(): FormGroup {
    return this.formBuilder.group({
      [this.registerProperty]: [null],
      [this.startDateProperty]: [moment().subtract(1, 'days'), Validators.required],
      [this.endDateProperty]: [moment(), Validators.required],
      [this.startTimeProperty]: ['00:00'],
      [this.endTimeProperty]: ['00:00']
    });
  }

  loadRegistersData() {
    this.events = [];
    this.eventsTotal = 0;
    this.selectedStartDate = moment(this.eventsForm.get('startDate').value);
    this.selectedEndDate = moment(this.eventsForm.get('endDate').value);

    const startTime = moment(this.selectedStartDate).format(dateServerFormat);
    const endTime = moment(this.selectedEndDate).format(dateServerFormat);

    const registersFilter: RegistersFilter = {
      deviceId: this.concentratorId,
      startTime: startTime,
      endTime: endTime,
      register: {
        categorization: 'EVENT'
      }
    };

    this.eventsLoading = true;
    this.dataProcessingService.getChartData(registersFilter, true).subscribe((values) => {
      this.events = values;

      if (this.events) {
        // set filter
        this.eventIds = [...new Set(this.events.map((event) => event.value))];
        this.eventsFiltersConfiguration = [
          {
            field: 'value',
            values: this.eventIds,
            label: 'FORM.ID'
          }
        ];
        this.setEventData();
        // format timestamp for Search ALL columns on grid
        this.events.map(
          (event) =>
            (event.timestamp =
              moment(event.timestamp).format(environment.dateDisplayFormat) +
              ' ' +
              moment(event.timestamp).format(environment.timeFormatLong))
        );
      }
      this.eventsLoading = false;
    });
  }

  setEventData() {
    this.eventsByTimestamp = [];
    let eventsById = [];
    // is it ordered?
    const startTime = new Date(this.events[0].timestamp);
    const endTime = new Date(this.events[this.events.length - 1].timestamp);

    const daysDiff = this.getDiffDays(startTime, endTime);

    const currentTime = new Date(this.events[0].timestamp);
    currentTime.setMinutes(0, 0, 0);

    // let inteval = 1000 * 60 * 60 * 60; // hours
    let outData = [];
    if (daysDiff <= 1) {
      // hourly interval
      this.hours = true;
      outData = this.events.map((d: EventRegisterValue) => ({ timestamp: new Date(d.timestamp).setMinutes(0, 0, 0), value: d.value }));
    } else {
      this.hours = false;
      outData = this.events.map((d: EventRegisterValue) => ({ timestamp: new Date(d.timestamp).setHours(0, 0, 0, 0), value: d.value }));
    }

    const groupBy = (array, key) => {
      // Return the end result
      return array.reduce((result, currentValue) => {
        if (!result[currentValue[key]]) {
          result[currentValue[key]] = 0;
        }
        result[currentValue[key]]++;

        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
      }, {}); // empty object is the initial value for result object
    };

    this.eventsByTimestamp = Object.entries(groupBy(outData, 'timestamp')).map((e) => ({
      timestamp: new Date(Number(e[0])),
      count: Number(e[1])
    }));
    const dataLength = this.events.length;
    const eventsByIdGroup = groupBy(outData, 'value');

    eventsById = Object.entries(eventsByIdGroup).map((e) => ({
      category: Number(e[0]),
      count: Number(e[1]),
      value: Number(e[1]) / dataLength
    }));

    const eventsLength = eventsById.length;

    if (eventsLength % 6 === 1) {
      eventsById[eventsLength - 1].color = environment.kendoPieChartLastSliceColor; // last color fix to avoid the same color for the first and the last pie slice
    }
  }

  getDiffDays(startTime: Date, endTime: Date): number {
    const diff = endTime.valueOf() - startTime.valueOf();
    return diff / (1000 * 3600 * 24);
  }

  loadMoreItems(event: PageChangeEvent) {
    this.loadGridData(this.metersGridPageNumber + 1);
  }

  hideChart() {
    this.chartVisible = !this.chartVisible;
  }

  getActiveJobs() {
    this.jobsLoading = true;
    this.activeJobsService.getSchedulerActiveJobsList(this.concentratorId).subscribe((res) => {
      this.jobsLoading = false;
      this.activeJobs = res;
    });
  }

  goToJobs() {
    this.router.navigate(['/schedulerJobs']);
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'runJob') {
      this.runJob(event.id);
    } else {
      this.editJob(event.rowData);
    }
  }

  // TODO CLEANUP move to service
  runJob(id: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.EXECUTE');
    response = this.activeJobsService.executeSchedulerJob(id);

    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-OPERATION');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.EXECUTE');

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        response.subscribe(
          (value) => {
            this.toast.successToast(this.translate.instant('JOB.SCHEDULER-JOB-STARTED'));
            this.getActiveJobs();
          },
          (e) => {
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  editJob(data: any) {
    const params = {
      data: data
    };
    const options: NgbModalOptions = {
      size: 'xl'
    };

    if (params.data.jobType === JobTypeEnumeration.discovery) {
      this.editDiscoveryJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.timeSync) {
      // dc time sync
      this.editDcTimeSyncJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.readEvents) {
      // dc read events job
      this.editDcReadEventsJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.topology) {
      this.editTopologyJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.alarmNotification) {
      this.editAlarmNotificationJob(params, options);
    } else {
      this.editReadingJob(params, options);
    }
  }

  hasUserAccess(params: any): boolean {
    if (!this.permissionService.hasAccess(PermissionEnumerator.Manage_Jobs)) {
      return false;
    }

    const jobType = params.data.jobType;
    if (jobType === JobTypeEnumeration.reading) {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters);
    } else if (jobType === JobTypeEnumeration.alarmNotification) {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Alarms);
    } else {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Concentrators);
    }
  }

  update() {
    this.saveData = true;
  }

  isEditVisible(): boolean {
    return this.permissionService.hasAccess(PermissionEnumerator.Manage_Concentrators);
  }

  private editReadingJob(data: any, options: NgbModalOptions) {
    const params = {
      data: data
    };

    const selectedJobId = params.data.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.activeJobsService.getJob(selectedJobId);

    forkJoin({ timeUnits: timeUnits$, job: job$ }).subscribe((responseList) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job, JobTypeEnumeration.reading);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.getActiveJobs();
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDiscoveryJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.activeJobsService.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.discovery);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editTopologyJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.activeJobsService.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.topology);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDcTimeSyncJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.activeJobsService.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.timeSync);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDcReadEventsJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.activeJobsService.getJob(selectedJobId);

    forkJoin({ timeUnits: timeUnits$, job: job$ }).subscribe((responseList) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job, JobTypeEnumeration.readEvents);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editAlarmNotificationJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    forkJoin({
      protocols: this.codelistMeterUnitsRepositoryService.meterUnitProtocolTypeCodelist(),
      manufacturers: this.codelistMeterUnitsRepositoryService.meterUnitVendorCodelist(0),
      severities: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSeverityTypeCodelist(),
      sources: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSourceTypeCodelist()
    }).subscribe(({ protocols, manufacturers, severities, sources }) => {
      this.activeJobsService.getNotificationJob(selectedJobId).subscribe((job) => {
        const modalRef = this.modalService.open(SchedulerJobComponent, options);
        const component: SchedulerJobComponent = modalRef.componentInstance;
        component.setFormNotificationJobEdit(protocols, manufacturers, severities, sources, selectedJobId, job);

        modalRef.result.then(
          (data) => {
            // on close (CONFIRM)
            this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
            this.getActiveJobs();
          },
          (reason) => {
            // on dismiss (CLOSE)
          }
        );
      });
    });
  }
}

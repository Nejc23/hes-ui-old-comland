import { IActionRequestAddTemplate } from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Observable } from 'rxjs';
import { TemplatesList } from '../../../../../core/repository/interfaces/auto-templates/templates-list.interface';
import { DateTimeRange } from '../../../../../shared/forms/interfaces/date-time-range.interface';
import * as _ from 'lodash';
import { RegistersSelectService } from '../../../../../core/repository/services/registers-select/registers-select.service';
import {
  SchedulableRegisters,
  SchedulableRegistersTypes
} from '../../../../../core/repository/interfaces/registers-select/schedulable-registers-type.interface';
import * as moment from 'moment';
import { dateDisplayFormat, dateOnlyServerFormat } from '../../../../../shared/forms/consts/date-format';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';

@Component({
  selector: 'app-plc-read-registers',
  templateUrl: './plc-read-registers.component.html'
})
export class PlcReadRegistersComponent implements OnInit {
  @ViewChild('popover') popover;

  public selectedRowsCount: number;
  public selectedDeviceIds = [];
  noRegisters = false;
  registersRequiredText = $localize`Required field`;
  actionName = $localize`Read Meter Objects`;
  form: FormGroup;

  rowData$: Observable<SchedulableRegisters>;
  rowData: SchedulableRegistersTypes[];

  allRowData: any;

  columnDefs = [];
  public gridApi;
  public totalCount = 0;

  public modules: Module[] = AllModules;

  requiredText = $localize`Date and at least one register must be selected`;
  templateErrorText = $localize`One of the meters selected does not have template assigned!`;
  foundText = $localize`found`;

  noRegisterSelected = false;
  // TODO when backend
  selectedRegister: TemplatesList = null;

  actionRequest: IActionRequestParams;
  search;
  date: DateTimeRange;
  isDataFound = false;
  searchTextEmpty = true;
  templateError = false;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private registersService: RegistersSelectService,
    private modalService: ModalService
  ) {
    this.form = this.createForm();

    let startDateFormatted = moment().subtract(1, 'days').format(dateDisplayFormat);
    let endDateFormatted = moment().format(dateDisplayFormat);

    this.form.controls.labelText.setValue(
      startDateFormatted + ' ' + this.form.controls.startTime.value + ' - ' + endDateFormatted + ' ' + this.form.controls.endTime.value
    );
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.startDateProperty]: [moment().subtract(1, 'days'), Validators.required],
      [this.endDateProperty]: [moment(), Validators.required],
      [this.startTimeProperty]: ['00:00'],
      [this.endTimeProperty]: ['00:00'],
      [this.searchProperty]: [''],
      [this.labelTextProperty]: ['', Validators.required]
    });
  }

  get startTimeProperty(): string {
    return 'startTime';
  }

  get endTimeProperty(): string {
    return 'endTime';
  }

  get searchProperty(): string {
    return 'search';
  }

  get labelTextProperty(): string {
    return 'labelText';
  }

  get startDateProperty(): string {
    return 'startDate';
  }

  get endDateProperty(): string {
    return 'endDate';
  }

  ngOnInit() {
    this.columnDefs = [
      {
        minWidth: 45,
        suppressMenu: true,
        checkboxSelection: true,
        lockPosition: true,
        field: 'name',
        headerName: $localize`Type`,
        cellStyle: (params) => {
          if (params.data.isSelectable !== true) {
            return { 'padding-left': '34px' };
          }
          return null;
        }
      }
    ];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.loadData();
  }

  loadData() {
    let params = { id: this.selectedDeviceIds };
    this.rowData$ = this.registersService.getDeviceTemplateGroups(params);

    this.rowData$.subscribe((x) => {
      if (!x.allHaveTemplate) {
        this.templateError = true;
      }
      this.allRowData = x.schedulableRegistersTypes;
      this.rowData = x.schedulableRegistersTypes;
      this.totalCount = this.rowData ? this.rowData.length : 0;
    });
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onConfirm() {
    let registerTypes = this.gridApi.getSelectedRows().map((row) => row.name);

    this.noRegisterSelected = !this.selectedRegister;
    if (this.noRegisterSelected) {
      return;
    }

    let startDate =
      moment(this.form.controls.startDate.value, dateDisplayFormat).format(dateOnlyServerFormat) +
      ' ' +
      this.form.controls.startTime.value +
      ':00';
    let endDate =
      moment(this.form.controls.endDate.value, dateDisplayFormat).format(dateOnlyServerFormat) +
      ' ' +
      this.form.controls.endTime.value +
      ':00';

    const values = this.fillData(registerTypes, startDate, endDate);
    const request = this.myGridService.readMeterValues(values);
    const successMessage = $localize`Read Meter Objects succeeded!`;

    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.modal.close();
        const options: NgbModalOptions = {
          size: 'md'
        };
        const modalRef = this.modalService.open(StatusJobComponent, options);
        modalRef.componentInstance.requestId = result.requestId;
        modalRef.componentInstance.jobName = this.actionName;
      },
      () => {} // error
    );
  }

  fillData(registerTypes: SchedulableRegistersTypes[], dateFrom: string, dateTo: string): IActionRequestAddTemplate {
    const formData: IActionRequestAddTemplate = {
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds,
      templateId: this.selectedRegister.templateId,
      from: dateFrom,
      to: dateTo,
      groups: registerTypes
    };
    return formData;
  }

  onDismiss() {
    this.modal.dismiss();
  }

  selectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();

    this.selectedRegister = null;
    this.noRegisterSelected = false;
    if (selectedRows.length > 0) {
      this.selectedRegister = selectedRows[0];
    }
  }

  insertedValue($event: string) {
    if ($event !== undefined) {
      this.searchTextEmpty = $event.length === 0;
    } else {
      this.searchTextEmpty = true;
    }
    this.searchChange($event);
  }

  isRowSelectable(rowNode) {
    return rowNode.data.isSelectable;
  }

  searchChange(search: string = '') {
    const searchToLower = search.toLowerCase();
    const rowsFiltered: SchedulableRegistersTypes[] = _.filter(this.allRowData, (data) => data.name.toLowerCase().includes(searchToLower));

    this.rowData = rowsFiltered.sort((a, b) => {
      return +a.isSelectable > +b.isSelectable ? -1 : a.name < b.name ? -1 : 1;
    });

    this.totalCount = this.rowData.length;
  }

  closePopover() {
    this.popover.close();
  }
}

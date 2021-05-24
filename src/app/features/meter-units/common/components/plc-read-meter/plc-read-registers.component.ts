import { IActionRequestAddTemplate } from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    private registersService: RegistersSelectService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      // [this.registersProperty]: [null, [Validators.required]],
      [this.startDateProperty]: [null, Validators.required],
      [this.endDateProperty]: [null, Validators.required],
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
    this.rowData$ = this.registersService.getDeviceSchedulableRegisters(params);

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
    // TODO CHECK DATE TIME FORMAT FOR BE (POST REQUEST)
    console.log(this.form);
    this.noRegisterSelected = !this.selectedRegister;
    if (this.noRegisterSelected) {
      return;
    }

    const values = this.fillData();
    const request = this.myGridService.postMyGridAddDeviceTemplate(values);
    const successMessage = $localize`Adding template to device(s) succeeded!`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.modal.close();
      },
      () => {} // error
    );
  }

  // TODO when backend
  fillData(): IActionRequestAddTemplate {
    const formData: IActionRequestAddTemplate = {
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds,
      templateId: this.selectedRegister.templateId
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

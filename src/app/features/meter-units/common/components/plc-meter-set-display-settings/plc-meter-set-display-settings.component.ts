import { IActionRequestSetDisplaySettings } from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { DisplayGroup, DisplayRegisterDefinition } from 'src/app/core/repository/interfaces/templating/display-group.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  RequestSetLimiter,
  LimiterDefinitions,
  ResponseCommonRegisterGroup
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { PlcMeterSetLimiterService } from '../../services/plc-meter-set-limiter.service';
import { RegisterGroup } from '../../../registers/interfaces/data-processing-request.interface';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { PlcMeterSetDisplaySettingsGridService } from '../../services/plc-meter-set-display-settings-grid.service';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

@Component({
  selector: 'app-plc-meter-set-display-settings',
  templateUrl: './plc-meter-set-display-settings.component.html'
})
export class PlcMeterSetDisplaySettingsComponent implements OnInit {
  form: FormGroup;
  deviceIdsParam = [];
  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];
  excludeIdsParam?: string[];
  actionRequest: IActionRequestParams;

  groupList$: Codelist<string>[];
  public selectedRowsCount: number;

  displayGroups: DisplayGroup[];

  selectedGroup: Codelist<string>;

  registerList: DisplayRegisterDefinition[];

  public gridApi;

  selectedRegisters: DisplayRegisterDefinition[] = [];
  noRegisterSelected = false;

  public modules: Module[] = AllModules;
  requiredText = $localize`At least one register must be selected`;
  columnDefs = [];

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private plcMeterSetDisplaySettingsGridService: PlcMeterSetDisplaySettingsGridService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.groupListProperty]: [this.selectedGroup, [Validators.required]]
      }
      // {
      //   validators: [this.atLeastOneValue]
      // }
    );
  }

  ngOnInit() {
    this.columnDefs = this.plcMeterSetDisplaySettingsGridService.setGridDefaultColumns();

    this.myGridService
      .getCommonRegisterGroup({
        deviceIds: this.deviceIdsParam,
        filter: this.filterParam,
        search: this.searchParam,
        excludeIds: this.excludeIdsParam,
        type: '11'
      })
      .subscribe((result: DisplayGroup[]) => {
        if (result && result.length > 0) {
          this.displayGroups = result;
          this.initGroupList();

          this.form = this.createForm();
        }
      });
  }

  initGroupList() {
    this.groupList$ = [];
    this.displayGroups.map(dg => this.groupList$.push({ id: dg.displayGroupId, value: dg.name }));
    this.selectedGroup = this.groupList$[0];
    this.setRegisterList();
  }

  fillData(): IActionRequestSetDisplaySettings {
    const displayRegisters: string[] = [];
    this.selectedRegisters.map(r => displayRegisters.push(r.name));

    const data: IActionRequestSetDisplaySettings = {
      displayGroupName: this.selectedGroup.value,
      displayRegisters,
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds
    };

    return data;
  }

  // properties - START

  get groupListProperty() {
    return 'groupList';
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onConfirm() {
    this.noRegisterSelected = this.selectedRegisters.length === 0;
    if (this.noRegisterSelected) {
      return;
    }

    const values = this.fillData();
    const request = this.myGridService.setDisplaySettings(values);
    const successMessage = $localize`Meter Unit(s) Display settings set successfuly.`;

    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        this.modal.close();
      },
      () => {} // error
    );
  }

  selectedValueChanged($event: any) {
    this.noRegisterSelected = false;
    this.selectedGroup = $event;
    this.selectedRegisters = [];
    this.setRegisterList();
  }

  setRegisterList() {
    this.registerList = this.displayGroups.find(d => d.displayGroupId === this.selectedGroup.id).displayRegisterDefinitions;

    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 10);
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  selectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();

    this.selectedRegisters = null;
    this.noRegisterSelected = false;
    if (selectedRows.length > 0) {
      this.selectedRegisters = selectedRows;
    }
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
}

import { IActionRequestSetDisplaySettings } from './../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  RequestSetLimiter,
  LimiterDefinitions,
  ResponseCommonRegisterGroup,
  RegisterDefinitions
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

  displayGroups: ResponseCommonRegisterGroup[];

  selectedGroup: Codelist<string>;

  registerListLeft: RegisterDefinitions[];
  registerListRight: RegisterDefinitions[] = [];

  public gridApiLeft;
  public gridApiRight;

  noRegisterSelected = false;

  public modules: Module[] = AllModules;
  requiredText = $localize`At least one register must be on the Selected registers list`;
  columnDefsLeft = [];
  columnDefsRight = [];

  noRowsTemplate = '<span>' + $localize`Drop available registers here.` + '</span>';

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
    this.columnDefsLeft = this.plcMeterSetDisplaySettingsGridService.setGridDefaultColumnsLeft();
    this.columnDefsRight = this.plcMeterSetDisplaySettingsGridService.setGridDefaultColumnsRight();

    this.myGridService
      .getCommonRegisterGroup({
        deviceIds: this.deviceIdsParam,
        filter: this.filterParam,
        search: this.searchParam,
        excludeIds: this.excludeIdsParam,
        type: '11'
      })
      .subscribe((result: ResponseCommonRegisterGroup[]) => {
        if (result && result.length > 0) {
          this.displayGroups = result;
          this.initGroupList();

          this.form = this.createForm();
        } else {
          this.displayGroups = [];
          this.initGroupList();

          this.form = this.createForm();
        }
      });
  }

  initGroupList() {
    this.groupList$ = [];
    this.displayGroups.map(dg => this.groupList$.push({ id: dg.groupId, value: dg.name }));
    this.selectedGroup = this.groupList$[0];
    this.setRegisterList();
  }

  fillData(): IActionRequestSetDisplaySettings {
    const displayRegisters: string[] = [];
    this.registerListRight.map(r => displayRegisters.push(r.name));

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
    this.noRegisterSelected = this.registerListRight.length === 0;
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
    this.setRegisterList();
  }

  setRegisterList() {
    if (!this.selectedGroup) {
      this.registerListLeft = [];
      this.registerListRight = [];
      return;
    }
    this.registerListLeft = this.displayGroups.find(d => d.groupId === this.selectedGroup.id).registerDefinitions;
    this.registerListRight = [];

    setTimeout(() => {
      this.gridApiLeft.sizeColumnsToFit();
      this.gridApiRight.sizeColumnsToFit();
    }, 10);
  }

  onLeftGridReady(params) {
    this.gridApiLeft = params.api;
  }

  onRightGridReady(params) {
    this.gridApiRight = params.api;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  gridDragOver(event) {
    const dragSupported = event.dataTransfer.types.length;

    if (dragSupported) {
      event.dataTransfer.dropEffect = 'copy';
      event.preventDefault();
    }
  }

  gridDrop(event, grid) {
    event.preventDefault();

    const userAgent = window.navigator.userAgent;
    const isIE = userAgent.indexOf('Trident/') >= 0;
    const jsonData = event.dataTransfer.getData(isIE ? 'text' : 'application/json');
    const data = JSON.parse(jsonData);

    const selectedRegDefId = data.registerDefinitionId;

    this.registerListRight = this.registerListRight.filter(r => r.registerDefinitionId !== selectedRegDefId);
    this.registerListLeft = this.registerListLeft.filter(r => r.registerDefinitionId !== selectedRegDefId);

    const y = event.layerY;
    const itemHeight = this.gridApiLeft.getSizesForCurrentTheme().rowHeight;

    if (grid === 'left') {
      const insertIndex = Math.max(Math.min(Math.floor(y / itemHeight), this.registerListLeft.length), 0);
      this.registerListLeft.splice(insertIndex, 0, data);
    } else {
      const insertIndex = Math.max(Math.min(Math.floor(y / itemHeight), this.registerListRight.length), 0);
      this.registerListRight.splice(insertIndex, 0, data);
    }

    this.refreshGrids();
  }

  refreshGrids() {
    this.gridApiLeft.setRowData(this.registerListLeft);
    this.gridApiRight.setRowData(this.registerListRight);

    setTimeout(() => {
      this.gridApiLeft.sizeColumnsToFit();
      this.gridApiRight.sizeColumnsToFit();
    }, 10);
  }
}
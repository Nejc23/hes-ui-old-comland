import { IActionRequestSetDisplaySettings } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ResponseCommonRegisterGroup, RegisterDefinitions } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { PlcMeterSetDisplaySettingsGridService } from '../../services/plc-meter-set-display-settings-grid.service';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { TranslateService } from '@ngx-translate/core';

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
  requiredText = this.translate.instant('PLC-METER.AT-LEAST-ONE-REGISTER');
  columnDefsLeft = [];
  columnDefsRight = [];

  noRowsTemplate = '<span>' + this.translate.instant('PLC-METER.DROP-AVAILABLE-REGISTERS') + '</span>';

  dataLoaded = false;
  actionName = this.translate.instant('PLC-METER.SET-DISPLAY-SETTINGS');

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private plcMeterSetDisplaySettingsGridService: PlcMeterSetDisplaySettingsGridService,
    private modalService: ModalService,
    private translate: TranslateService
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
        this.dataLoaded = true;
      });
  }

  initGroupList() {
    this.groupList$ = [];
    this.displayGroups.map((dg) => this.groupList$.push({ id: dg.groupId, value: dg.name }));
    this.selectedGroup = this.groupList$[0];
    this.setRegisterList();
  }

  fillData(): IActionRequestSetDisplaySettings {
    const displayRegisters: string[] = [];
    this.registerListRight.map((r) => displayRegisters.push(r.name));

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
    const successMessage = this.translate.instant('PLC-METER.METER-UNITS-DISPLAY-SETTINGS');

    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.modal.close();

        const options: NgbModalOptions = {
          size: 'md'
        };
        const modalRef = this.modalService.open(StatusJobComponent, options);
        modalRef.componentInstance.requestId = result.requestId;
        modalRef.componentInstance.jobName = this.actionName;
        modalRef.componentInstance.deviceCount = result.deviceIds.length;
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
    this.registerListLeft = this.displayGroups.find((d) => d.groupId === this.selectedGroup.id).registerDefinitions;
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

    this.registerListRight = this.registerListRight.filter((r) => r.registerDefinitionId !== selectedRegDefId);
    this.registerListLeft = this.registerListLeft.filter((r) => r.registerDefinitionId !== selectedRegDefId);

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

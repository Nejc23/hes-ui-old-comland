import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { TemplatesList } from 'src/app/core/repository/interfaces/auto-templates/templates-list.interface';
import { IActionRequestAddTemplate, IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { PlcMeterJobsRegistersGridService } from '../../services/plc-meter-jobs-registers-grid.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plc-meter-jobs-registers',
  templateUrl: 'plc-meter-jobs-registers.component.html'
})
export class PlcMeterJobsRegistersComponent implements OnInit {
  public selectedRowsCount: number;

  noRegisters = false;
  registersRequiredText = this.translate.instant('COMMON.REQUIRED-FIELD');
  loading = false;
  form: FormGroup;

  rowData$: Observable<TemplatesList[]>;
  rowData: TemplatesList[];

  columnDefs = [];
  public gridApi;
  public totalCount;

  public modules: Module[] = AllModules;

  requiredText = this.translate.instant('COMMON.ONE-REGISTER-SELECTED');
  noRegisterSelected = false;
  selectedRegister: TemplatesList = null;

  actionRequest: IActionRequestParams;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private serviceRepository: AutoTemplatesService,
    private plcMeterJobsRegistersGridService: PlcMeterJobsRegistersGridService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      // [this.registersProperty]: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.columnDefs = this.plcMeterJobsRegistersGridService.setGridDefaultColumns();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.loadData();
  }

  loadData() {
    this.rowData$ = this.serviceRepository.getTemplates();
    this.rowData$.subscribe((x) => {
      this.rowData = x;
      this.totalCount = this.rowData ? this.rowData.length : 0;
    });
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onConfirm() {
    this.noRegisterSelected = !this.selectedRegister;
    if (this.noRegisterSelected) {
      return;
    }

    const values = this.fillData();
    const request = this.myGridService.postMyGridAddDeviceTemplate(values);
    const successMessage = this.translate.instant('COMMON.ADDING-TEMPLATE');
    this.loading = true;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.modal.close();
        this.loading = false;
      },
      () => {
        this.loading = false;
      } // error
    );
  }

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
}

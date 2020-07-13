import { Component, OnInit, OnDestroy } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AllModules, Module, GridApi } from '@ag-grid-enterprise/all-modules';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { TemplatesList } from 'src/app/core/repository/interfaces/auto-templates/templates-list.interface';
import { AutoTemplateRuleList, AutoTemplateRule } from 'src/app/core/repository/interfaces/auto-templates/auto-template-rule.interface';
import { AutoTemplateList } from 'src/app/core/repository/interfaces/auto-templates/auto-templates-list.interface';
import { AutoTemplatesStaticTextService } from '../services/auto-templates-static-text.service';
import { AutoTemplatesGridService } from '../services/auto-templates-grid.service';
import { Rule } from 'src/app/core/repository/interfaces/auto-templates/rule.interface';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { AutoTemplatesGridEventEmitterService } from '../services/auto-templates-grid-event-emitter.service';
import { GridRequiredCellEditorComponent } from './grid-custom-components/grid-required-cell-editor.component';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';

@Component({
  selector: 'app-auto-templates',
  templateUrl: './auto-templates.component.html'
})
export class AutoTemplatesComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllModules;

  public columnDefs;
  public defaultColDef;
  public detailCellRendererParams;
  public rowData: AutoTemplateList[];

  public context;
  public editType;
  public frameworkComponents;
  public gridOptions;

  public headerTitle = this.staticTextService.title;
  private form: FormGroup;

  private expadedTemplates: string[] = [];

  constructor(
    public staticTextService: AutoTemplatesStaticTextService,
    private service: AutoTemplatesGridService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private serviceRepository: AutoTemplatesService,
    private event: AutoTemplatesGridEventEmitterService,
    private toast: ToastNotificationService,
    private i18n: I18n
  ) {
    this.form = this.createForm();

    // grid settings
    this.frameworkComponents = this.service.setFrameworkComponents();
    this.context = { componentParent: this };
    this.gridOptions = this.service.setGridOptions();
    this.columnDefs = this.service.setGridMasterDefaultColumns();
    this.detailCellRendererParams = {
      detailGridOptions: {
        context: { forma: this.form, componentParent: this },
        rowHeight: 60,
        frameworkComponents: this.setFrameworkComponentsDetail(),
        editType: 'fullRow',
        suppressClickEdit: 'true',
        columnDefs: this.service.setGridDetailDefaultColumns(),
        defaultColDef: { flex: 1, editable: true },
        onRowEditingStopped: params => {
          this.rowEditingStopped(params);
        },
        onGridReady: params => {
          params.api.setDomLayout('autoHeight');
        },
        getRowStyle: () => {
          // TODO use css class !!!
          return { border: 0 };
        }
      },
      getDetailRowData: params => {
        params.successCallback(params.data.rules);
      }
    };
  }

  rowEditingStopped($event) {
    this.event.edit(1);
    if ($event.data.autoTemplateRuleId == 'new') {
      this.rowData.forEach(element => {
        const index = element.rules
          .map(x => {
            return x.autoTemplateRuleId;
          })
          .indexOf('new');
        if (index > -1) {
          element.rules.splice(index, 1);
          this.rowData = [...this.rowData];
        }
      });
    }
  }

  private setFrameworkComponentsDetail() {
    return {
      gridRequiredCellEditorComponent: GridRequiredCellEditorComponent
    };
  }

  // form for edit
  createForm(): FormGroup {
    return this.formBuilder.group({
      ['ruleId']: ['', [Validators.required]],
      ['obis']: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
          )
        ]
      ],
      ['regex']: ['', [Validators.required]],
      ['templateId']: [0]
    });
  }

  onFirstDataRendered(params) {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getData();
  }

  onRowGroupOpened($event) {
    if ($event.node.expanded) {
      if (this.expadedTemplates.indexOf($event.data.templateId) === -1) {
        this.expadedTemplates.push($event.data.templateId);
      }
    } else {
      const index = this.expadedTemplates.indexOf($event.data.templateId);
      if (index > -1) {
        const rules = this.rowData.find(x => x.templateId == $event.data.templateId);

        if (rules != null) {
          const index2 = rules.rules.map(e => e.autoTemplateRuleId).indexOf('new');
          if (index2 > -1) {
            this.rowData[index].rules.splice(index2, 1);
            this.rowData = [...this.rowData];
          }
        }
      }
    }
  }

  ngOnInit() {}

  getData() {
    this.serviceRepository.getTemplates().subscribe(templates => {
      if (templates != null && templates.length > 0) {
        this.serviceRepository.getAutoTemplateRules().subscribe(rules => {
          this.rowData = this.prepareData(templates, rules);
        });
      }
    });
  }

  private prepareData(templates: TemplatesList[], rules: AutoTemplateRuleList[]) {
    const rows: AutoTemplateList[] = [];
    templates.forEach(template => {
      let rulesNew: AutoTemplateRule[] = [];
      rules.forEach(r => {
        if (r.templateId == template.templateId) {
          rulesNew = r.autoTemplateRules;
        }
      });

      const templateNew: AutoTemplateList = {
        templateId: template.templateId,
        name: template.name,
        rules: rulesNew
      };

      rows.push(templateNew);
      this.ExpandTemplateRows();
    });
    return rows;
  }

  private ExpandTemplateRows() {
    const that = this.gridApi;
    if (this.expadedTemplates != null && this.expadedTemplates.length > 0) {
      this.expadedTemplates.forEach(element => {
        this.gridApi.forEachNode(node => {
          if (node.data.templateId.localeCompare(element) === 0) {
            setTimeout(() => {
              that.getDisplayedRowAtIndex(node.rowIndex).setExpanded(true);
            }, 0);
          }
        });
      });
    }
  }

  AddNewItem(templateId, rowIndex, gridApi: GridApi) {
    // if not new row is afdded jet add new else return
    let alreadyNewRow = false;
    this.rowData.forEach(element => {
      const rule = element.rules.find(x => x.autoTemplateRuleId == 'new');
      if (rule != null) {
        this.toast.infoToast(this.i18n('Aready added empty row for new item!'));
        alreadyNewRow = true;
      }
    });
    if (alreadyNewRow) {
      return;
    }

    this.rowData.forEach(element => {
      if (element.templateId.localeCompare(templateId) === 0) {
        element.rules.splice(0, 0, {
          autoTemplateRuleId: 'new',
          obis: '',
          regex: ''
        });
      }
    });

    this.form.get('templateId').setValue(templateId);
    this.rowData = [...this.rowData];

    // alert('Parent Component Method from ' + templateId + '!');
    setTimeout(() => {
      this.gridApi.getDisplayedRowAtIndex(rowIndex).setExpanded(true);

      gridApi.forEachDetailGridInfo(detailGridApi => {
        console.log(detailGridApi.api);
        detailGridApi.api.setFocusedCell(0, 'obis');
        detailGridApi.api.startEditingCell({
          rowIndex: 0,
          colKey: 'obis'
        });
      });
    }, 100);
  }

  saveForm(gridApi: GridApi, params: any) {
    let request: Observable<any> = null;
    let successMessage = '';

    if (this.form != null && this.form.get('ruleId').value.localeCompare('new') === 0) {
      const values = this.fillDataNewRule();
      request = this.serviceRepository.createAutoTemplateRule(values);
      successMessage = 'Rule was added successfully';
    } else {
      const values = this.fillDataEditRule();
      request = this.serviceRepository.updateAutoTemplateRule(values);
      successMessage = 'Rule was updated successfully';
    }
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        gridApi.stopEditing();
        this.getData();
      },
      () => {} // error
    );
  }

  fillDataNewRule(): Rule {
    const formData: Rule = {
      obis: this.form.get('obis').value,
      regex: this.form.get('regex').value,
      templateId: this.form.get('templateId').value
    };

    return formData;
  }

  fillDataEditRule(): AutoTemplateRule {
    const formData: AutoTemplateRule = {
      obis: this.form.get('obis').value,
      regex: this.form.get('regex').value,
      autoTemplateRuleId: this.form.get('ruleId').value
    };

    return formData;
  }

  editForm(id: string) {
    this.rowData.forEach(element => {
      const rule = element.rules.find(x => x.autoTemplateRuleId == id);
      if (rule != null) {
        this.form.get('templateId').setValue(element.templateId);
        return;
      }
    });
  }

  deleteForm(id: string) {
    const request = this.serviceRepository.deleteAutoTemplateRule(id);
    this.formUtils.deleteForm(request, this.i18n('Selected item deleted')).subscribe(
      (response: any) => {
        this.getData();
      },
      () => {}
    );
  }

  cancelForm(grid: GridApi) {
    grid.stopEditing();
  }

  ngOnDestroy() {}
}

import { AutoTemplateList } from './../../../../core/repository/interfaces/auto-templates/auto-templates-list.interface';
import { ActivatedRoute } from '@angular/router';
import { AutoTemplatesGridService } from '../services/auto-template-grid.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AllModules, Module, GridApi } from '@ag-grid-enterprise/all-modules';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { TemplatesList } from 'src/app/core/repository/interfaces/auto-templates/templates-list.interface';
import { AutoTemplateRuleList, AutoTemplateRule } from 'src/app/core/repository/interfaces/auto-templates/auto-template-rule.interface';
import { Rule } from 'src/app/core/repository/interfaces/auto-templates/rule.interface';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { AutoTemplatesStaticTextService } from '../services/auto-template-static-text.service';
import { AutoTemplatesGridEventEmitterService } from '../services/auto-template-grid-event-emitter.service';
import { GridRequiredCellEditorComponent } from './grid-custom-components/grid-required-cell-editor.component';
import { NgbTypeaheadWindow } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Component({
  selector: 'app-auto-templates',
  templateUrl: './auto-template.component.html'
})
export class AutoTemplateComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllModules;

  public columnDefs;
  public defaultColDef;
  public rowData: AutoTemplateRule[];

  public cellRendererParams;

  public context;
  public editType;
  public frameworkComponents;
  public gridOptions;
  getRowHeight;

  public headerTitle = this.staticTextService.title;
  public form: FormGroup;

  private expadedTemplates: string[] = [];

  private templateId: string;

  jobList: Codelist<string>[];
  public selectedJob: Codelist<string>;

  // get jobsProperty() {
  //   return nameOf<DcuForm>(o => o.type);
  // }

  constructor(
    public staticTextService: AutoTemplatesStaticTextService,
    private service: AutoTemplatesGridService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private serviceRepository: AutoTemplatesService,
    private event: AutoTemplatesGridEventEmitterService,
    private toast: ToastNotificationService,
    private modalService: ModalService,
    public i18n: I18n,
    private route: ActivatedRoute
  ) {
    this.form = this.createForm();

    // grid settings
    this.frameworkComponents = this.service.setFrameworkComponents();
    this.context = { forma: this.form, componentParent: this };
    this.gridOptions = this.service.setGridOptions();
    this.getRowHeight = params => {
      if (params.node && params.node.detail) {
        const offset = 65;
        const allDetailRowHeight = params.data.rules.length * 1.7 * params.api.getSizesForCurrentTheme().rowHeight;
        const gridSizes = params.api.getSizesForCurrentTheme();
        return allDetailRowHeight + gridSizes.headerHeight + offset;
      }
    };
    this.columnDefs = this.service.setGridDefaultColumns();

    this.cellRendererParams = {
      context: { forma: this.form, componentParent: this },
      // rowHeight: 60,
      // frameworkComponents: this.setFrameworkComponentsDetail(),
      editType: 'fullRow',
      suppressClickEdit: 'true',
      suppressCellSelection: true,
      columnDefs: this.service.setGridDefaultColumns(),
      onRowEditingStopped: params => {
        this.rowEditingStopped(params);
      },
      onGridReady: params => {
        params.api.setDomLayout('autoHeight');
      },
      // getRowStyle: () => {
      //   // TODO use css class !!!
      //   return { border: 0 };
      // },
      defaultColDef: {
        sortable: false,
        resizable: false,
        checkboxSelection: false,
        filter: false,
        flex: 1,
        editable: true
      },
      getDetailRowData: params => {
        params.successCallback(params.data.rules);
      }
    };
  }

  rowEditingStopped($event) {
    this.event.edit(1);
    // if ($event.data.autoTemplateRuleId === 'new') {
    //   this.rowData.forEach(element => {
    //     const index = element.rules
    //       .map(x => {
    //         return x.autoTemplateRuleId;
    //       })
    //       .indexOf('new');
    //     if (index > -1) {
    //       element.rules.splice(index, 1);
    //       this.rowData = [...this.rowData];
    //     }
    //   });
    // }
  }

  // private setFrameworkComponentsDetail() {
  //   return {
  //     gridRequiredCellEditorComponent: GridRequiredCellEditorComponent
  //   };
  // }

  // form for edit
  createForm(): FormGroup {
    return this.formBuilder.group({
      ['ruleId']: ['', [Validators.required]],
      ['propertyName']: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
          )
        ]
      ],
      ['propertyValue']: ['', [Validators.required]],
      ['templateId']: [0],
      ['selectedJob']: [null]
    });
  }

  onFirstDataRendered(params) {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getData();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.templateId = params.templateId;
    });

    this.jobList = [
      { id: 'id1', value: 'value1' },
      { id: 'id2', value: 'value2' },
      { id: 'id3', value: 'value3' }
    ];
  }

  getData() {
    // this.serviceRepository.getAutoTemplateRulesForTemplateId(this.templateId).subscribe(template => {
    //     this.rowData = template;
    // });

    this.rowData =
      // templateId: 'TemplateId',
      // name: 'TemplateName',
      // rules:
      [
        {
          autoTemplateRuleId: 'autoTemplateRuleId1',
          propertyName: '1.0.0.2.3.3',
          propertyValue: 'PropertyValue1'
        },
        {
          autoTemplateRuleId: 'autoTemplateRuleId2',
          propertyName: '1.0.0.2.3.4',
          propertyValue: 'PropertyValue2'
        }
      ];

    console.log('rowData', this.rowData);

    // this.serviceRepository.getTemplates().subscribe(templates => {
    //   this.rowData = this.prepareData(templates, []);
    //   if (templates != null && templates.length > 0) {
    //     this.serviceRepository.getAutoTemplateRules().subscribe(rules => {
    //       console.log('templates', templates);
    //       this.rowData = this.prepareData(templates, rules);
    //     });
    //   }
    // });
  }

  // private prepareData(template: template, rules: AutoTemplateRuleList[]) {
  //   const rows: AutoTemplateList[] = [];
  //   templates.forEach(template => {
  //     let rulesNew: AutoTemplateRule[] = [];
  //     rules.forEach(r => {
  //       if (r.templateId === template.templateId) {
  //         rulesNew = r.autoTemplateRules;
  //       }
  //     });

  //     const templateNew: AutoTemplateList = {
  //       templateId: template.templateId,
  //       name: template.name,
  //       rules: rulesNew
  //     };

  //     rows.push(templateNew);
  //     this.expandTemplateRows();
  //   });
  //   return rows;
  // }

  private prepareData(templates: TemplatesList[], rules: AutoTemplateRuleList[]) {
    const rows: AutoTemplateList[] = [];
    templates.forEach(template => {
      let rulesNew: AutoTemplateRule[] = [];
      rules.forEach(r => {
        if (r.templateId === template.templateId) {
          rulesNew = r.autoTemplateRules;
        }
      });

      const templateNew: AutoTemplateList = {
        templateId: template.templateId,
        name: template.name,
        rules: rulesNew
      };

      rows.push(templateNew);
      this.expandTemplateRows();
    });
    return rows;
  }

  private expandTemplateRows() {
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

  addNewRuleItem() {
    // if not new row is added jet add new else return

    let alreadyNewRow = false;
    this.rowData.forEach(element => {
      if (!alreadyNewRow) {
        const rule = this.rowData.find(x => x.autoTemplateRuleId === 'new');
        if (rule != null) {
          this.toast.infoToast(this.i18n('Aready added empty row for new item!'));
          alreadyNewRow = true;
        }
      }
    });
    if (alreadyNewRow) {
      return;
    }

    this.rowData.splice(0, 0, {
      autoTemplateRuleId: 'new',
      propertyName: '',
      propertyValue: ''
    });

    this.rowData = [...this.rowData];

    // alert('Parent Component Method from ' + templateId + '!');
    setTimeout(() => {
      // this.gridApi.getDisplayedRowAtIndex(rowIndex).setExpanded(true);

      this.gridApi.setFocusedCell(0, 'propertyName');
      this.gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'propertyName'
      });
    }, 100);
  }

  saveForm(gridApi: GridApi, params: any) {
    console.log('in saveForm');
    console.log('this.form', this.form);
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
      propertyName: this.form.get('propertyName').value,
      propertyValue: this.form.get('propertyValue').value,
      templateId: this.form.get('templateId').value
    };

    return formData;
  }

  fillDataEditRule(): AutoTemplateRule {
    const formData: AutoTemplateRule = {
      propertyName: this.form.get('propertyName').value,
      propertyValue: this.form.get('propertyValue').value,
      autoTemplateRuleId: this.form.get('ruleId').value
    };

    return formData;
  }

  editForm(id: string) {
    // let found = true;
    // this.rowData.forEach(element => {
    //   if (!found) {
    //     // const rule = element.find(x => x.autoTemplateRuleId === id);
    //     if (element.autoTemplateRuleId === id) {
    //       this.form.get('templateId').setValue(element.templateId);
    //       found = true;
    //     }
    //   }
    // });
  }

  deleteForm(id: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.i18n('Delete');
    response = this.serviceRepository.deleteAutoTemplateRule(id);
    component.btnConfirmText = operation;
    component.modalTitle = this.i18n('Confirm delete');
    component.modalBody = this.i18n('Do you want to delete rule?');

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        response.subscribe(
          value => {
            this.getData();
            this.toast.successToast(this.i18n(`Rule deleted!`));
          },
          e => {
            this.toast.errorToast(this.i18n(`Server error!`));
          }
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );

    /*
    messageStarted = this.i18n(`Scheduler job deleted!`);
    messageServerError = this.i18n(`Server error!`);

    const request = this.serviceRepository.deleteAutoTemplateRule(id);
    this.formUtils.deleteForm(request, this.i18n('Selected item deleted')).subscribe(
      (response: any) => {
        this.getData();
      },
      () => {}
    );*/
  }

  cancelForm(grid: GridApi) {
    console.log('im in cancelForm');
    grid.stopEditing();
  }

  addJob() {}

  cellMouseOver(event) {
    this.event.eventEmitterRowMouseOver.emit(event.rowIndex);
  }

  cellMouseOut(event) {
    this.event.eventEmitterRowMouseOut.emit(event.rowIndex);
  }

  rowSelected() {
    console.log('row selected');
  }

  ngOnDestroy() {}
}

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
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { CodelistExt } from 'src/app/shared/repository/interfaces/codelists/codelist-ext.interface';

@Component({
  selector: 'app-auto-templates',
  templateUrl: './auto-template.component.html'
})
export class AutoTemplateComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;

  private gridApiJobs;
  private gridColumnApiJobs;

  public modules: Module[] = AllModules;

  public columnDefs;
  public columnDefsJobs;
  public defaultColDef;
  public defaultColDefJobs;
  public rowData: AutoTemplateRule[];
  public rowDataJobs: SchedulerJobsList[];
  public cellRendererParams;
  public cellRendererParamsJobs;

  public context;
  public editType;
  public frameworkComponents;
  public frameworkComponentsJobs;
  public gridOptions;
  getRowHeight;

  public headerTitle = this.staticTextService.title;
  public form: FormGroup;

  private expadedTemplates: string[] = [];

  private templateId: string;

  jobList$: Observable<CodelistExt<string>[]>;
  public selectedJob: Codelist<string>;
  hide = false;
  activeElement: TemplatesList = { templateId: '', name: '' };

  templates: TemplatesList[];
  // get jobsProperty() {
  //   return nameOf<DcuForm>(o => o.type);
  // }

  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: []
  };

  constructor(
    public staticTextService: AutoTemplatesStaticTextService,
    private service: AutoTemplatesGridService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private serviceRepository: AutoTemplatesService,
    private serviceJob: JobsService,
    private event: AutoTemplatesGridEventEmitterService,
    private event2: AutoTemplatesGridEventEmitterService,
    private codelistService: CodelistRepositoryService,
    private toast: ToastNotificationService,
    private modalService: ModalService,
    public i18n: I18n,
    private route: ActivatedRoute
  ) {
    this.form = this.createForm();

    // grid settings
    this.frameworkComponents = this.service.setFrameworkComponents();
    this.frameworkComponentsJobs = this.service.setFrameworkComponentsJobs();
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
    this.columnDefsJobs = this.service.setGridDefaultColumnsJobs();

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

    this.cellRendererParamsJobs = {
      context: { forma: this.form, componentParent: this },
      editType: 'fullRow',
      suppressClickEdit: 'true',
      suppressCellSelection: true,
      columnDefs: this.service.setGridDefaultColumnsJobs(),
      onRowEditingStopped: params => {
        this.rowEditingStopped(params);
      },
      onGridReady: params => {
        params.api.setDomLayout('autoHeight');
      },

      defaultColDefJobs: {
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

  click() {
    this.hide = !this.hide;
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
  onFirstDataRenderedJobs(params) {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getData();
  }

  onGridReadyJobs(params) {
    this.gridApiJobs = params.api;
    this.gridColumnApiJobs = params.columnApi;
    this.gridApiJobs.sizeColumnsToFit();
    window.onresize = () => {
      this.gridApiJobs.sizeColumnsToFit();
    };
    this.getDataJobs();
  }

  onSelect(val) {
    val.active = true;
    this.activeElement = val;

    this.getData();
    this.getDataJobs();
  }
  ngOnInit() {
    this.serviceRepository.getTemplates().subscribe(temp => {
      this.templates = temp;
    });

    /*  this.route.params.subscribe(params => {
      this.templateId = params.templateId;
    });*/

    this.jobList$ = this.codelistService.jobsReadingJobsCodelistCodes();
    /*
    this.jobList = [
      { id: 'id1', value: 'value1' },
      { id: 'id2', value: 'value2' },
      { id: 'id3', value: 'value3' }
    ];*/
  }

  getData() {
    try {
      if (this.activeElement.templateId.length > 0) {
        this.serviceRepository.getAutoTemplateRulesForTemplateId(this.activeElement.templateId).subscribe(
          template => {
            this.rowData = template.autoTemplateRules;
          },
          error => {
            console.log(error);
            this.rowData = [];
          }
        );
      } else {
        this.rowData = [];
      }
    } catch (err) {
      this.rowData = [];
    }
  }

  // get list of jobs by selected template
  getDataJobs() {
    try {
      if (this.activeElement.templateId.length > 0) {
        // get list of ids from service enerdat
        // TODO only sample
        const params = ['DF4626B5-C057-44CE-B32C-14247BD27EA0', '96289ED8-194F-4283-9A27-934AE935EB20'];

        this.serviceJob.getSchedulerJobsListByJobId(params).subscribe(
          jobs => {
            this.rowDataJobs = jobs;
          },
          error => {
            console.log(error);
            this.rowDataJobs = [];
          }
        );
      } else {
        this.rowDataJobs = [];
      }
    } catch (err) {
      this.rowDataJobs = [];
    }
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
    let request: Observable<any> = null;
    let successMessage = '';
    this.form.get('templateId').setValue(this.activeElement.templateId);

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
        this.getData();
        gridApi.stopEditing();
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
    let found = true;
    this.rowData.forEach(element => {
      if (!found) {
        // const rule = element.find(x => x.autoTemplateRuleId === id);
        if (element.autoTemplateRuleId === id) {
          this.form.get('templateId').setValue(this.activeElement.templateId);
          found = true;
        }
      }
    });
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

  removeForm(id: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.i18n('Remove');
    response = this.serviceRepository.deleteAutoTemplateRule(id);
    component.btnConfirmText = operation;
    component.modalTitle = this.i18n('Confirm remove');
    component.modalBody = this.i18n('Do you want to remove job from template?');

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        response.subscribe(
          value => {
            this.getData();
            this.toast.successToast(this.i18n(`Job removed!`));
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

  cellMouseOverJobs(event) {
    this.event2.eventEmitterRowMouseOverJobs.emit(event.rowIndex);
  }

  cellMouseOutJobs(event) {
    this.event2.eventEmitterRowMouseOutJobs.emit(event.rowIndex);
  }

  rowSelected() {
    console.log('row selected');
  }

  ngOnDestroy() {}
}

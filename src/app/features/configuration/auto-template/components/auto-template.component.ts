import { AllModules, GridApi, Module } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { AutoTemplateRule, AutoTemplateRuleList } from 'src/app/core/repository/interfaces/auto-templates/auto-template-rule.interface';
import { Rule } from 'src/app/core/repository/interfaces/auto-templates/rule.interface';
import { TemplatesList } from 'src/app/core/repository/interfaces/auto-templates/templates-list.interface';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { SchedulerJobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { CodelistExt } from 'src/app/shared/repository/interfaces/codelists/codelist-ext.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { AutoTemplatesGridService } from '../services/auto-template-grid.service';
import { AutoTemplateList } from './../../../../core/repository/interfaces/auto-templates/auto-templates-list.interface';
import { SidebarToggleService } from './../../../../shared/base-template/components/services/sidebar.service';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-auto-templates',
  templateUrl: './auto-template.component.html'
})
export class AutoTemplateComponent implements OnInit {
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
  public getRowHeight;
  public headerTitle = this.translate.instant('MENU.AUTO-TEMPLATES');
  public form: FormGroup;
  // jobList$: Observable<CodelistExt<string>[]>;
  allJobList: CodelistExt<string>[];
  jobList: CodelistExt<string>[];
  hide = false;
  activeElement: TemplatesList = { templateId: '', name: '' };
  templates: TemplatesList[];
  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: []
  };
  private gridApi;
  private gridColumnApi;
  private gridApiJobs;
  private expadedTemplates: string[] = [];
  // get jobsProperty() {
  //   return nameOf<DcuForm>(o => o.type);
  // }
  private templateId: string;

  constructor(
    private service: AutoTemplatesGridService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private serviceRepository: AutoTemplatesService,
    private serviceJob: SchedulerJobsService,
    private codelistService: CodelistRepositoryService,
    private toast: ToastNotificationService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private sidebarToggleService: SidebarToggleService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();

    // grid settings
    this.frameworkComponents = this.service.setFrameworkComponents();
    this.frameworkComponentsJobs = this.service.setFrameworkComponentsJobs();
    this.context = { forma: this.form, componentParent: this };
    this.gridOptions = this.service.setGridOptions();
    this.getRowHeight = (params) => {
      return 38;
    };
    this.columnDefs = this.service.setGridDefaultColumns();
    this.columnDefsJobs = this.service.setGridDefaultColumnsJobs();

    this.cellRendererParams = {
      context: { forma: this.form, componentParent: this },
      editType: 'fullRow',
      suppressClickEdit: 'true',
      suppressCellSelection: true,
      onRowEditingStopped: (params) => {
        this.rowEditingStopped(params);
      },
      onGridReady: (params) => {
        params.api.setDomLayout('autoHeight');
      },
      defaultColDef: {
        sortable: false,
        resizable: false,
        checkboxSelection: false,
        filter: false,
        flex: 1,
        editable: true
      },
      rowHeight: 50,

      getDetailRowData: (params) => {
        params.successCallback(params.data.rules);
      }
    };

    this.cellRendererParamsJobs = {
      context: { forma: this.form, componentParent: this },
      editType: 'fullRow',
      suppressClickEdit: 'true',
      suppressCellSelection: true,
      columnDefs: this.service.setGridDefaultColumnsJobs(),
      onRowEditingStopped: (params) => {
        this.rowEditingStopped(params);
      },
      onGridReady: (params) => {
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
      getDetailRowData: (params) => {
        params.successCallback(params.data.rules);
      }
    };
  }

  clickShowHideFilter() {
    this.hide = !this.hide;

    setTimeout(() => {
      this.gridApiJobs.sizeColumnsToFit();
      this.gridApi.sizeColumnsToFit();
    }, 50);

    window.onresize = () => {
      this.gridApiJobs.sizeColumnsToFit();
      this.gridApi.sizeColumnsToFit();
    };
  }

  rowEditingStopped($event) {
    this.gridApi.resetRowHeights();
    // this.event.edit(1);
    if ($event && $event.data && $event.data.autoTemplateRuleId === 'new') {
      const index = this.rowData.map((x) => x.autoTemplateRuleId).indexOf('new');
      if (index > -1) {
        this.rowData.splice(index, 1);

        // reset grid
        this.gridApi.setRowData(this.rowData);
      }
    }
  }

  // form for edit
  createForm(): FormGroup {
    return this.formBuilder.group({
      ['ruleId']: ['', [Validators.required]],
      ['propertyName']: ['', [Validators.required]],
      ['propertyValue']: ['', [Validators.required]],
      ['templateId']: [0],
      ['selectedJob']: [null, null]
    });
  }

  onFirstDataRendered(params) {}

  onFirstDataRenderedJobs(params) {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getData();

    window.onresize = () => {
      this.gridApiJobs.sizeColumnsToFit();
      this.gridApi.sizeColumnsToFit();
    };
  }

  onGridReadyJobs(params) {
    this.gridApiJobs = params.api;
    this.gridApiJobs.sizeColumnsToFit();
    window.onresize = () => {
      this.gridApiJobs.sizeColumnsToFit();
      this.gridApi.sizeColumnsToFit();
    };
  }

  onSelect(val) {
    if (val) {
      val.active = true;
      this.activeElement = val;
    } else {
      this.activeElement = null;
    }

    this.rowData = [];
    this.rowDataJobs = [];

    this.getData();
  }

  ngOnInit() {
    this.serviceRepository.getTemplates().subscribe((temp) => {
      this.templates = temp;
      this.templates = process(this.templates, {
        sort: [{ field: 'name', dir: 'asc' }]
      }).data;
      // select first template
      if (this.templates && this.templates.length > 0) {
        this.onSelect(this.templates[0]);
      } else {
        this.onSelect(null);
      }
    });

    this.codelistService.jobsReadingJobsCodelistCodes().subscribe((result) => {
      this.allJobList = result;
      this.setJobListWithoutAssignedJobs();
    });

    this.breadcrumbService.setPageName(this.headerTitle);

    this.sidebarToggleService.eventEmitterToggleMenu.subscribe(() => {
      setTimeout(() => {
        this.gridApiJobs.sizeColumnsToFit();
        this.gridApi.sizeColumnsToFit();
      }, 320);
    });
  }

  setJobListWithoutAssignedJobs() {
    if (this.allJobList) {
      const jobIds = this.getJobIds();
      this.jobList = this.allJobList
        .filter((j) => {
          return jobIds.indexOf(j.id) < 0;
        })
        .sort((j1, j2) => (j1.value > j2.value ? 1 : j2.value > j1.value ? -1 : 0));

      this.form.get('selectedJob').setValue(null);
    }
  }

  getData() {
    try {
      if (this.activeElement?.templateId.length > 0) {
        this.serviceRepository.getAutoTemplateRulesForTemplateId(this.activeElement.templateId).subscribe(
          (template) => {
            this.rowData = template.autoTemplateRules;
            this.gridApi.setRowData(this.rowData);
            this.setJobListWithoutAssignedJobs();
            this.getDataJobs();
          },
          (error) => {
            console.log(error);
            this.rowData = [];
            this.setJobListWithoutAssignedJobs();
          }
        );
      } else {
        this.rowData = [];
        this.setJobListWithoutAssignedJobs();
      }
    } catch (err) {
      this.rowData = [];
      this.setJobListWithoutAssignedJobs();
    }
  }

  // get list of jobs by selected template
  getDataJobs() {
    try {
      const jobIds = this.getJobIds();
      if (this.activeElement.templateId && jobIds.length > 0) {
        // get list of ids from service
        this.serviceJob.getSchedulerJobsListByJobId(jobIds).subscribe(
          (jobs) => {
            this.rowDataJobs = jobs;
            this.gridApiJobs.setRowData(this.rowDataJobs);
          },
          (error) => {
            console.log(error);
            this.rowDataJobs = [];
            this.gridApiJobs.setRowData(this.rowDataJobs);
          }
        );
      } else {
        this.rowDataJobs = [];
        this.gridApiJobs.setRowData(this.rowDataJobs);
      }
    } catch (err) {
      this.rowDataJobs = [];
      this.gridApiJobs.setRowData(this.rowDataJobs);
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

  addNewRuleItem() {
    // if not new row is added jet add new else return
    let alreadyNewRow = false;
    this.rowData.forEach((element) => {
      if (!alreadyNewRow) {
        const rule = this.rowData.find((x) => x.autoTemplateRuleId === 'new');
        if (rule != null) {
          this.toast.infoToast(this.translate.instant('TOOLS.AUTO-TEMPLATE.ALREADY-ADDED'));
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
      propertyValue: '',
      jobIds: []
    });

    this.gridApi.setRowData(this.rowData);

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
      successMessage = this.translate.instant('TOOLS.AUTO-TEMPLATE.RULE-ADDED');
    } else {
      const values = this.fillDataEditRule();
      request = this.serviceRepository.updateAutoTemplateRule(values);
      successMessage = this.translate.instant('TOOLS.AUTO-TEMPLATE.RULE-UPDATED');
    }

    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        this.getData();
        gridApi.stopEditing();
        params.api.resetRowHeights();
      },
      () => {
        params.api.resetRowHeights();
      }
    );
  }

  fillDataNewRule(): Rule {
    const formData: Rule = {
      propertyName: this.form.get('propertyName').value,
      propertyValue: this.form.get('propertyValue').value,
      templateId: this.form.get('templateId').value,
      jobIds: [...new Set(this.getJobIds())]
    };

    return formData;
  }

  fillDataEditRule(): AutoTemplateRule {
    const formData: AutoTemplateRule = {
      propertyName: this.form.get('propertyName').value,
      propertyValue: this.form.get('propertyValue').value,
      autoTemplateRuleId: this.form.get('ruleId').value,
      jobIds: [...new Set(this.getJobIds())]
    };

    return formData;
  }

  getJobIds(): string[] {
    if (!this.rowData || this.rowData.length === 0) {
      return [];
    }

    return this.rowData.map((item) => item.jobIds).flat();
  }

  editForm(id: string, rowIndex: number) {
    const cellDefs2 = this.gridApi.getEditingCells();

    if (cellDefs2.length === 0) {
      this.gridApi.setFocusedCell(rowIndex, 'propertyName');
      this.gridApi.startEditingCell({
        rowIndex,
        colKey: 'propertyName'
      });

      let found = false;
      this.rowData.forEach((element) => {
        if (!found) {
          // const rule = element.find(x => x.autoTemplateRuleId === id);
          if (element.autoTemplateRuleId === id) {
            this.form.get('templateId').setValue(this.activeElement.templateId);
            found = true;
          }
        }
      });
    }
  }

  deleteForm(id: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.DELETE');
    response = this.serviceRepository.deleteAutoTemplateRule(id);
    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.DELETE');
    component.modalBody = this.translate.instant('TOOLS.AUTO-TEMPLATE.DELETE-RULE');

    modalRef.result.then((data) => {
      // on close (CONFIRM)
      response.subscribe(
        (value) => {
          this.getData();

          // refresh grid
          this.gridApiJobs.setRowData(this.rowDataJobs);

          this.toast.successToast(this.translate.instant('TOOLS.AUTO-TEMPLATE.RULE-DELETED'));
        },
        (e) => {
          this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
        }
      );
    });
  }

  removeForm(jobId: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    const operation = this.translate.instant('COMMON.REMOVE');
    // response = this.serviceRepository.deleteAutoTemplateRule(id);
    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-REMOVE');
    component.modalBody = this.translate.instant('TOOLS.AUTO-TEMPLATE.REMOVE-FROM_RULES');

    modalRef.result.then(
      (data) => {
        this.removeJobIdFromAllRules(jobId);
      },
      () => {
        // on dismiss (CLOSE)
      }
    );
  }

  removeJobIdFromAllRules(jobId: string) {
    const batch: Observable<any>[] = [];

    for (const rule of this.rowData) {
      const jobIdLowerCase = jobId.toLowerCase();
      rule.jobIds = rule.jobIds.filter((j) => j.toLowerCase() !== jobIdLowerCase);

      batch.push(this.serviceRepository.updateAutoTemplateRule(rule));
    }

    const joinedObservables = forkJoin(batch);
    joinedObservables.subscribe(
      () => {
        this.getData();
        this.toast.infoToast(this.translate.instant('TOOLS.AUTO-TEMPLATE.JOB-REMOVED'));
      },
      (err) => {
        this.toast.errorToast(this.translate.instant('TOOLS.AUTO-TEMPLATE.JOB-FAILED'));
      }
    );
  }

  cancelForm(grid: GridApi) {
    grid.stopEditing();
    this.gridApi.resetRowHeights();
  }

  addJob() {
    const selectedJob: Codelist<string> = this.form.get('selectedJob').value;

    if (!selectedJob || !selectedJob.id) {
      this.toast.errorToast(this.translate.instant('TOOLS.AUTO-TEMPLATE.SELECT-JOB'));
    }

    this.addJobIdToAllRules(selectedJob.id);
  }

  addJobIdToAllRules(jobId: string) {
    const batch: Observable<any>[] = [];

    for (const rule of this.rowData) {
      if (!rule.jobIds) {
        rule.jobIds = [];
      }
      rule.jobIds.push(jobId);

      batch.push(this.serviceRepository.updateAutoTemplateRule(rule));
    }

    const joinedObservables = forkJoin(batch);
    joinedObservables.subscribe(
      () => {
        this.toast.infoToast(this.translate.instant('TOOLS.AUTO-TEMPLATE.JOB-ADDED-TO-ALL'));

        this.getData();
      },
      (err) => {
        this.toast.errorToast(this.translate.instant('TOOLS.AUTO-TEMPLATE.JOB-FAILED-TO-ALL'));
      }
    );
  }

  setTemplateListActivityClass(template: TemplatesList) {
    return typeof this.activeElement !== 'undefined' && template.templateId === this.activeElement.templateId ? 'active' : 'none';
  }

  showJobSection(): boolean {
    return this.rowData && this.rowData.filter((d) => d.autoTemplateRuleId !== 'new').length > 0;
  }

  private prepareData(templates: TemplatesList[], rules: AutoTemplateRuleList[]) {
    const rows: AutoTemplateList[] = [];
    templates.forEach((template) => {
      let rulesNew: AutoTemplateRule[] = [];
      rules.forEach((r) => {
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
      this.expadedTemplates.forEach((element) => {
        this.gridApi.forEachNode((node) => {
          if (node.data.templateId.localeCompare(element) === 0) {
            setTimeout(() => {
              that.getDisplayedRowAtIndex(node.rowIndex).setExpanded(true);
            }, 0);
          }
        });
      });
    }
  }
}

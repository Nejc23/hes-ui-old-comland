import { SidebarToggleService } from './../../../../shared/base-template/components/services/sidebar.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { AutoTemplateList } from './../../../../core/repository/interfaces/auto-templates/auto-templates-list.interface';
import { ActivatedRoute } from '@angular/router';
import { AutoTemplatesGridService } from '../services/auto-template-grid.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
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

  public headerTitle = this.staticTextService.title;
  public form: FormGroup;

  private expadedTemplates: string[] = [];

  private templateId: string;

  // jobList$: Observable<CodelistExt<string>[]>;
  allJobList: CodelistExt<string>[];
  jobList: CodelistExt<string>[];

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
    private codelistService: CodelistRepositoryService,
    private toast: ToastNotificationService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private sidebarToggleService: SidebarToggleService
  ) {
    this.form = this.createForm();

    // grid settings
    this.frameworkComponents = this.service.setFrameworkComponents();
    this.frameworkComponentsJobs = this.service.setFrameworkComponentsJobs();
    this.context = { forma: this.form, componentParent: this };
    this.gridOptions = this.service.setGridOptions();
    this.getRowHeight = params => {
      const editingCells = this.gridApi.getEditingCells();

      if (editingCells.length > 0) {
        if (editingCells[0].rowIndex === params.node.rowIndex) {
          return 65;
        }
      }
      return 35;
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
      const index = this.rowData.map(x => x.autoTemplateRuleId).indexOf('new');
      if (index > -1) {
        this.rowData.splice(index, 1);

        // reset grid
        this.gridApi.setRowData(this.rowData);
      }
    }
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
    val.active = true;
    this.activeElement = val;

    this.rowData = [];
    this.rowDataJobs = [];

    this.getData();
  }

  ngOnInit() {
    this.serviceRepository.getTemplates().subscribe(temp => {
      this.templates = temp;

      // select first template
      if (this.templates && this.templates.length > 0) {
        this.onSelect(this.templates[0]);
      }
    });

    this.codelistService.jobsReadingJobsCodelistCodes().subscribe(result => {
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
        .filter(j => {
          return jobIds.indexOf(j.id) < 0;
        })
        .sort((j1, j2) => (j1.value > j2.value ? 1 : j2.value > j1.value ? -1 : 0));

      this.form.get('selectedJob').setValue(null);
    }
  }

  getData() {
    try {
      if (this.activeElement.templateId.length > 0) {
        this.serviceRepository.getAutoTemplateRulesForTemplateId(this.activeElement.templateId).subscribe(
          template => {
            this.rowData = template.autoTemplateRules;
            this.gridApi.setRowData(this.rowData);
            this.setJobListWithoutAssignedJobs();
            this.getDataJobs();
          },
          error => {
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
          jobs => {
            this.rowDataJobs = jobs;
            this.gridApiJobs.setRowData(this.rowDataJobs);
          },
          error => {
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
          this.toast.infoToast($localize`Aready added empty row for new item!`);
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
      successMessage = $localize`Rule was added successfully`;
    } else {
      const values = this.fillDataEditRule();
      request = this.serviceRepository.updateAutoTemplateRule(values);
      successMessage = $localize`Rule was updated successfully`;
    }

    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
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
      jobIds: this.getJobIds()
    };

    return formData;
  }

  fillDataEditRule(): AutoTemplateRule {
    const formData: AutoTemplateRule = {
      propertyName: this.form.get('propertyName').value,
      propertyValue: this.form.get('propertyValue').value,
      autoTemplateRuleId: this.form.get('ruleId').value,
      jobIds: this.getJobIds()
    };

    return formData;
  }

  getJobIds(): string[] {
    if (!this.rowData || this.rowData.length === 0) {
      return [];
    }

    return [...new Set(this.rowData[0].jobIds)];
  }

  editForm(id: string, rowIndex: number) {
    const cellDefs2 = this.gridApi.getEditingCells();

    if (cellDefs2.length === 0) {
      this.gridApi.setFocusedCell(rowIndex, 'propertyName');
      this.gridApi.startEditingCell({
        rowIndex,
        colKey: 'propertyName'
      });
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
  }

  deleteForm(id: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = $localize`Delete`;
    response = this.serviceRepository.deleteAutoTemplateRule(id);
    component.btnConfirmText = operation;
    component.modalTitle = $localize`Confirm delete`;
    component.modalBody = $localize`Do you want to delete rule?`;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        response.subscribe(
          value => {
            this.getData();

            // refresh grid
            this.gridApiJobs.setRowData(this.rowDataJobs);

            this.toast.successToast($localize`Rule deleted!`);
          },
          e => {
            this.toast.errorToast($localize`Server error!`);
          }
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );

    /*
    messageStarted = $localize `Scheduler job deleted!`);
    messageServerError = $localize `Server error!`);

    const request = this.serviceRepository.deleteAutoTemplateRule(id);
    this.formUtils.deleteForm(request, $localize `Selected item deleted')).subscribe(
      (response: any) => {
        this.getData();
      },
      () => {}
    );*/
  }

  removeForm(jobId: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    const operation = $localize`Remove`;
    // response = this.serviceRepository.deleteAutoTemplateRule(id);
    component.btnConfirmText = operation;
    component.modalTitle = $localize`Confirm remove`;
    component.modalBody = $localize`Do you want to remove job from all rules?`;

    modalRef.result.then(
      data => {
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
      rule.jobIds = rule.jobIds.filter(j => j.toLowerCase() !== jobIdLowerCase);

      batch.push(this.serviceRepository.updateAutoTemplateRule(rule));
    }

    const joinedObservables = forkJoin(batch);
    joinedObservables.subscribe(
      () => {
        this.getData();
        this.toast.infoToast($localize`Job successfully removed from all rules.`);
      },
      err => {
        this.toast.errorToast($localize`Failed to remove job from all rules.`);
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
      this.toast.errorToast($localize`Select a job to add.`);
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
        this.toast.infoToast($localize`Job successfully added to all rules.`);

        this.getData();
      },
      err => {
        this.toast.errorToast($localize`Failed to add job to all rules.`);
      }
    );
  }

  setTemplateListActivityClass(template: TemplatesList) {
    return typeof this.activeElement !== 'undefined' && template.templateId === this.activeElement.templateId ? 'active' : 'none';
  }

  showJobSection(): boolean {
    return this.rowData && this.rowData.filter(d => d.autoTemplateRuleId !== 'new').length > 0;
  }

  ngOnDestroy() {}

  getFilterTitle(): string {
    return $localize`Templates list`;
  }
}

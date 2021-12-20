import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { forkJoin, Observable } from 'rxjs';
import { ConfigurationBasicDto } from 'src/app/api/time-of-use/models';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { TouWizardMode } from 'src/app/enums/tou-configuration/TouWizardModeEnum';
import { TouConfigurationHelper } from 'src/app/features/helpers/tou-configuration.helper';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';
import { ToastNotificationService } from '../../../../../../core/toast-notification/services/toast-notification.service';
import {
  CheckboxColumn,
  GridBulkAction,
  GridColumn,
  GridColumnType,
  GridFilter,
  GridRowAction
} from '../../../../../../shared/data-table/data-table.component';
import { TouConfigService } from '../../../services/tou-config.service';
import { TouConfigErrorHandler } from '../tou-config-error-handler/tou-config-error-handler';

@Component({
  selector: 'app-tou-config-list',
  templateUrl: './tou-config-list.component.html',
  styleUrls: ['./tou-config-list.component.scss']
})
export class TouConfigListComponent implements OnInit {
  touConfigListData: ConfigurationBasicDto[] = [];
  touListColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'externalId',
      translationKey: 'FORM.TOU-EXTERNAL-ID'
    },
    {
      field: 'description',
      translationKey: 'FORM.DESCRIPTION'
    },
    {
      field: 'modified',
      type: GridColumnType.DATE_TIME,
      translationKey: 'FORM.LAST-UPDATED'
    },
    {
      field: 'createdBy',
      translationKey: 'FORM.CREATED-BY',
      icon: 'user-icon'
    }
  ];

  touConfigurationListDefaultSort: SortDescriptor[] = [
    {
      field: 'modified',
      dir: 'desc'
    }
  ];

  touListRowActionConfiguration: Array<GridRowAction> = [
    {
      actionName: 'duplicate',
      iconName: 'duplicate-icon'
    },
    {
      actionName: 'edit',
      iconName: 'edit-icon'
    },
    {
      actionName: 'delete',
      iconName: 'delete-icon'
    }
  ];

  checkboxColumn: CheckboxColumn = {
    columnMenu: false,
    resizable: false,
    showSelectAll: true,
    width: 10
  };

  touListTableBulkActionConfiguration: Array<GridBulkAction> = [
    {
      actionName: 'delete',
      iconClass: 'far fa-trash-alt'
    }
  ];
  showGridBulkActions: boolean;

  createdByData = [];
  touListFiltersConfiguration: GridFilter[] = [];
  selectedKeys: string[] = [];

  constructor(
    private touService: TouConfigService,
    private toast: ToastNotificationService,
    private modalService: ModalService,
    private translate: TranslateService,
    private router: Router,
    private eventsService: EventManagerService,
    private touConfigHelper: TouConfigurationHelper,
    private touConfigErrorHelper: TouConfigErrorHandler
  ) {}

  ngOnInit(): void {
    this.getData();
    this.eventsService.getCustom('RefreshTouConfigList').subscribe(() => {
      this.getData();
    });
  }

  getData() {
    this.touService.getAllConfigurations().subscribe(
      (res) => {
        this.touConfigListData = res;
        // set filter
        this.createdByData = [...new Set(this.touConfigListData.map((event) => event.createdBy))];
        this.touListFiltersConfiguration = [
          {
            field: 'createdBy',
            values: this.createdByData,
            label: 'FORM.CREATED-BY'
          }
        ];
      },
      (err: HttpErrorResponse) => {
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'delete') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.modalTitle = this.translate.instant('TOU-CONFIG.DELETE-ITEM-TITLE-CONFIGURATION');
      component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEM-CONFIGURATION-CONFIRMATION', {
        configurationName: event.rowData.description
      });
      component.warningIcon = false;

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.touService.deleteConfiguration(event.id).subscribe(
            () => {
              this.toast.successToast(this.translate.instant('TOU-CONFIG.DELETE-ITEM-SUCCESS-CONFIGURATION'));
              this.getData();
              this.selectedKeys = this.selectedKeys.filter((x) => x !== event.id);
            },
            (err: HttpErrorResponse) => {
              this.touConfigErrorHelper.showErrorsAsToasts(err);
            }
          );
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    }
    if (event.actionName === 'edit') {
      this.getConfigurationAndOpenWizard(event.id, TouWizardMode.EDIT);
    }
    if (event.actionName === 'duplicate') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.modalTitle = this.translate.instant('TOU-CONFIG.DUPLICATE-ITEM');
      component.modalBody = this.translate.instant('TOU-CONFIG.DUPLICATE-ITEM-CONFIRMATION', {
        configurationName: event.rowData.description
      });
      component.warningIcon = false;

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.getConfigurationAndOpenWizard(event.id, TouWizardMode.CREATE);
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    }
  }

  getConfigurationAndOpenWizard(configurationId: string, touWizardMode: TouWizardMode) {
    this.touService.getConfiguration(configurationId).subscribe(
      (res) => {
        const touConfiguration = this.touConfigHelper.castConfigurationDetailDtoToTouConfigurationClient(res);
        this.touService.touWizardMode = touWizardMode;
        this.touService.touConfigurationClient = touConfiguration;
        this.router.navigate(['/configuration/importTouConfiguration/wizard/basic']);
      },
      (err: HttpErrorResponse) => {
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  selectionChanged(selectedRows: string[]) {
    this.showGridBulkActions = selectedRows.length > 0;
  }

  bulkActionClicked(event: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.warningIcon = false;

    if (event.actionName === 'delete') {
      component.modalTitle = this.translate.instant('TOU-CONFIG.DELETE-ITEMS-TITLE-CONFIGURATION');
      component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEMS-CONFIGURATION-CONFIRMATION');

      modalRef.result.then(() => {
        const batch: Observable<any>[] = [];
        for (const key of event.selectedKeys) {
          batch.push(this.touService.deleteConfiguration(key));
        }
        const joinedObservables = forkJoin(batch);
        joinedObservables
          .subscribe(
            () => {
              this.toast.successToast(this.translate.instant('TOU-CONFIG.DELETE-ITEMS-SUCCESS-CONFIGURATION'));
            },
            (err: HttpErrorResponse) => {
              this.touConfigErrorHelper.showErrorsAsToasts(err);
            }
          )
          .add(() => {
            this.getData();
            this.selectedKeys = [];
            this.showGridBulkActions = false;
          });
      });
    }
  }
}

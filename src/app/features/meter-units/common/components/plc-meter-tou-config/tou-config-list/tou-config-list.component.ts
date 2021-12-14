import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { ConfigurationBasicDto } from 'src/app/api/time-of-use/models';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { environment } from '../../../../../../../environments/environment';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';
import { ToastNotificationService } from '../../../../../../core/toast-notification/services/toast-notification.service';
import { CheckboxColumn, GridBulkAction, GridColumn, GridRowAction } from '../../../../../../shared/data-table/data-table.component';
import { TouConfigService } from '../../../services/tou-config.service';

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
      translationKey: 'FORM.TOU-ID'
    },
    {
      field: 'description',
      translationKey: 'FORM.DESCRIPTION'
    },
    {
      field: 'modified',
      translationKey: 'FORM.LAST-UPDATED'
    },
    {
      field: 'createdBy',
      translationKey: 'FORM.CREATED-BY',
      icon: 'user-icon'
    }
  ];

  touListRowActionConfiguration: Array<GridRowAction> = [
    {
      actionName: 'duplicate',
      iconName: 'duplicate-icon'
    },
    //   todo edit
    // ,
    // {
    //   actionName: 'edit',
    //   iconName: 'edit-icon'
    // }
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
    // TODO: HES-533 - uncomment export bulk action
    // {
    //     actionName: 'export',
    //     iconClass: 'far fa-arrow-from-top'
    // },
    {
      actionName: 'delete',
      iconClass: 'far fa-trash-alt'
    }
  ];
  showGridBulkActions: boolean;

  createdByData = [];
  touListFiltersConfiguration;
  selectedKeys: string[] = [];

  constructor(
    private touService: TouConfigService,
    private toast: ToastNotificationService,
    private modalService: ModalService,
    private translate: TranslateService,
    private router: Router,
    private eventsService: EventManagerService
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

        // format date
        this.touConfigListData.map(
          (item) =>
            (item.modified =
              moment(item.modified).format(environment.dateDisplayFormat) + ' ' + moment(item.modified).format(environment.timeFormatLong))
        );
      },
      (err: HttpErrorResponse) => {
        const errors = err.error as Array<string>;
        errors.forEach((errMsg) => {
          this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${errMsg}`));
        });
      }
    );
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'delete') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.modalTitle = this.translate.instant('TOU-CONFIG.DELETE-ITEM');
      component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEM-CONFIRMATION', { configurationName: event.rowData.description });
      component.warningIcon = false;

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.touService.deleteConfiguration(event.id).subscribe(
            (res) => {
              this.toast.successToast(this.translate.instant('TOU-CONFIG.DELETE-ITEM-SUCCESS'));
              this.getData();
            },
            (err: HttpErrorResponse) => {
              const errors = err.error as Array<string>;
              errors.forEach((errMsg) => {
                this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${errMsg}`));
              });
            }
          );
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    }
    if (event.actionName === 'edit') {
      // todo edit
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

          this.touService.getConfiguration(event.id).subscribe(
            (res) => {
              const touConfiguration = this.touService.castConfigurationDetailDtoToTouConfigurationClient(res);
              this.touService.touConfigurationClient = touConfiguration;
              this.router.navigate(['/configuration/importTouConfiguration/wizard/basic']);
            },
            (err: HttpErrorResponse) => {
              const errors = err.error as Array<string>;
              errors.forEach((errMsg) => {
                this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${errMsg}`));
              });
            }
          );
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    }
  }

  selectionChanged(selectedRows: string[]) {
    this.showGridBulkActions = selectedRows.length > 0;
  }

  bulkActionClicked(event: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.warningIcon = false;

    if (event.actionName === 'export') {
      // TODO: HES-533
      modalRef.close();
    } else if (event.actionName === 'delete') {
      component.modalTitle = this.translate.instant('TOU-CONFIG.DELETE-ITEMS');
      component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEMS-CONFIRMATION');

      modalRef.result.then(() => {
        const batch: Observable<any>[] = [];
        for (const key of event.selectedKeys) {
          batch.push(this.touService.deleteConfiguration(key));
        }
        const joinedObservables = forkJoin(batch);
        joinedObservables
          .subscribe(
            () => {
              this.toast.successToast(this.translate.instant('TOU-CONFIG.DELETE-ITEMS-SUCCESS'));
            },
            (err: HttpErrorResponse) => {
              const errMsg = err.error as string;
              this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${errMsg}`));
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

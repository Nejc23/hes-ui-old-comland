import { Component, ElementRef, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../../shared/breadcrumbs/services/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { CryptoClientCertificateDto } from '../../../../api/crypto-lite-ui/models/crypto-client-certificate-dto';
import { CryptoService } from '../../../meter-units/common/services/crypto.service';
import { GridBulkAction, GridColumn, GridColumnType, GridRowAction } from '../../../../shared/data-table/data-table.component';
import { ModalConfirmComponent } from '../../../../shared/modals/components/modal-confirm.component';
import { ModalService } from '../../../../core/modals/services/modal.service';
import { forkJoin, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';

@Component({
  selector: 'app-vault-access',
  templateUrl: './vault-access.component.html',
  styleUrls: ['./vault-access.component.scss']
})
export class VaultAccessComponent implements OnInit {
  clientCertificatesDataList: CryptoClientCertificateDto[] = [];
  clientCertificatesPendingDataList: CryptoClientCertificateDto[] = [];

  clientCertificatesLoading = false;
  clientCertificatesPendingLoading = false;

  clientCertificatesListColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'status',
      translationKey: 'FORM.STATUS',
      width: 100,
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: this.translate.instant(`VAULT-ACCESS.API.CONFIRMED`),
          color: 'green'
        },
        {
          enumValue: this.translate.instant(`VAULT-ACCESS.API.AUTO_CONFIRMED`),
          color: 'green'
        },
        {
          enumValue: this.translate.instant(`VAULT-ACCESS.API.ISSUED`),
          color: 'green'
        },
        {
          enumValue: this.translate.instant(`VAULT-ACCESS.API.AUTO_ISSUED`),
          color: 'green'
        },
        {
          enumValue: this.translate.instant(`VAULT-ACCESS.API.REJECTED`),
          color: 'red'
        }
      ]
    },
    {
      field: 'subject',
      type: GridColumnType.BOLD_TEXT,
      translationKey: 'FORM.SUBJECT',
      width: 250
    },
    {
      field: 'requestId',
      translationKey: 'FORM.REQUEST-ID',
      width: 250
    },
    {
      field: 'updatedAt',
      translationKey: 'FORM.LAST-UPDATED',
      type: GridColumnType.DATE_TIME,
      width: 150
    },
    {
      field: 'username',
      translationKey: 'FORM.REJECTED-GRANTED',
      icon: 'user-icon',
      width: 150
    }
  ];

  clientCertificatesListPendingColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'status',
      translationKey: 'FORM.STATUS',
      type: GridColumnType.COLORED_ENUM,
      width: 100,
      coloredValues: [
        {
          enumValue: this.translate.instant(`VAULT-ACCESS.API.UNCONFIRMED`),
          color: 'blue'
        }
      ]
    },
    {
      field: 'subject',
      type: GridColumnType.BOLD_TEXT,
      translationKey: 'FORM.SUBJECT',
      width: 150
    },
    {
      field: 'requestId',
      translationKey: 'FORM.REQUEST-ID',
      width: 300
    },
    {
      field: 'createdAt',
      type: GridColumnType.DATE_TIME,
      translationKey: 'FORM.CREATED-AT',
      width: 150
    }
  ];

  clientCertificatesListPendingBulkActionConfiguration: Array<GridBulkAction> = [
    {
      actionName: 'reject',
      iconClass: 'far fa-times'
    },
    {
      actionName: 'grant',
      iconClass: ''
    }
  ];

  clientCertificatesListPendingRowActionConfiguration: Array<GridRowAction> = [
    {
      actionName: 'grant',
      iconName: 'green-check-icon'
    },
    {
      actionName: 'reject',
      iconName: 'close-icon'
    }
  ];

  showGridBulkActions: boolean;
  clientCertificatesFiltersConfiguration;
  statusData = [];
  usernameData = [];
  selectedKeys: string[] = [];

  constructor(
    private cryptoService: CryptoService,
    private breadcrumbService: BreadcrumbService,
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private translate: TranslateService,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    this.getClientCertificatesPendingData();
    this.getClientCertificatesData();
    this.breadcrumbService.setPageName(this.translate.instant('MENU.VAULT-ACCESS'));
  }

  getClientCertificatesData() {
    this.clientCertificatesLoading = true;
    this.cryptoService.getAllClientCertificates().subscribe(
      (res) => {
        this.clientCertificatesDataList = res;
        this.clientCertificatesLoading = false;

        this.statusData = [
          ...new Set(
            this.clientCertificatesDataList.map((event) => this.translate.instant(`VAULT-ACCESS.API.${event.status.toUpperCase()}`))
          )
        ];

        this.mapEnums(this.clientCertificatesDataList);
        this.clientCertificatesDataList.forEach((event) => {
          if (event.username === undefined) {
            event['username'] = this.translate.instant('COMMON.NA');
          }
        });
        this.usernameData = [...new Set(this.clientCertificatesDataList.map((event) => event.username))];

        this.clientCertificatesFiltersConfiguration = [
          {
            field: 'status',
            values: this.statusData,
            label: 'FORM.STATUS'
          },
          {
            field: 'username',
            values: this.usernameData,
            label: 'FORM.REJECTED-GRANTED'
          }
        ];
      },
      (err: HttpErrorResponse) => {
        this.clientCertificatesLoading = false;
        this.toast.errorToast(this.translate.instant('VAULT-ACCESS.CLIENT-CERTS-ERROR'));
      }
    );
  }

  getClientCertificatesPendingData() {
    this.clientCertificatesPendingLoading = true;
    this.cryptoService.getPendingClientCertificates().subscribe(
      (res) => {
        this.clientCertificatesPendingDataList = res;
        this.mapEnums(this.clientCertificatesPendingDataList);
        this.clientCertificatesPendingLoading = false;
      },
      (err: HttpErrorResponse) => {
        this.clientCertificatesPendingLoading = false;
        this.toast.errorToast(this.translate.instant('VAULT-ACCESS.CLIENT-CERTS-ERROR'));
      }
    );
  }

  rowActionsClicked(event: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.warningIcon = false;

    if (event.actionName === 'reject') {
      component.modalTitle = this.translate.instant('VAULT-ACCESS.REJECT-ITEMS');
      component.btnConfirmText = this.translate.instant('VAULT-ACCESS.REJECT-BUTTON');
      component.hideCloseButton = true;
      component.modalBody = this.translate.instant('VAULT-ACCESS.REJECT-ITEM-CONFIRMATION');

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.cryptoService.rejectClientCertificate({ id: event.requestId }).subscribe(
            (res) => {
              this.toast.successToast(this.translate.instant('VAULT-ACCESS.REJECT-ITEM-SUCCESS'));
              this.getClientCertificatesPendingData();
              this.getClientCertificatesData();
            },
            (err: HttpErrorResponse) => {
              this.toast.errorToast(this.translate.instant('VAULT-ACCESS.REJECT-ERROR'));
            }
          );
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    } else if (event.actionName === 'grant') {
      component.modalTitle = this.translate.instant('VAULT-ACCESS.GRANT-ITEMS');
      component.btnConfirmText = this.translate.instant('VAULT-ACCESS.GRANT-BUTTON');
      component.hideCloseButton = true;
      component.modalBody = this.translate.instant('VAULT-ACCESS.GRANT-ITEM-CONFIRMATION');

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.cryptoService.grantClientCertificate({ id: event.requestId }).subscribe(
            (res) => {
              this.toast.successToast(this.translate.instant('VAULT-ACCESS.GRANT-ITEM-SUCCESS'));
              this.getClientCertificatesPendingData();
              this.getClientCertificatesData();
            },
            (err: HttpErrorResponse) => {
              this.toast.errorToast(this.translate.instant('VAULT-ACCESS.GRANT-ERROR'));
            }
          );
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    }
  }

  bulkActionClicked(event: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.warningIcon = false;

    if (event.actionName === 'reject') {
      component.modalTitle = this.translate.instant('VAULT-ACCESS.REJECT-ITEMS');
      component.btnConfirmText = this.translate.instant('VAULT-ACCESS.REJECT-BUTTON');
      component.hideCloseButton = true;
      if (event.selectedKeys.length === 1) {
        component.modalBody = this.translate.instant('VAULT-ACCESS.REJECT-ITEM-CONFIRMATION');
      } else {
        component.modalBody = this.translate.instant('VAULT-ACCESS.REJECT-ITEMS-CONFIRMATION');
      }

      modalRef.result.then(() => {
        const batch: Observable<any>[] = [];
        for (const key of event.selectedKeys) {
          batch.push(this.cryptoService.rejectClientCertificate({ id: key }));
        }
        const joinedObservables = forkJoin(batch);
        joinedObservables
          .subscribe(
            () => {
              if (event.selectedKeys.length === 1) {
                this.toast.successToast(this.translate.instant('VAULT-ACCESS.REJECT-ITEM-SUCCESS'));
              } else {
                this.toast.successToast(this.translate.instant('VAULT-ACCESS.REJECT-ITEMS-SUCCESS'));
              }

              this.getClientCertificatesPendingData();
              this.getClientCertificatesData();
            },
            (err: HttpErrorResponse) => {
              this.toast.errorToast(this.translate.instant('VAULT-ACCESS.REJECT-ERROR'));
            }
          )
          .add(() => {
            this.selectedKeys = [];
            this.showGridBulkActions = false;
          });
      });
    } else if (event.actionName === 'grant') {
      component.modalTitle = this.translate.instant('VAULT-ACCESS.GRANT-ITEMS');
      component.btnConfirmText = this.translate.instant('VAULT-ACCESS.GRANT-BUTTON');
      component.hideCloseButton = true;
      if (event.selectedKeys.length === 1) {
        component.modalBody = this.translate.instant('VAULT-ACCESS.GRANT-ITEM-CONFIRMATION');
      } else {
        component.modalBody = this.translate.instant('VAULT-ACCESS.GRANT-ITEMS-CONFIRMATION');
      }

      modalRef.result.then(() => {
        const batch: Observable<any>[] = [];
        for (const key of event.selectedKeys) {
          batch.push(this.cryptoService.grantClientCertificate({ id: key }));
        }
        const joinedObservables = forkJoin(batch);
        joinedObservables
          .subscribe(
            () => {
              if (event.selectedKeys.length === 1) {
                this.toast.successToast(this.translate.instant('VAULT-ACCESS.GRANT-ITEM-SUCCESS'));
              } else {
                this.toast.successToast(this.translate.instant('VAULT-ACCESS.GRANT-ITEMS-SUCCESS'));
              }

              this.getClientCertificatesPendingData();
              this.getClientCertificatesData();
            },
            (err: HttpErrorResponse) => {
              this.toast.errorToast(this.translate.instant('VAULT-ACCESS.GRANT-ERROR'));
            }
          )
          .add(() => {
            this.selectedKeys = [];
            this.showGridBulkActions = false;
          });
      });
    }
  }

  selectionChanged(selectedRows: string[]) {
    this.showGridBulkActions = selectedRows.length > 0;
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  mapEnums(data: Array<CryptoClientCertificateDto>) {
    data.map((item) => {
      item.status = this.translate.instant(`VAULT-ACCESS.API.${item.status.toUpperCase()}`);
    });
  }
}

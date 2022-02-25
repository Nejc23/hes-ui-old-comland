import { Component, Input, OnInit } from '@angular/core';
import { GridColumn, GridRowAction } from '../../../../../shared/data-table/data-table.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceMetaDataDto } from '../../../../../api/concentrator-inventory/models/device-meta-data-dto';
import { ToastNotificationService } from '../../../../../core/toast-notification/services/toast-notification.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../../../../../shared/modals/components/modal-confirm.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { EventManagerService } from '../../../../../core/services/event-manager.service';
import { MeterPropertyService } from '../../../../../api/concentrator-inventory/services/meter-property.service';

@Component({
  selector: 'app-extra-details',
  templateUrl: './extra-details.component.html',
  styleUrls: ['./extra-details.component.scss']
})
export class ExtraDetailsComponent implements OnInit {
  form: FormGroup;
  cancelEditing = false;

  @Input() deviceId;
  @Input() slideOutOpen = false;

  extraDetailsData: Array<DeviceMetaDataDto> = [];

  sort: SortDescriptor[] = [
    {
      field: 'property',
      dir: 'asc'
    }
  ];

  extraDetailsRowActions: Array<GridRowAction> = [
    {
      actionName: 'delete',
      iconName: 'delete-icon'
    }
  ];

  extraDetailsColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'property',
      translationKey: 'FORM.NAME'
    },
    {
      field: 'value',
      translationKey: 'FORM.VALUE'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private meterPropertyService: MeterPropertyService,
    private toastService: ToastNotificationService,
    private modalService: ModalService,
    private translate: TranslateService,
    private eventsService: EventManagerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      ['property']: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      ['value']: ''
    });
    console.log(this.form);
    this.getDeviceMetadata();
  }

  getDeviceMetadata(refreshGrid = false) {
    this.meterPropertyService.meterDeviceIdMetadataGet({ deviceId: this.deviceId }).subscribe((res) => {
      this.extraDetailsData = res;
      if (refreshGrid) {
        this.extraDetailsData = [...this.extraDetailsData];
      }
    });
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'delete') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.warningIcon = false;
      component.modalTitle = this.translate.instant('EXTRA-DETAILS-MODAL.TITLE');
      component.modalBody = this.translate.instant('EXTRA-DETAILS-MODAL.TEXT');

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.meterPropertyService
            .meterDeviceIdMetadataDelete({
              deviceMetaDataId: event.rowData.deviceMetaDataId
            })
            .subscribe(
              () => {
                this.toastService.successToast(this.translate.instant('COMMON.EXTRA-DETAILS-REMOVED'));
                this.eventsService.emitCustom('RefreshMetadataEvent', true);
                this.getDeviceMetadata(true);
              },
              (err: HttpErrorResponse) => {
                console.log(err);
              }
            );
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    }
  }

  saveInlineData(event: any) {
    if (event.action === 'edit') {
      this.updateMetadata(event);
    } else {
      this.addMetadataToDevice(event);
    }
  }

  updateMetadata(event: any) {
    const body: DeviceMetaDataDto = {
      deviceId: this.deviceId,
      property: event.dataItem.property,
      value: event.dataItem.value
    };
    this.meterPropertyService
      .meterMetadataDeviceMetaDataIdPut({
        deviceMetaDataId: event.dataItem.deviceMetaDataId,
        body: body
      })
      .subscribe(
        () => {
          this.toastService.successToast(this.translate.instant('COMMON.EXTRA-DETAILS-UPDATED'));
          this.eventsService.emitCustom('RefreshMetadataEvent', true);
        },
        () => {
          this.toastService.errorToast(this.translate.instant('COMMON.EXTRA-DETAILS-UPDATE-FAILED'));
          this.getDeviceMetadata(true);
          this.cancelEditing = true;
        }
      );
  }

  addMetadataToDevice(event: any) {
    const body: DeviceMetaDataDto = {
      deviceId: this.deviceId,
      property: event.dataItem.property,
      value: event.dataItem.value
    };
    this.meterPropertyService.meterMetadataPost({ body: body }).subscribe(
      () => {
        this.toastService.successToast(this.translate.instant('COMMON.EXTRA-DETAILS-ADDED'));
        this.eventsService.emitCustom('RefreshMetadataEvent', true);
        this.getDeviceMetadata(true);
        this.cancelEditing = true;
      },
      () => {
        this.toastService.errorToast(this.translate.instant('COMMON.EXTRA-DETAILS-ADDED-FAILED'));
        this.getDeviceMetadata(true);
        this.cancelEditing = true;
      }
    );
  }
}

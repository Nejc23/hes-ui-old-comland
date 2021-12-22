import { Component, Input } from '@angular/core';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { DcOperationTypeEnum } from '../../enums/operation-type.enum';
import { DcOperationsService } from '../../services/dc-operations.service';
import { DeleteDcuFormComponent } from '../delete-dcu-form/delete-dcu-form.component';
import { ModalService } from '../../../../core/modals/services/modal.service';
import { ModalConfirmComponent } from '../../../../shared/modals/components/modal-confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { SecurityRekeyConcentratorComponent } from '../security/security-rekey-concentrator.component';
import { DownloadDataConcentratorClientCertComponent } from '../download/download-dc-client-cert.component';

export enum OperationType {
  OPERATION = 'OPERATION',
  SECURITY = 'SECURITY'
}

@Component({
  selector: 'app-dc-operations',
  templateUrl: './dc-operations.component.html'
})
export class DcOperationsComponent {
  @Input() showOperations = false;
  @Input() showSecurities = false;
  @Input() guid: string;
  @Input() requestModel: GridRequestParams;
  @Input() selectedItemsCount: number;
  @Input() allVisibleColumns: string[];
  @Input() type = '';
  @Input() state = '';
  @Input() operationType: OperationType;
  componentType = OperationType;
  reKeyNotSupportedText = 'DCU.RE-KEY-NOT-SUPPORTED';
  downloadClientCertNotSupportedText = 'DCU.DOWNLOAD-CLIENT-CERT-NOT-SUPPORTED';
  reKeyInstallingStateNotSupportedText = 'DCU.RE-KEY-INSTALLING-STATE-NOT-SUPPORTED';
  installingStateNotSupportedText = 'DCU.INSTALLING-STATE-NOT-SUPPORTED';
  reKeyDangerMessage = 'DCU.CONCENTRATOR-INOPERABLE-WARNING';

  constructor(private dcOperationsService: DcOperationsService, private modalService: ModalService, private translate: TranslateService) {}

  get permissionSynchronizeTime() {
    return PermissionEnumerator.Sync_Time;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Concentrator_FW_Upgrade;
  }

  get permissionDeviceDiscovery() {
    return PermissionEnumerator.Meter_Discovery;
  }

  get permissionManageConcentrators() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  get permissionReKey() {
    return PermissionEnumerator.Rekey_Concentrator;
  }

  onSynchronizeTime() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);

    if (this.state) {
      params.states = [this.state];
    }

    if (
      !this.checkIfNotSupportedInstalling(
        params.states,
        this.translate.instant('OPERATION.SYNC-TIME'),
        this.selectedItemsCount,
        this.installingStateNotSupportedText
      )
    ) {
      let alertText = '';
      if (this.checkIfStateInstalling(params.states)) {
        alertText = this.installingStateNotSupportedText;
      }

      this.dcOperationsService.bulkOperation(DcOperationTypeEnum.syncTime, params, this.selectedItemsCount, alertText);
    }
  }

  onFwUpgrade() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);

    if (this.state) {
      params.states = [this.state];
    }

    if (
      !this.checkIfNotSupportedInstalling(
        params.states,
        this.translate.instant('DCU.FW-UPLOAD-UPGRADE'),
        this.selectedItemsCount,
        this.installingStateNotSupportedText
      )
    ) {
      let alertText = '';
      if (this.checkIfStateInstalling(params.states)) {
        alertText = this.installingStateNotSupportedText;
      }
      if (this.type) {
        params.types = [this.type];
      }
      this.dcOperationsService.fwUpgrade(params, this.selectedItemsCount, alertText);
    }
  }

  onDeviceDiscovery() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);

    if (this.state) {
      params.states = [this.state];
    }

    if (
      !this.checkIfNotSupportedInstalling(
        params.states,
        this.translate.instant('OPERATION.DEVICE-DISCOVERY'),
        this.selectedItemsCount,
        this.installingStateNotSupportedText
      )
    ) {
      let alertText = '';
      if (this.checkIfStateInstalling(params.states)) {
        alertText = this.installingStateNotSupportedText;
      }

      this.dcOperationsService.bulkOperation(DcOperationTypeEnum.deviceDiscovery, params, this.selectedItemsCount, alertText);
    }
  }

  onDelete() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, null, 1, null);

    const modalRef = this.modalService.open(DeleteDcuFormComponent);
    const component: DeleteDcuFormComponent = modalRef.componentInstance;
    component.applyRequestParams(params, 1);
  }

  downloadClientCert() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, null, 1, null);

    if (this.type) {
      params.types = [this.type];
    }

    if (!this.checkIfNotSupportedDownload(params.types)) {
      let alertText = '';
      if (this.checkIfAC750(params.types)) {
        alertText = this.reKeyNotSupportedText;
      }

      const modalRef = this.modalService.open(DownloadDataConcentratorClientCertComponent);
      modalRef.componentInstance.alertText = alertText;
    }
  }

  onReKeyConcentrator() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, null, 1, null);

    if (this.type) {
      params.types = [this.type];
    }

    if (this.state) {
      params.states = [this.state];
    }
    if (!this.checkIfNotSupported(params.types)) {
      const modalRef = this.modalService.open(SecurityRekeyConcentratorComponent);
      let alertText = '';
      if (this.checkIfAC750(params.types)) {
        alertText = this.reKeyNotSupportedText;
      }

      let isHmacOnly = false;
      let alertHmacText = '';
      if (params.states.length === 1 && params.states[0].toUpperCase() === 'INSTALLING') {
        isHmacOnly = true;
      } else {
        if (this.checkIfStateInstalling(params.states)) {
          alertHmacText = this.reKeyInstallingStateNotSupportedText;
        }
      }

      modalRef.componentInstance.selectedRowsCount = this.selectedItemsCount;
      modalRef.componentInstance.actionRequest = params;
      modalRef.componentInstance.alertText = alertText;
      modalRef.componentInstance.alertHmacText = alertHmacText;
      modalRef.componentInstance.isHmacOnly = isHmacOnly;
    }
  }

  checkIfNotSupported(types: string[]) {
    if (types.length === 1 && types[0].toUpperCase() === 'AC750') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.withoutCancelButton = true;
      component.modalTitle = 'DCU.RE-KEY-CONCENTRATOR';
      component.modalBody = this.reKeyNotSupportedText;
      component.btnConfirmText = this.translate.instant('BUTTON.CLOSE');
      return true;
    }
    return false;
  }

  checkIfNotSupportedDownload(types: string[]) {
    if (types.length === 1 && types[0].toUpperCase() === 'AC750') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.withoutCancelButton = true;
      component.modalTitle = 'DCU.PROTECT-YOUR-CERT';
      component.modalBody = this.downloadClientCertNotSupportedText;
      component.btnConfirmText = this.translate.instant('BUTTON.CLOSE');
      return true;
    }
    return false;
  }

  checkIfAC750(types: string[]) {
    return types.find((type) => type === 'AC750');
  }

  checkIfNotSupportedInstalling(states: string[], operationName: string, selectedCount: number, notSupportedText: string) {
    if (states.length === 1 && states[0].toUpperCase() === 'INSTALLING') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.withoutCancelButton = true;
      component.modalTitle = this.translate.instant('DCU.OPERATION-MODAL', { operationName: operationName, selectedCount: selectedCount });
      component.modalBody = notSupportedText;
      component.btnConfirmText = this.translate.instant('BUTTON.CLOSE');
      return true;
    }
    return false;
  }

  checkIfStateInstalling(states: string[]) {
    return states.find((state) => state === 'INSTALLING');
  }

  onEnableDC() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);

    if (this.state) {
      params.states = [this.state];
    }

    if (
      !this.checkIfNotSupportedInstalling(
        params.states,
        this.translate.instant('OPERATION.ENABLE-DC'),
        this.selectedItemsCount,
        this.installingStateNotSupportedText
      )
    ) {
      let alertText = '';
      if (this.checkIfStateInstalling(params.states)) {
        alertText = this.installingStateNotSupportedText;
      }

      this.dcOperationsService.bulkOperation(DcOperationTypeEnum.enable, params, this.selectedItemsCount, alertText);
    }
  }

  onDisableDC() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);

    if (this.state) {
      params.states = [this.state];
    }

    if (
      !this.checkIfNotSupportedInstalling(
        params.states,
        this.translate.instant('OPERATION.DISABLE-DC'),
        this.selectedItemsCount,
        this.installingStateNotSupportedText
      )
    ) {
      let alertText = '';
      if (this.checkIfStateInstalling(params.states)) {
        alertText = this.installingStateNotSupportedText;
      }

      this.dcOperationsService.bulkOperation(DcOperationTypeEnum.disable, params, this.selectedItemsCount, alertText);
    }
  }
}

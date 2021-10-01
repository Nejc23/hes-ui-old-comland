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
  @Input() operationType: OperationType;
  componentType = OperationType;
  reKeyNotSupportedText = 'DCU.RE-KEY-NOT-SUPPORTED';
  reKeyDangerMessage = 'DCU.CONCENTRATOR-INOPERABLE-WARNING';

  constructor(private dcOperationsService: DcOperationsService, private modalService: ModalService, private translate: TranslateService) {}

  get permissionSynchronizeTime() {
    return PermissionEnumerator.Sync_Time;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Concentrator_FW_Upgrade;
  }

  get permissionDeviceDiscovery() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  get permissionManageConcentrators() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  get permissionReKey() {
    return PermissionEnumerator.Rekey;
  }

  onSynchronizeTime() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.syncTime, params, this.selectedItemsCount);
  }

  onFwUpgrade() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);
    if (this.type) {
      params.types = [this.type];
    }
    this.dcOperationsService.fwUpgrade(params, this.selectedItemsCount);
  }

  onDeviceDiscovery() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.deviceDiscovery, params, this.selectedItemsCount);
  }

  onDelete() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, null, 1, null);

    const modalRef = this.modalService.open(DeleteDcuFormComponent);
    const component: DeleteDcuFormComponent = modalRef.componentInstance;
    component.applyRequestParams(params, 1);
  }

  onReKeyHmac() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);
    if (this.type) {
      params.types = [this.type];
    }
    if (!this.checkIfNotSupported(params.types)) {
      let alertText = '';
      if (this.checkIfAC750(params.types)) {
        alertText = this.reKeyNotSupportedText;
      }
      this.dcOperationsService.bulkOperation(
        DcOperationTypeEnum.reKeyHmac,
        params,
        this.selectedItemsCount,
        alertText,
        true,
        this.reKeyDangerMessage
      );
    }
  }

  onReKeyConcentrator() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, null, 1, null);
    if (this.type) {
      params.types = [this.type];
    }

    if (!this.checkIfNotSupported(params.types)) {
      const modalRef = this.modalService.open(SecurityRekeyConcentratorComponent);
      let alertText = '';
      if (this.checkIfAC750(params.types)) {
        alertText = this.reKeyNotSupportedText;
      }
      modalRef.componentInstance.selectedRowsCount = this.selectedItemsCount;
      modalRef.componentInstance.actionRequest = params;
      modalRef.componentInstance.alertText = alertText;
    }
  }

  checkIfNotSupported(types: string[]) {
    if (types.length === 1 && types[0].toUpperCase() === 'AC750') {
      const modalRef = this.modalService.open(ModalConfirmComponent);
      const component: ModalConfirmComponent = modalRef.componentInstance;
      component.withoutCancelButton = true;
      component.modalTitle = 'OPERATION.RE-KEY-HMAC';
      component.modalBody = this.reKeyNotSupportedText;
      component.btnConfirmText = this.translate.instant('BUTTON.CLOSE');
      return true;
    }
    return false;
  }

  checkIfAC750(types: string[]) {
    return types.find((type) => type === 'AC750');
  }
}

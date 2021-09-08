import { Component, Input } from '@angular/core';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { DcOperationTypeEnum } from '../../enums/operation-type.enum';
import { DcOperationsService } from '../../services/dc-operations.service';
import { DeleteDcuFormComponent } from '../delete-dcu-form/delete-dcu-form.component';
import { ModalService } from '../../../../core/modals/services/modal.service';

@Component({
  selector: 'app-dc-operations',
  templateUrl: './dc-operations.component.html'
})
export class DcOperationsComponent {
  @Input() showOperations = false;
  @Input() guid: string;
  @Input() requestModel: GridRequestParams;
  @Input() selectedItemsCount: number;
  @Input() allVisibleColumns: string[];

  constructor(private dcOperationsService: DcOperationsService, private modalService: ModalService) {}

  get permissionSynchronizeTime() {
    return PermissionEnumerator.Sync_Time;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Concentrator_FW_Upgrade;
  }

  get permissionDeviceDiscovery() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  onSynchronizeTime() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.syncTime, params, this.selectedItemsCount);
  }

  onFwUpgrade() {
    const params = this.dcOperationsService.getOperationRequestParam(this.guid, this.requestModel, 1, this.allVisibleColumns);
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
}

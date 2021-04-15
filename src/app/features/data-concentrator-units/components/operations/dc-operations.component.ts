import { Component, Input, OnInit } from '@angular/core';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { DcOperationTypeEnum } from '../../enums/operation-type.enum';
import { DcOperationsService } from '../../services/dc-operations.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';

@Component({
  selector: 'app-dc-operations',
  templateUrl: './dc-operations.component.html'
})
export class DcOperationsComponent implements OnInit {
  @Input() showOperations = false;
  @Input() guid: string;
  @Input() requestModel: GridRequestParams;
  @Input() selectedItemsCount: number;
  @Input() allVisibleColumns: string[];
  constructor(private dcOperationsService: DcOperationsService) {}

  // called on init
  ngOnInit(): void {}

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

  get permissionSynchronizeTime() {
    return PermissionEnumerator.Sync_Time;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Concentrator_FW_Upgrade;
  }

  get permissionDeviceDiscovery() {
    return PermissionEnumerator.Manage_Concentrators;
  }
}

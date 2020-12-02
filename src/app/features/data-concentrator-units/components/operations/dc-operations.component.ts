import { Component, Input, OnInit } from '@angular/core';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { DcOperationTypeEnum } from '../../enums/operation-type.enum';
import { DcOperationsService } from '../../services/dc-operations.service';

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
    this.dcOperationsService.fwUpgrade(DcOperationTypeEnum.syncTime, params, this.selectedItemsCount);
  }
}

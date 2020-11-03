import { Component, Input, OnInit } from '@angular/core';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
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
  constructor(private dcOperationsService: DcOperationsService) {}

  // called on init
  ngOnInit(): void {}

  onSynchronizeTime() {
    const params = this.dcOperationsService.getRequestFilterParam(this.guid, this.requestModel);
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.syncTime, params, this.selectedItemsCount);
  }
}

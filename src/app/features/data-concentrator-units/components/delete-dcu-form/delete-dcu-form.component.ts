import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IActionRequestDeleteDevice, IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { DataConcentratorUnitsGridEventEmitterService } from '../../services/data-concentrator-units-grid-event-emitter.service';
import { Router } from '@angular/router';
import { dataConcentratorUnits } from 'src/app/core/consts/route.const';

@Component({
  selector: 'app-delete-dcu-form',
  templateUrl: './delete-dcu-form.component.html'
})
export class DeleteDcuFormComponent implements OnInit {
  public operationName: string;
  public countOfElements = 0;
  private requestParams: IActionRequestDeleteDevice = null;

  constructor(
    private translate: TranslateService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private modal: NgbActiveModal,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private toast: ToastNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.operationName = this.translate.instant('COMMON.DELETE-DEVICES');
  }

  applyRequestParams(params: IActionRequestParams, countOfElements: number) {
    this.requestParams = params as IActionRequestDeleteDevice;

    this.requestParams.includedIds = params.concentratorIds;
    this.requestParams.deviceIds = null;
    this.requestParams.excludedIds = params.excludeIds;
    this.requestParams.excludeIds = null;

    this.countOfElements = countOfElements;
  }

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    if (this.requestParams) {
      this.dataConcentratorUnitsService.deleteDcu(this.requestParams).subscribe(
        (value) => {
          this.toast.successToast(this.translate.instant('COMMON.DELETE-SUCCESS'));
          this.eventService.concentratorDeleted(true);
          this.router.navigate([dataConcentratorUnits]);
          this.onDismiss();
        },
        (e) => {
          this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
        }
      );
    }
  }
}

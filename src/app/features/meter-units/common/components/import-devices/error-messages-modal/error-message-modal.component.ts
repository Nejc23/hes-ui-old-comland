import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';

@Component({
  selector: 'app-error-message-modal',
  templateUrl: './error-message-modal.component.html'
})
export class ErrorMessageModalComponent {
  @Input() messages = [];

  constructor(
    private translate: TranslateService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private modal: NgbActiveModal
  ) {}

  onDismiss() {
    this.modal.dismiss();
  }
}

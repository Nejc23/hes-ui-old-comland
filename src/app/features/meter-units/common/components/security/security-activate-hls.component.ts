import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';

@Component({
  templateUrl: './security-activate-hls.component.html'
})
export class SecurityActivateHlsComponent {
  public selectedRowsCount: number;
  form: FormGroup;
  securityClients$;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private toast: ToastNotificationService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.securityClientProperty]: [null, [Validators.required]]
    });
  }

  get securityClientProperty() {
    return 'securityClient';
  }

  onDismiss() {
    this.modal.dismiss();
  }

  onConfirm() {}
}

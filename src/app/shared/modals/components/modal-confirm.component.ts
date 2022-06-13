import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})

/**
 * EXAMPLE:
 * const modalRef = this.modalService.open(ModalConfirmComponent);
 *   const component: ModalConfirmComponent = modalRef.componentInstance;
 *   component.modalTitle = 'No connection points in solving cycle';
 *   component.modalBody = 'To continue please add connection points to solving cycle.';
 *   component.btnConfirmText = this.i18n('Delete'); // if confirm delete
 *
 *   modalRef.result.then((data) => {
 *     // on close (CONFIRM)
 *   }, (reason) => {
 *     // on dismiss (CLOSE)
 *     });
 */
export class ModalConfirmComponent {
  @Input() modalTitle: string;
  @Input() modalBody: string;
  @Input() btnConfirmText = 'BUTTON.CONFIRM';
  @Input() btnCancelText = 'BUTTON.CANCEL';
  @Input() warningIcon = true;
  @Input() hideCloseButton = false;

  @Input() checkboxField = '';
  @Input() checkboxLabel = '';
  @Input() checkboxValue: boolean;

  @Input() secondConfirmEnabled = false;
  @Input() confirmMessage = '';
  @Input() withoutCancelButton = false;
  @Input() alertText = '';
  @Input() dangerText = ''; // alert with exclamation icon
  showSecondConfirm = false;
  @Input() loading = false;

  constructor(public activeModal: NgbActiveModal) {}

  dismiss() {
    this.activeModal.dismiss();
  }

  confirm() {
    if (this.secondConfirmEnabled) {
      this.showSecondConfirm = true;
      this.secondConfirmEnabled = false;
      this.activeModal.close(true);
    } else {
      this.activeModal.close(this.checkboxValue);
    }
  }

  onValueChanged(event: any) {
    this.checkboxValue = event;
  }
}

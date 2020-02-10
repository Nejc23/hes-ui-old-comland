import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})

/**
 * EXAMPLE:
 * const modalRef = this.modalService.open(ModalConfirmComponent);
 *   const component: ModalConfirmComponent = modalRef.componentInstance;
 *   component.modalTitle = this.i18n('No connection points in solving cycle');
 *   component.modalBody = this.i18n('To continue please add connection points to solving cycle.');
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

  constructor(public activeModal: NgbActiveModal) {}

  dismiss() {
    this.activeModal.dismiss();
  }

  confirm() {
    this.activeModal.close();
  }
}

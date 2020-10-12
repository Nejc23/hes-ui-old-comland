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
export class ModalConfirmComponent implements OnInit {
  @Input() modalTitle: string;
  @Input() modalBody: string;
  @Input() btnConfirmText = $localize `Confirm`;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  dismiss() {
    this.activeModal.dismiss();
  }

  confirm() {
    this.activeModal.close();
  }
}

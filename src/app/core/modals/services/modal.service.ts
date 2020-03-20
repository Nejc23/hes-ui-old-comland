import { Injectable } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.centered = true;
  }

  open(content, options?: NgbModalOptions): NgbModalRef {
    return this.modalService.open(content, options);
  }
}

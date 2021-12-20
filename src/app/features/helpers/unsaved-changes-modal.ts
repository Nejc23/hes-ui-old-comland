import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesModal {
  constructor(private translate: TranslateService, private modalService: ModalService) {}

  showModal(confirmCallbackFunction: () => any, modalTitle?: string, modalBody?: string): Promise<any> {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.modalTitle = modalTitle ?? this.translate.instant('MODAL.UNSAVED-CHANGES');
    component.modalBody = modalBody ?? this.translate.instant('MODAL.UNSAVED-CHANGES-TEXT');

    return of(
      modalRef.result.then(
        () => {
          confirmCallbackFunction();
          return true;
        },
        () => {
          return false;
        }
      )
    ).toPromise();
  }
}

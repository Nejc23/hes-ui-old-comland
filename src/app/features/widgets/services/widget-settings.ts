import { Injectable } from '@angular/core';
import { ModalService } from 'src/app/shared/modals/services/modal.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WidgetSettingsInput } from 'src/app/shared/modals/interfaces/widget-settings-input.interface';

@Injectable({
  providedIn: 'root'
})
export class WidgetSettingsService {
  constructor(private modalService: ModalService) {}

  openWidgetSettings(id: string, widgetSettings: any, settingFormComponent: any) {
    const modalRef = this.modalService.open(widgetSettings) as NgbModalRef;
    const component: WidgetSettingsInput = modalRef.componentInstance;
    component.formComponent = settingFormComponent;
    component.id = id;
    modalRef.result.then(() => {}).catch(() => {});
  }
}

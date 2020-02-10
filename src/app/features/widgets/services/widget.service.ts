import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WidgetFactory } from '../helpers/widget-factory.helper';
import { ModalService } from 'src/app/shared/modals/services/modal.service';
import { WidgetType } from '../enums/widget-type.enum';
import { WidgetSettingsInput } from 'src/app/shared/modals/interfaces/widget-settings-input.interface';
import { DashboardGridItemResponse } from 'src/app/shared/repository/interfaces/responses/dashboard-grid-response.interface';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  constructor(private i18n: I18n, private modalService: ModalService) {}

  getWidget(widgetType: WidgetType) {
    const factory = new WidgetFactory(this.i18n);
    return factory.getWidget(widgetType);
  }

  getSettingsModal(widgetType: WidgetType) {
    return this.getWidget(widgetType).getSettingsModalComponent();
  }

  getSettingsFormComponent(widgetType: WidgetType) {
    return this.getWidget(widgetType).getSettingsFormComponent();
  }

  getGridWidgetComponent(widgetType: WidgetType) {
    return this.getWidget(widgetType).getGridWidgetComponent();
  }

  getWidgetContent(widgetType: WidgetType) {
    return this.getWidget(widgetType).getContent();
  }

  /*  getReadings(item: DashboardGridItemResponse) {
    return this.getWidget(item.widgetType).getReadings(item);
  }*/

  // TODO: support callback for this
  openSettingsModal(id: string, widgetType: WidgetType) {
    const modalRef = this.modalService.open(this.getSettingsModal(widgetType)) as NgbModalRef;
    const component: WidgetSettingsInput = modalRef.componentInstance;
    component.formComponent = this.getSettingsFormComponent(widgetType);
    component.id = id;
    modalRef.result.then(() => {}).catch(() => {});
  }
}

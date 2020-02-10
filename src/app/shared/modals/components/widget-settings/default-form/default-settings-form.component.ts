import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DefaultWidgetSettingsForm } from '../../../interfaces/default-widget-settings.interface';
import { Codelist } from 'src/app/shared/forms/interfaces/codelist.interface';
import { Observable, of } from 'rxjs';
import { ModalWidgetService } from '../../../services/modal-widget.service';
import { WidgetSettings } from 'src/app/features/widgets/interfaces/widget-settings.interface';
import { DashboardStoreService } from 'src/app/features/dashboard/services/dashboard-store.service';
import * as _ from 'lodash';
import { CodelistPowerline, CodelistDevice } from 'src/app/shared/forms/interfaces/codelist-powerline.interface';

@Component({
  selector: 'app-default-settings-form',
  templateUrl: './default-settings-form.component.html'
})
export class DefaultSettingsFormComponent implements OnInit, WidgetSettings {
  @Input() form: FormGroup;
  @Input() id: string;

  powerlineOptions: Observable<CodelistPowerline[]>;
  deviceOptions: Observable<CodelistDevice[]>;

  constructor(public i18n: I18n, private modalWidgetService: ModalWidgetService, private dashboardStore: DashboardStoreService) {}

  ngOnInit() {
    this.modalWidgetService.addControls(this.form);
    this.powerlineOptions = this.modalWidgetService.getPowerlines();

    const properties = this.dashboardStore.getGridDashboard().find(x => x.id === this.id).properties;
    this.form.setValue({
      [nameOf<DefaultWidgetSettingsForm>(o => o.powerlineId)]: properties ? properties.powerline : null,
      [nameOf<DefaultWidgetSettingsForm>(o => o.deviceId)]: properties ? properties.device : null,
      [nameOf<DefaultWidgetSettingsForm>(o => o.displayHistoryGraph)]:
        properties && properties.displayGraph ? properties.displayGraph : false
    });

    this.form.controls[nameOf<DefaultWidgetSettingsForm>(o => o.powerlineId)].setValidators([Validators.required]);
    this.onSelectPowerline(properties !== null ? properties.powerline : null, false);
  }

  onSelectPowerline(item: number, clearDevice: boolean = true) {
    this.powerlineOptions.subscribe(x => {
      const selectedPowerline = x.filter(powerline => powerline.id === Number(this.form.get(this.powerlineProperty).value)).pop();
      this.deviceOptions = of(selectedPowerline ? selectedPowerline.devices : null);
      if (clearDevice) {
        this.clearDeviceSelection();
      }
    });
  }

  // clear selection
  clearDeviceSelection() {
    this.form.get([nameOf<DefaultWidgetSettingsForm>(o => o.deviceId)]).setValue(null);
  }

  get powerlineProperty() {
    return nameOf<DefaultWidgetSettingsForm>(o => o.powerlineId);
  }

  get deviceProperty() {
    return nameOf<DefaultWidgetSettingsForm>(o => o.deviceId);
  }

  get historyGraphProperty() {
    return nameOf<DefaultWidgetSettingsForm>(o => o.displayHistoryGraph);
  }
}

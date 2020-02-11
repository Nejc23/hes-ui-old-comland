import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetSettingsFormDirective } from '../../directives/widget-settings-form.directive';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { WidgetSettingsInput } from '../../interfaces/widget-settings-input.interface';
import { WidgetSettings } from 'src/app/features/widgets/interfaces/widget-settings.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ModaDefaultWidgetService } from 'src/app/core/modals/services/modal-default-widget.service';

@Component({
  selector: 'app-default-widget-setting',
  templateUrl: './default-widget-setting.component.html'
})
export class DefaultWidgetSettingComponent implements OnInit, WidgetSettingsInput {
  @Input() formComponent: any;
  @Input() id: string;

  form = this.formBuilder.group({});

  @ViewChild(WidgetSettingsFormDirective, { static: true }) formHost: WidgetSettingsFormDirective;

  constructor(
    private modal: NgbActiveModal,
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private service: ModaDefaultWidgetService,
    private toast: ToastNotificationService,
    public i18n: I18n
  ) {}

  ngOnInit() {
    this.loadFormComponent();
  }

  loadFormComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.formComponent);
    const viewContainerRef = this.formHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(componentFactory);

    (componentRef.instance as WidgetSettings).form = this.form;
    (componentRef.instance as WidgetSettings).id = this.id;
  }

  canSubmit(): boolean {
    return this.form && this.form.valid;
  }

  onDismiss() {
    this.modal.dismiss();
  }

  save() {
    if (!this.canSubmit()) {
      this.touchAllFormElements(this.form);
      this.toast.warningToast(this.i18n('invalid form'));
      return;
    }
    this.service.setDashboardSettings(this.form, this.id);
    this.modal.close();
  }

  touchAllFormElements(form: FormGroup) {
    _.each(form.controls, (x: AbstractControl) => {
      if (_.has(x, 'controls')) {
        this.touchAllFormElements(x as any);
      } else {
        x.markAsDirty();
      }
    });
  }
}

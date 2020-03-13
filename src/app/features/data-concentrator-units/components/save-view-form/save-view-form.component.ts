import { Component, OnInit } from '@angular/core';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-save-view-form',
  templateUrl: './save-view-form.component.html'
})
export class SaveViewFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private toast: ToastNotificationService,
    public i18n: I18n,
    private modal: NgbActiveModal
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {}

  createForm(): FormGroup {
    return this.formBuilder.group({
      ['name']: ['']
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }

  save() {
    // TODO: read session and save
  }

  get namePropety() {
    return 'name';
  }
}

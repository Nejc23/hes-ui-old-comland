import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { nameOfFactory } from '../../utils/consts/nameOfFactory.const';
import { ChangePasswordRequest } from '../../repository/interfaces/responses/authentication.interface';
import { FormsUtilsService } from '../../forms/services/forms-utils.service';
import { ToastNotificationService } from '../../toast-notification/services/toast-notification.service';
import { tap } from 'rxjs/operators';
import { matchPasswordsValidator } from './consts/password-validators';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html'
})
export class ModalChangePasswordComponent implements OnInit {
  form: FormGroup;
  nameOf = nameOfFactory<ChangePasswordRequest>();

  constructor(
    private service: AuthenticationRepositoryService,
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
    return this.formBuilder.group(
      {
        [this.nameOf('oldPassword')]: ['', Validators.required],
        [this.nameOf('newPassword')]: [
          '',
          [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,}$/)]
        ],
        [this.nameOf('repeatedPassword')]: ['', [Validators.required, Validators.minLength(8)]]
      },
      {
        validators: [matchPasswordsValidator]
      }
    );
  }

  save() {
    const request = this.service.changePassword(this.form.value);
    const successMessage = this.i18n('Change password successful');
    this.formUtils
      .saveForm(this.form, request, successMessage)
      .pipe(tap(() => this.modal.close()))
      .subscribe(
        response => {},
        () => {}
      );
  }

  onDismiss() {
    this.modal.dismiss();
  }

  get oldPasswordPropety() {
    return nameOf<ChangePasswordRequest>(o => o.oldPassword);
  }

  get newPasswordPropety() {
    return nameOf<ChangePasswordRequest>(o => o.newPassword);
  }

  get repeatPasswordPropety() {
    return nameOf<ChangePasswordRequest>(o => o.repeatedPassword);
  }
}

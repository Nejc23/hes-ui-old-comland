import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { nameOfFactory } from '../../utils/consts/nameOfFactory.const';
import { tap } from 'rxjs/operators';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ChangePasswordRequest } from 'src/app/core/repository/interfaces/auth/authentication.interface';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { matchPasswordsValidator } from '../../validators/passwords-match-validator';

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
    private modal: NgbActiveModal,
    private i18n: I18n
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
        validators: [matchPasswordsValidator('newPassword', 'repeatedPassword')]
      }
    );
  }

  save() {
    const request = this.service.changePassword(this.form.value);
    const successMessage = this.i18n(`Change password successful`);
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

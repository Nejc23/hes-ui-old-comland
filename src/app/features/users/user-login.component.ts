import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'oidc-client';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { LanguageService } from 'src/app/core/base-template/services/language.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NewPasswordFrom, ResetPasswordRequest } from 'src/app/core/repository/interfaces/auth/authentication.interface';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { nameOfFactory } from 'src/app/shared/utils/consts/nameOfFactory.const';
import { matchPasswordsValidator } from 'src/app/shared/validators/passwords-match-validator';
import { config } from 'src/environments/config';
import { environment } from 'src/environments/environment';
import { VERSION } from 'src/environments/version';
import { UserLoginCredentials } from './models/user-login-form.model';
import { LanguageService } from 'src/app/core/base-template/services/language.service';
import { environment } from 'src/environments/environment';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';
import { NewPasswordFrom, ResetPasswordRequest } from 'src/app/core/repository/interfaces/auth/authentication.interface';
import { User } from 'oidc-client';
import { matchPasswordsValidator } from 'src/app/shared/validators/passwords-match-validator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  form: FormGroup;
  formReset: FormGroup;
  formNewPassword: FormGroup;
  nameOf = nameOfFactory<UserLoginCredentials>();
  nameOfReset = nameOfFactory<ResetPasswordRequest>();
  nameOfNewPassword = nameOfFactory<NewPasswordFrom>();

  public version = '';
  forgotPassword = false;
  resetPassword = false;
  isFormSubmitted = false;
  resetToken = '';

  language = 'English';
  locale = '';

  constructor(
    public authService: AuthService,
    private authRepositoryService: AuthenticationRepositoryService,
    private formUtils: FormsUtilsService,
    public router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastNotificationService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.locale = localStorage.getItem('lang');
    this.form = this.createForm();
    this.formReset = this.createResetForm();
    this.formNewPassword = this.createNewPasswordForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.resetToken = params.resetToken;
      if (this.resetToken !== undefined && this.resetToken.length > 0) {
        this.resetPassword = true;
      }
    });

    this.version = 'Template ' + VERSION.version + ' - ' + VERSION.hash;
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameOf('username')]: ['', Validators.required],
      [this.nameOf('password')]: ['', Validators.required],
      [this.nameOf('language')]: [this.locale]
    });
  }

  createNewPasswordForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.nameOfNewPassword('password')]: [
          '',
          [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,}$/)]
        ],
        [this.nameOfNewPassword('confirmPassword')]: ['', [Validators.required, Validators.minLength(8)]],
        [this.nameOfNewPassword('resetToken')]: [this.resetToken]
      },
      {
        validators: [matchPasswordsValidator('password', 'confirmPassword')]
      }
    );
  }

  createResetForm(): FormGroup {
    return this.formBuilder.group({
      [this.nameOfReset('email')]: ['', [Validators.required, Validators.email]],
      [this.nameOfReset('url')]: [window.location.href]
    });
  }

  reset() {
    const request = this.authRepositoryService.requestPasswordReset(this.formReset.value);
    const successMessage = this.translate.instant('LOGIN.RESET-PASSWORD-SUCCESSFUL');
    this.formUtils.saveForm(this.formReset, request, successMessage).subscribe(
      (response) => {
        this.forgotPassword = false;
      },
      () => {
        this.onError();
      }
    );
  }

  login() {
    this.isFormSubmitted = true;

    const request = this.authRepositoryService.authenticateUserDevelop(this.form.value);
    const successMessage = this.translate.instant('LOGIN.LOGIN-SUCCESSFUL');
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (token) => {
        this.isFormSubmitted = true;
        this.handleLoginResponse2(token);
      },
      () => {
        this.onError();
      }
    );
    this.isFormSubmitted = false;
  }

  newPassword() {
    this.isFormSubmitted = true;

    const request = this.authRepositoryService.newPassword(this.formNewPassword.value);
    const successMessage = this.translate.instant('LOGIN.NEW-PASSWORD-SAVED');
    this.formUtils.saveForm(this.formNewPassword, request, successMessage).subscribe(
      (token) => {
        this.isFormSubmitted = true;
        this.handleLoginResponse(token);
      },
      () => {
        this.onError();
      }
    );
    this.isFormSubmitted = false;
  }

  onError(): () => void {
    return () => {
      this.isFormSubmitted = false;
      const errorMessage = this.translate.instant('LOGIN.FAILED');
      this.toast.errorToast(errorMessage);
    };
  }

  // handle response
  handleLoginResponse(authenticatedUser: AuthenticatedUser) {
    this.authService.saveTokenAndSetUserRights(authenticatedUser);
    this.cookieService.set(config.authTimeStamp, moment().utc().toISOString(), null, environment.cookiePath); // auth stamp for token refresh (isRefreshAllowed)
    this.goToStartPageForAuthorizedUser();
  }

  handleLoginResponse2(authenticatedUser: User) {
    this.authService.user = authenticatedUser;
    this.authService.saveTokenAndSetUserRights2(authenticatedUser, authenticatedUser.id_token);
    this.cookieService.set(config.authTimeStamp, moment().utc().toISOString(), null, environment.cookiePath); // auth stamp for token refresh (isRefreshAllowed)
    this.goToStartPageForAuthorizedUser();
  }

  private goToStartPageForAuthorizedUser() {
    // if (this.permissionService.hasAccess(UserPermission.monitoringModule)) {
    this.router.navigate(['/dataConcentratorUnits']); // Supervisor, Admin
    // }// else {
    // this.router.navigate(['/lead-solver']); // Lead solver
    // }
  }

  get usernameProperty() {
    return this.nameOf('username');
  }

  get passwordProperty() {
    return this.nameOf('password');
  }

  get emailProperty() {
    return this.nameOfReset('email');
  }

  get langProperty() {
    return this.nameOf('language');
  }

  get newPasswordProperty() {
    return this.nameOfNewPassword('password');
  }

  get newConfirmPasswordProperty() {
    return this.nameOfNewPassword('confirmPassword');
  }

  setForgotPassword() {
    this.forgotPassword = true;
  }

  setLogin() {
    this.forgotPassword = false;
  }

  selectLang(id: string) {
    this.languageService.selectLang(id);
  }
}

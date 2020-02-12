import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import 'bootstrap/dist/js/bootstrap.bundle';
import * as moment from 'moment';
import { VERSION } from 'src/environments/version';
import { nameOfFactory } from 'src/app/shared/utils/consts/nameOfFactory.const';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { CookieService } from 'ngx-cookie-service';
import { config } from 'src/environments/config';
import { languages } from 'src/environments/locale';
import { UserLoginCredentials } from './models/user-login-form.model';
import { matchPasswordsValidator } from './consts/login-validators';
import { LanguageService } from 'src/app/core/base-template/services/language.service';
import { environment } from 'src/environments/environment';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';
import { ResetPasswordRequest, NewPasswordFrom } from 'src/app/core/repository/interfaces/auth/authentication.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

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
  languages$: Codelist<string>[];

  public version = '';
  forgotPassword = false;
  resetPassword = false;
  isFormSubmitted = false;
  resetToken = '';

  language = 'English';

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
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.languages$ = languages;
    this.form = this.createForm();
    this.formReset = this.createResetForm();
    this.formNewPassword = this.createNewPasswordForm();
  }

  ngOnInit() {
    this.language = this.languages$.find(x => x.id === this.locale).value;
    this.route.queryParams.subscribe(params => {
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
        validators: [matchPasswordsValidator]
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
    const successMessage = $localize`Reset password request successful`;
    this.formUtils.saveForm(this.formReset, request, successMessage).subscribe(
      response => {
        this.forgotPassword = false;
      },
      () => {
        this.onError();
      }
    );
  }

  login() {
    this.isFormSubmitted = true;

    const request = this.authRepositoryService.authenticateUser(this.form.value);
    const successMessage = $localize`Login successful`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      token => {
        this.isFormSubmitted = true;
        this.handleLoginResponse(token);
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
    const successMessage = $localize`New password successful saved`;
    this.formUtils.saveForm(this.formNewPassword, request, successMessage).subscribe(
      token => {
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
      const errorMessage = $localize`Login failed! Check your credentials ...`;
      this.toast.errorToast(errorMessage);
    };
  }

  // handle response
  handleLoginResponse(authenticatedUser: AuthenticatedUser) {
    this.authService.saveTokenAndSetUserRights(authenticatedUser);
    this.cookieService.set(
      config.authTimeStamp,
      moment()
        .utc()
        .toISOString(),
      null,
      environment.cookiePath
    ); // auth stamp for token refresh (isRefreshAllowed)
    this.goToStartPageForAuthorizedUser();
  }

  private goToStartPageForAuthorizedUser() {
    // if (this.permissionService.hasAccess(UserPermission.monitoringModule)) {
    this.router.navigate(['/dashboard']); // Supervisor, Admin
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

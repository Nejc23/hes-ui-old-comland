import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResetPasswordRequest, ChangePasswordRequest, NewPasswordRequest } from '../interfaces/responses/authentication.interface';
import { LoginCredentials } from '../../../core/auth/interfaces/login-credentials.interface';
import { AuthenticatedUser } from '../../../core/auth/interfaces/authenticated-user.interface';
import { RefreshTokenRequest } from '../../../core/auth/interfaces/refresh-token.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersRepositoryService {
  constructor(private repository: RepositoryService) {}

  authenticateUser(authenticate: LoginCredentials): Observable<AuthenticatedUser> {
    return this.repository.makeRequest(this.authenticateUserRequest(authenticate));
  }

  authenticateUserRequest(authenticate: LoginCredentials): HttpRequest<any> {
    return new HttpRequest('POST', `/api/users/authenticate`, authenticate);
  }

  refreshUserToken(expiredToken: RefreshTokenRequest): Observable<AuthenticatedUser> {
    return this.repository.makeRequest(this.refreshUserTokenRequest(expiredToken));
  }

  refreshUserTokenRequest(expiredToken: RefreshTokenRequest): HttpRequest<any> {
    return new HttpRequest('POST', `/api/users/refresh`, expiredToken);
  }

  requestPasswordReset(eMail: ResetPasswordRequest): Observable<any> {
    return this.repository.makeRequest(this.requestPasswordResetRequest(eMail));
  }

  requestPasswordResetRequest(eMail: ResetPasswordRequest): HttpRequest<any> {
    return new HttpRequest('POST', `/api/users/request-password-reset`, eMail);
  }

  changePassword(changePassword: ChangePasswordRequest): Observable<any> {
    return this.repository.makeRequest(this.changePasswordRequest(changePassword));
  }

  changePasswordRequest(changePassword: ChangePasswordRequest): HttpRequest<any> {
    return new HttpRequest('POST', `/api/users/change-password`, changePassword);
  }

  newPassword(newPassword: NewPasswordRequest): Observable<AuthenticatedUser> {
    return this.repository.makeRequest(this.newPasswordRequest(newPassword));
  }

  newPasswordRequest(newPassword: NewPasswordRequest): HttpRequest<any> {
    return new HttpRequest('POST', `/api/users/new-password`, newPassword);
  }
}

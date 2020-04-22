import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from '../repository.service';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';
import { LoginCredentials } from 'src/app/core/auth/interfaces/login-credentials.interface';
import { RefreshTokenRequest } from 'src/app/core/auth/interfaces/refresh-token.interface';
import {
  authenticateUserEndpointUrl,
  authenticateRefreshTokenEndpointUrl,
  requestPasswordResetEndpointUrl,
  changePasswordEndpointUrl,
  newPasswordEndpointUrl,
  authenticateUserEndpointUrlDevelop
} from '../../consts/authentication-endpoint-url.const';
import { ResetPasswordRequest, ChangePasswordRequest, NewPasswordRequest } from '../../interfaces/auth/authentication.interface';
import { User } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationRepositoryService {
  constructor(private repository: RepositoryService) {}

  authenticateUser(authenticate: LoginCredentials): Observable<AuthenticatedUser> {
    return this.repository.makeRequest(this.authenticateUserRequest(authenticate));
  }

  authenticateUserRequest(authenticate: LoginCredentials): HttpRequest<any> {
    return new HttpRequest('POST', `${authenticateUserEndpointUrl}`, authenticate);
  }

  authenticateUserDevelop(authenticate: LoginCredentials): Observable<User> {
    return this.repository.makeRequest(this.authenticateUserDevelopRequest(authenticate));
  }

  authenticateUserDevelopRequest(authenticate: LoginCredentials): HttpRequest<any> {
    return new HttpRequest('POST', `${authenticateUserEndpointUrlDevelop}`, authenticate);
  }

  refreshUserToken(expiredToken: RefreshTokenRequest): Observable<AuthenticatedUser> {
    return this.repository.makeRequest(this.refreshUserTokenRequest(expiredToken));
  }

  refreshUserTokenRequest(expiredToken: RefreshTokenRequest): HttpRequest<any> {
    return new HttpRequest('POST', `${authenticateRefreshTokenEndpointUrl}`, expiredToken);
  }

  requestPasswordReset(eMail: ResetPasswordRequest): Observable<any> {
    return this.repository.makeRequest(this.requestPasswordResetRequest(eMail));
  }

  requestPasswordResetRequest(eMail: ResetPasswordRequest): HttpRequest<any> {
    return new HttpRequest('POST', `${requestPasswordResetEndpointUrl}`, eMail);
  }

  changePassword(changePassword: ChangePasswordRequest): Observable<any> {
    return this.repository.makeRequest(this.changePasswordRequest(changePassword));
  }

  changePasswordRequest(changePassword: ChangePasswordRequest): HttpRequest<any> {
    return new HttpRequest('POST', `${changePasswordEndpointUrl}`, changePassword);
  }

  newPassword(newPassword: NewPasswordRequest): Observable<AuthenticatedUser> {
    return this.repository.makeRequest(this.newPasswordRequest(newPassword));
  }

  newPasswordRequest(newPassword: NewPasswordRequest): HttpRequest<any> {
    return new HttpRequest('POST', `${newPasswordEndpointUrl}`, newPassword);
  }
}

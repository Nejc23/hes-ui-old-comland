export interface ResetPasswordRequest {
  email: string;
  url: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  repeatedPassword?: string;
}

export interface NewPasswordRequest {
  password: string;
  resetToken: string;
}
export interface NewPasswordFrom extends NewPasswordRequest {
  confirmPassword: string;
}

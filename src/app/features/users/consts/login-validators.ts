import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const matchPasswordsValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPassword = control.get('password');
  if (!newPassword.value) {
    newPassword.setErrors({ required: true });
    return { required: true };
  }

  const repeatedPassword = control.get('confirmPassword');
  if (!repeatedPassword.value) {
    repeatedPassword.setErrors({ required: true });
    return { required: true };
  }

  // check mach passwords
  if (newPassword.value !== repeatedPassword.value) {
    repeatedPassword.setErrors({ notMatchPassword: true });
    return { notMatchPassword: true };
  } else {
    repeatedPassword.setErrors(null);
  }

  return null;
};

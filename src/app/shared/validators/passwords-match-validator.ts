import { FormGroup } from '@angular/forms';

export function matchPasswordsValidator(passwordField: string, confirmPasswordField: string) {
  return (formGroup: FormGroup) => {
    const newPassword = formGroup.get(passwordField);

    if (newPassword.disabled) {
      return null;
    }

    if (!newPassword.value) {
      newPassword.setErrors({ required: true });
      return { required: true };
    }

    const repeatedPassword = formGroup.get(confirmPasswordField);

    if (repeatedPassword.disabled) {
      return null;
    }

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
}

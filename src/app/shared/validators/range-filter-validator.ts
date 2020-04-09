import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const rangeFilterValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const controlVal1 = control.get('value1');
  const controlVal2 = control.get('value2');
  const operation = control.get('operation');

  // check date Format
  if (
    operation.value != null &&
    operation.value.id === 'In Range' &&
    controlVal1.value != null &&
    controlVal2.value != null &&
    controlVal1.value > controlVal2.value
  ) {
    controlVal2.setErrors({ incorrectRange: true });
    return { incorrectRange: true };
  }
  return null;
};

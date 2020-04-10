import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const rangeFilterValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const controlVal1 = control.get('value1');
  const controlVal2 = control.get('value2');
  const operation = control.get('operation');

  // out of range
  if (controlVal1.value != null && (controlVal1.value > 100 || controlVal1.value < 0)) {
    controlVal1.setErrors({});
    return { outOfRange: true };
  } else {
    controlVal1.setErrors(null);
  }

  // out of range
  if (controlVal2.value != null && (controlVal2.value > 100 || controlVal2.value < 0)) {
    controlVal2.setErrors({});
    return { outOfRange: true };
  } else {
    controlVal2.setErrors(null);
  }

  // check
  if (
    operation.value != null &&
    operation.value.id === 'In Range' &&
    controlVal1.value >= 0 &&
    controlVal1.value <= 100 &&
    controlVal1.value > controlVal2.value
  ) {
    controlVal1.setErrors({});
    controlVal2.setErrors({});
    return { incorrectValueRange: true };
  } else if (
    operation.value != null &&
    operation.value.id === 'In Range' &&
    controlVal1.value >= 0 &&
    controlVal1.value <= 100 &&
    controlVal1.value <= controlVal2.value
  ) {
    controlVal1.setErrors(null);
    controlVal2.setErrors(null);
  }
  return null;
};

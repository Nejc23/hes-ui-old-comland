import { of } from 'rxjs';
import { FormsUtilsService } from 'src/app/shared/forms/services/forms-utils.service';

export const mockFormUtils = {
  hasFormControlRequiredField: () => false,
  saveForm: () => of(null),
  throwErrorWithToastIfInvalid: () => {},
  touchAllFormElements: () => {},
  shouldInputShowErrors: () => false
} as Partial<FormsUtilsService>;

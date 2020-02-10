import { FormGroup } from '@angular/forms';

export interface UsersSearchFilter {
  content: string;
}

export class State {
  form: FormGroup | null;
}

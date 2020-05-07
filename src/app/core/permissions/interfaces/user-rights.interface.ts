import { ActionEnumerator } from '../enumerators/action-enumerator.model';

export interface UserRight {
  functionality: string;
  writeRights: boolean;
  action: ActionEnumerator[];
}

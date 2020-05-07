import { UserRight } from './user-rights.interface';
import { RoleEnumerator } from '../enumerators/role-enumerator.model';

export interface Role {
  role: RoleEnumerator;
  userRights: UserRight[];
}

import { UserRight } from '../../permissions/interfaces/user-rights.interface';

export interface AuthenticatedUser {
  tokenType: string;
  accessToken: string;
  expireDate: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  email: string;
  accessType: string;
  userRights: UserRight[];
}

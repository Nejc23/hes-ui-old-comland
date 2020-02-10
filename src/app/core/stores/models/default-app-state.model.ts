import { AppState } from '../interfaces/app-state.interface';
import { UserInfo } from '../../auth/interfaces/user-info.interface';

export class DefaultAppState implements AppState {
  user: UserInfo = null;
}

import { Observable } from 'rxjs';

export interface StoreContract<T> {
  stateObservable: Observable<T>;
  state: T;
  setState: (nextState: T) => void;
}

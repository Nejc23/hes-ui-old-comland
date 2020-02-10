import { BehaviorSubject, Observable } from 'rxjs';

export abstract class Store<T> {
  private state$: BehaviorSubject<T>;

  protected constructor(initialState: T) {
    this.state$ = new BehaviorSubject(initialState);
  }

  get stateObservable(): Observable<T> {
    return this.state$.asObservable();
  }

  get state(): T {
    return this.state$.getValue();
  }

  setState(nextState: T): void {
    this.state$.next(nextState);
  }
}

export interface UnitCodeListItemClient<T> {
  id: string; // guid
  externalId: T;
  value: string;
  textField: string;
  fakeId?: T;
}

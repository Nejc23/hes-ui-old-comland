export interface UnitClient<ExternalIdType, UnitItemsType> {
  id: string;
  externalId: ExternalIdType;
  description: string;
  units: Array<UnitItemsType>;
  fakeId?: number;
}

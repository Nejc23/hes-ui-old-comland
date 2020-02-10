// Sort event object recieved from ngxdatable (clientside)
export interface TableSortEvent {
  column: { prop: string };
  newValue: string;
}

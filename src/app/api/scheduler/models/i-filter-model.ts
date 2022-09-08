/* tslint:disable */
/* eslint-disable */
import { CodeList } from './code-list';
import { ReadStatus } from './read-status';
export interface IFilterModel {
  ciiState?: null | Array<CodeList>;
  disconnectorState?: null | Array<CodeList>;
  firmware?: null | Array<CodeList>;
  readStatus?: ReadStatus;
  readyForActivation?: null | boolean;
  showChildInfoMBus?: null | boolean;
  showDeleted?: boolean;
  showWithoutTemplate?: null | boolean;
  state?: null | Array<CodeList>;
  tags?: null | Array<CodeList>;
  types?: null | Array<number>;
  vendor?: CodeList;
}

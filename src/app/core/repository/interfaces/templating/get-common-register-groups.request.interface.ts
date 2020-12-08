import { IActionSearchParam } from './../myGridLink/action-prams.interface';
import { IActionFilterParams } from '../myGridLink/action-prams.interface';

export interface GetCommonRegisterGroupsRequest {
  deviceIds: string[];
  excludeIds: string[];
  filter: IActionFilterParams[];
  search: IActionSearchParam;
  type: number;
}

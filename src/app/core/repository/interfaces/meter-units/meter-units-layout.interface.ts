import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ReadStatus } from '../helpers/grid-request-params.interface';

export interface MeterUnitsLayout {
  id: number;
  name: string;
  vendorFilter: Codelist<number>;
  statusesFilter: Codelist<number>[];
  readStatusFilter: ReadStatus;
  tagsFilter: Codelist<number>[];
  firmwareFilter: Codelist<number>[];
  breakerStateFilter: Codelist<number>[];
  ciiStateFilter: Codelist<number>[];
  showOnlyMeterUnitsWithMBusInfoFilter: boolean;
  showMeterUnitsWithoutTemplateFilter: boolean;
  showOnlyImageReadyForActivationFilter: boolean;
  gridLayout: string;
}

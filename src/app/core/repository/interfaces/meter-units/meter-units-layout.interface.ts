import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ReadStatus } from '../helpers/grid-request-params.interface';
import { LastCommunicationFilter } from '../data-concentrator-units/dcu-layout.interface';

export interface MeterUnitsLayout {
  id: number;
  name: string;
  vendorsFilter: Codelist<number>[];
  statesFilter: Codelist<number>[];
  readStatusFilter: ReadStatus;
  tagsFilter: Codelist<number>[];
  appFirmwareFilter: Codelist<number>[];
  moduleFirmwareFilter: Codelist<number>[];
  metrologyFirmwareFilter: Codelist<number>[];
  breakerStateFilter: Codelist<number>[];
  ciiStateFilter: Codelist<number>[];
  showOptionFilter: Codelist<number>[];
  showOnlyMeterUnitsWithMBusInfoFilter: boolean;
  showMeterUnitsWithoutTemplateFilter?: boolean;
  showOnlyImageReadyForActivationFilter?: boolean;
  gridLayout: string;
  mediumFilter?: Codelist<number>[];
  protocolFilter?: Codelist<number>[];
  slaFilter?: Codelist<number>;
  importDevicesField?: Codelist<number>[];
  lastCommunicationFilter: LastCommunicationFilter;
}

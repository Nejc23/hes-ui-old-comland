import { Codelist } from './codelist.interface';

export interface CodelistExt<T> extends Codelist<T> {
  nextRun: string;
}

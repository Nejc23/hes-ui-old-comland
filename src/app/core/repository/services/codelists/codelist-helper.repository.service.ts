import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodelistHelperService {
  constructor() {}

  public operationsList() {
    const result: Codelist<string>[] = [
      { id: 'Equals', value: `Equals` },
      { id: 'Not Equals', value: `Not Equals` },
      { id: 'Less than', value: `Less than` },
      { id: 'Greater than', value: `Greater than` },
      { id: 'In Range', value: `In Range` }
    ];

    return result;
  }

  public showOptionFilterList() {
    const showOptions: Codelist<number>[] = [
      { id: 1, value: `With template` },
      { id: 2, value: `Without template` },
      { id: 3, value: `Image ready for activation` },
      { id: 4, value: `HLS enabled` },
      { id: 5, value: `HLS disabled` }
    ];

    return showOptions;
  }
}

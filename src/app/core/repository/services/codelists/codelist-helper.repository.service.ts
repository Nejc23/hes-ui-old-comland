import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodelistHelperService {
  constructor() {}

  public operationsList() {
    const result: Codelist<string>[] = [
      { id: 'Equals', value: $localize`Equals` },
      { id: 'Not Equals', value: $localize`Not Equals` },
      { id: 'Less than', value: $localize`Less than` },
      { id: 'Greater than', value: $localize`Greater than` },
      { id: 'In Range', value: $localize`In Range` }
    ];

    return result;
  }
}

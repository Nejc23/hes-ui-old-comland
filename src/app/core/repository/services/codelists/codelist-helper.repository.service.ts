import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Injectable({
  providedIn: 'root'
})
export class CodelistHelperService {
  constructor(private i18n: I18n) {}

  public operationsList() {
    const result: Codelist<string>[] = [
      { id: 'Equals', value: this.i18n('Equals') },
      { id: 'Not Equals', value: this.i18n('Not Equals') },
      { id: 'Less than', value: this.i18n('Less than') },
      { id: 'Greater than', value: this.i18n('Greater than') },
      { id: 'In Range', value: this.i18n('In Range') }
    ];

    return result;
  }
}

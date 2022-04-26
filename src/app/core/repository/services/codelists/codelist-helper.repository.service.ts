import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CodelistHelperService {
  constructor(private translate: TranslateService) {}

  public operationsList() {
    const result: Codelist<string>[] = [
      { id: 'Equals', value: this.translate.instant('COMMON.EQUALS') },
      { id: 'Not Equals', value: this.translate.instant('COMMON.NOT-EQUALS') },
      { id: 'Less than', value: this.translate.instant('COMMON.LESS-THAN') },
      { id: 'Greater than', value: this.translate.instant('COMMON.GREATER-THAN') },
      { id: 'In Range', value: this.translate.instant('COMMON.IN-RANGE') }
    ];

    return result;
  }

  public showOptionFilterList() {
    const showOptions: Codelist<number>[] = [
      { id: 1, value: this.translate.instant('COMMON.WITH-TEMPLATE') },
      { id: 2, value: this.translate.instant('COMMON.WITHOUT-TEMPLATE') },
      { id: 3, value: this.translate.instant('COMMON.IMAGE-READY-FOR-ACTIVATION') },
      { id: 4, value: this.translate.instant('COMMON.HLS-ENABLED') },
      { id: 5, value: this.translate.instant('COMMON.HLS-DISABLED') },
      { id: 6, value: this.translate.instant('COMMON.SERIAL-MISMATCH') }
    ];

    return showOptions;
  }
}

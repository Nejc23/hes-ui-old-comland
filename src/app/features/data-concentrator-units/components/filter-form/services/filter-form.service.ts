import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DcuLayout } from '../../../../../core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { EditService$1 } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs/internal/Observable';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';

@Injectable({
  providedIn: 'root'
})
export class FilterFormService {
  constructor(private formUtils: FormsUtilsService, private dcuRepository: DataConcentratorUnitsService) {}

  save() {
    //const request = this.dcuRepository.saveDcuFilter()
  }
}

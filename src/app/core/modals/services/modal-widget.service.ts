import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { DefaultWidgetSettingsForm } from 'src/app/shared/modals/interfaces/default-widget-settings.interface';
import { CodelistRepositoryService } from '../../repository/services/codelists/codelist-repository.service';
import { CodelistPowerline } from 'src/app/shared/repository/interfaces/codelists/codelist-powerline.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalWidgetService {
  constructor(private codelistRepository: CodelistRepositoryService) {}

  addControls(form: FormGroup) {
    const powerlineControl = new FormControl('', [Validators.required]);
    const deviceControl = new FormControl('');
    const graphControl = new FormControl('');

    form.addControl(
      nameOf<DefaultWidgetSettingsForm>(o => o.powerlineId),
      powerlineControl
    );
    form.addControl(
      nameOf<DefaultWidgetSettingsForm>(o => o.deviceId),
      deviceControl
    );
    form.addControl(
      nameOf<DefaultWidgetSettingsForm>(o => o.displayHistoryGraph),
      graphControl
    );
  }

  getPowerlines(): Observable<CodelistPowerline[]> {
    return this.codelistRepository.powerlineCodelist();
  }
}

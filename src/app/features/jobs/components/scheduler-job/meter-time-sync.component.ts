import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-meter-time-sync',
  templateUrl: './meter-time-sync.component.html'
})
export class MeterTimeSyncComponent {
  @Input() form: FormGroup;

  constructor(private formBuilder: FormBuilder, private formUtils: FormsUtilsService) {}
}

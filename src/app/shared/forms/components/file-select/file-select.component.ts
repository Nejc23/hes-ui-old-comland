import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html'
})
export class FileSelectComponent implements OnInit {
  // Required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() textExplanation: string;
  @Input() multiple = true;
  @Input() allowedExtensions: string[] = [];
  @Output() selectEvent = new EventEmitter<any>();

  controlId: string;
  restrictions: FileRestrictions;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    this.restrictions = {
      allowedExtensions: this.allowedExtensions
    };

    if (!this.form) {
      throw Error('FileSelectComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('FileSelectComponent - property input missing.');
    }

    this.controlId = _.uniqueId('fileSelect');
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }

  onSelect(event) {
    this.selectEvent.emit(event);
  }
}

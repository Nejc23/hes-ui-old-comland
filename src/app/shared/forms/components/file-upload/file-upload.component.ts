import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent implements OnInit {
  // Required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() uploadSaveUrl: string;
  @Input() uploadRemoveUrl: string;
  @Input() textExplanation: string;
  @Input() multiple = true;
  @Input() autoUpload = true;
  @Input() allowedExtensions: string[] = [];
  @Output() successEvent = new EventEmitter<any>();

  controlId: string;
  restrictions: FileRestrictions;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    this.restrictions = {
      allowedExtensions: this.allowedExtensions
    };

    if (!this.form) {
      throw Error('FileUploadComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('FileUploadComponent - property input missing.');
    }

    if (!this.uploadSaveUrl) {
      throw Error('FileUploadComponent - property upload save URL missing.');
    }

    if (!this.uploadRemoveUrl) {
      throw Error('FileUploadComponent - property upload remove URL missing.');
    }

    this.controlId = _.uniqueId('fileUpload');
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

  onSuccess(event) {
    this.successEvent.emit(event);
  }
}

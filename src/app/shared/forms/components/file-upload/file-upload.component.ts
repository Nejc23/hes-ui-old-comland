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
  @Input() responseType = 'json';
  @Input() acceptExtensions = '';
  @Output() successEvent = new EventEmitter<any>();
  @Output() uploadEvent = new EventEmitter<any>();

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
    console.log('success');
    this.successEvent.emit(event);
  }
  errorEventHandler(event) {
    console.log(event);
  }

  uploadEventHandler(event) {
    this.uploadEvent.emit(event);
  }
}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FileRestrictions, UploadProgressEvent } from '@progress/kendo-angular-upload';
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
  @Input() acceptExtensions: string[] = [];
  @Input() saveField = 'files';
  @Input() isDropZoneCustom = false;
  @Input() dropUploadSubtitle = '';
  @Output() successEvent = new EventEmitter<any>();
  @Output() uploadEvent = new EventEmitter<any>();

  @ViewChild('upload') upload: any;

  controlId: string;
  restrictions: FileRestrictions;
  isUploadInProgress = false;
  isUploadOk = false;
  isUploadFailed = false;
  uploadProgressValue = 0;

  isDropZoneHover = false;

  fileName = '';

  dragEnterCount = 0; // dragEnter and leave are fired for each child element

  @ViewChild('customDropzone') dropZone: ElementRef;

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
    this.isUploadInProgress = false;
    this.isUploadOk = true;
    this.successEvent.emit(event);
  }

  errorEventHandler(event) {
    this.isUploadFailed = true;
    this.isUploadInProgress = false;
  }

  uploadEventHandler(event) {
    this.resetUploadFlags();
    this.isUploadInProgress = true;
    this.fileName = event.files[0].name;
    this.uploadEvent.emit(event);
  }

  resetUploadFlags() {
    this.isUploadInProgress = false;
    this.isUploadOk = false;
    this.isUploadFailed = false;
    this.uploadProgressValue = 0;
    this.fileName = null;
  }

  onFileSelectClick() {
    this.upload.fileSelect.nativeElement.click();
  }

  uploadProgress(event: UploadProgressEvent) {
    this.uploadProgressValue = +event.percentComplete;
  }

  onDropZoneEnter(event: any) {
    this.dragEnterCount++;
    this.isDropZoneHover = true;
  }

  onDropZoneLeave(event: any) {
    this.dragEnterCount--;
    if (this.dragEnterCount === 0) {
      this.isDropZoneHover = false;
    }
  }

  onDropZoneEnd(event: any) {
    this.dragEnterCount = 0;
    this.isDropZoneHover = false;
  }

  fileSelected(e: any) {
    this.resetUploadFlags();

    const files = e.files;
    let isAcceptedImageFormat = true;

    if (this.acceptExtensions && this.acceptExtensions.length > 0) {
      isAcceptedImageFormat = $.inArray(files[0].extension, this.acceptExtensions) !== -1;
    }

    this.fileName = files[0].name;

    if (!isAcceptedImageFormat) {
      // console.log('File extension is not supported:', files[0].extension, '. Supported file extensions:', this.acceptExtensions);
      e.preventDefault();
      this.isUploadFailed = true;
      this.isUploadInProgress = false;
    }
  }
}

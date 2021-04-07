import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FileRestrictions, UploadProgressEvent } from '@progress/kendo-angular-upload';
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
  @Input() acceptExtensions: string[] = [];

  @Input() isDropZoneCustom = true;
  @Input() dropFileSelectSubtitle = '';

  @Output() selectEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<any>();

  @ViewChild('uploadSample') upload: any;

  controlId: string;
  restrictions: FileRestrictions;

  dragEnterCount = 0; // dragEnter and leave are fired for each child element

  isFileSelectOk = false;
  isFileSelectFailed = false;
  uploadProgressValue = 0;

  isDropZoneHover = false;

  fileName = '';

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

  onRemove(event) {
    this.removeEvent.emit(event);
  }

  onSuccess(event) {
    this.isFileSelectOk = true;
    this.selectEvent.emit(event);
  }

  errorEventHandler(event) {
    this.isFileSelectFailed = true;
  }

  resetFileSelectFlags() {
    this.isFileSelectOk = false;
    this.isFileSelectFailed = false;
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
    this.resetFileSelectFlags();

    const files = e.files;
    let isAcceptedImageFormat = true;

    console.log('acceptExtensions', this.acceptExtensions);
    console.log('files', files);
    console.log('files[0].extensions', files[0].extension);
    if (this.acceptExtensions && this.acceptExtensions.length > 0) {
      isAcceptedImageFormat = $.inArray(files[0].extension, this.acceptExtensions) !== -1;
    }

    console.log('isAcceptedImageFormat', isAcceptedImageFormat);

    this.fileName = files[0].name;

    if (!isAcceptedImageFormat) {
      // console.log('File extension is not supported:', files[0].extension, '. Supported file extensions:', this.acceptExtensions);
      e.preventDefault();
      this.isFileSelectFailed = true;
    } else {
      this.selectEvent.emit(e);
      this.isFileSelectOk = true;
    }
  }
}

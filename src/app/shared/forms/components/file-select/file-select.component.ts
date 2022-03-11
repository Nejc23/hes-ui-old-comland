import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FileRestrictions, UploadProgressEvent } from '@progress/kendo-angular-upload';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html'
})
export class FileSelectComponent implements OnInit, OnChanges {
  // Required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() textExplanation: string;
  @Input() multiple = true;
  @Input() allowedExtensions: string[] = [];
  @Input() acceptExtensions: string[] = [];
  @Input() isRequired = true;
  @Input() isDropZoneCustom = true;
  @Input() dropFileSelectSubtitle = '';

  @Output() selectEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<any>();
  @Output() fileValid = new EventEmitter<boolean>();
  @Input() clearData = false;

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

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  get accept(): string {
    return this.acceptExtensions.join(', ');
  }

  ngOnChanges() {
    if (this.clearData) {
      this.resetFileSelectFlags();
    }
  }

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

    if (this.acceptExtensions && this.acceptExtensions.length > 0) {
      isAcceptedImageFormat = $.inArray(files[0].extension, this.acceptExtensions) !== -1;
    }

    this.fileName = files[0].name;

    if (!isAcceptedImageFormat) {
      e.preventDefault();
      this.isFileSelectFailed = true;
      this.fileValid.emit(false);
    } else {
      this.selectEvent.emit(e);
      this.isFileSelectOk = true;
      this.fileValid.emit(true);
    }
  }
}

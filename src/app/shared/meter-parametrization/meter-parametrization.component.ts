import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploadComponent } from '../forms/components/file-upload/file-upload.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Codelist } from '../repository/interfaces/codelists/codelist.interface';
import { environment } from '../../../environments/environment';
import { meterParamParse } from '../../core/repository/consts/my-grid-link.const';
import { AuthService } from '../../core/auth/services/auth.service';
import { AppConfigService } from '../../core/configuration/services/app-config.service';
import { MyGridLinkService } from '../../core/repository/services/myGridLink/myGridLink.service';
import { RemoveEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { IActionRequestParams, MeterParametrizationRequest } from '../../core/repository/interfaces/myGridLink/action-prams.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meter-parametrization',
  templateUrl: './meter-parametrization.component.html',
  styleUrls: ['./meter-parametrization.component.scss']
})
export class MeterParametrizationComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: FileUploadComponent;
  form: FormGroup;
  fileTypes: Codelist<string>[] = [{ id: 'XmlBlueLink' as string, value: 'XML - BlueLink' }];
  public actionRequest: IActionRequestParams;

  defaultFileType = this.fileTypes[0];
  apiUrl = environment.apiUrl;
  uploadSaveUrl = this.apiUrl + meterParamParse;

  allowedExt = [];
  acceptExtensions = ['.xml'];
  public files: Array<any>;
  loading = false;
  fileValid = false;
  fileBase64: string;
  uploaded = false;
  execute = false;

  showSecondConfirm = false;
  keyword = '';

  fileName = '';
  numberOfCommands = 0;
  public selectedRowsCount: number;

  get gulfProperty() {
    return 'gulf';
  }

  get fileTypeProperty() {
    return 'fileType';
  }

  get keywordProperty() {
    return 'keyword';
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private management: MyGridLinkService,
    private modal: NgbActiveModal
  ) {
    if (AppConfigService.settings?.apiServer?.url !== '') {
      this.uploadSaveUrl = AppConfigService.settings?.apiServer?.url + meterParamParse;
    }
    if (AppConfigService.settings?.apiServer?.fileStorageUrl !== '') {
      this.uploadSaveUrl = AppConfigService.settings?.apiServer?.fileStorageUrl + meterParamParse;
    }
  }

  ngOnInit(): void {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileTypeProperty]: [this.defaultFileType, Validators.required],
      [this.gulfProperty]: [this.files, Validators.required],
      [this.keywordProperty]: ['']
    });
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  confirm() {
    const body: MeterParametrizationRequest = {
      fileContent: this.fileBase64,
      fileName: this.fileName,
      inputType: this.form.get(this.fileTypeProperty).value.id,
      //filter
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds
    };
    if (this.execute) {
      this.management.postMeterParametrizationExecute(body).subscribe((res) => {
        this.modal.close(res.requestId);
      });
    }
    if (!this.uploaded) {
      this.management.postMeterParametrizationParse(body).subscribe(
        (res) => {
          this.numberOfCommands = res.numberOfCommands;
          this.uploaded = true;
          this.fileValid = res.isValid;
        },
        (error) => {
          //popup
          console.log(error);
          this.uploaded = false;
        }
      );
    }
    if (this.uploaded && !this.execute) {
      this.execute = true;
      this.showSecondConfirm = true;
      this.generateKeyword();
    }
  }

  public selected(e: SelectEvent): void {
    const that = this;
    e.files.forEach((file) => {
      if (!file.validationErrors) {
        const reader = new FileReader();

        reader.onload = function (ev) {
          reader.readAsBinaryString(e.files[0].rawFile);
          that.fileName = e.files[0].name ?? '';
          reader.onload = function (event) {
            that.fileBase64 = btoa(event.target.result.toString());
          };
        };
        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  public removed(e: RemoveEvent): void {
    // this.jsonString = '';
    this.form.reset();
    this.fileBase64 = '';
  }

  isFileValid(event: boolean) {
    this.fileValid = event;
  }

  generateKeyword() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.keyword = result.toUpperCase();
  }

  disableButton() {
    if (!this.execute) {
      return !this.form.valid || !this.fileValid;
    } else {
      return !(this.keyword === this.form.get(this.keywordProperty).value);
    }
  }

  copyText(event: ClipboardEvent) {
    event.preventDefault();
  }
}

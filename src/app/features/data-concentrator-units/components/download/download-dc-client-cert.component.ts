import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoService } from '../../../meter-units/common/services/crypto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CryptoCredentialDto } from '../../../../api/crypto-lite-ui/models/crypto-credential-dto';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './download-dc-client-cert.component.html'
})
export class DownloadDataConcentratorClientCertComponent implements OnInit {
  public alertText: string;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private cryptoService: CryptoService,
    private toast: ToastNotificationService,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log();
  }

  onDismiss() {
    this.modal.dismiss();
  }

  onConfirm() {
    const request: CryptoCredentialDto = {
      password: this.form.get('password').value
    };
    this.cryptoService.downloadDataConcentratorClientCert({ body: request }).subscribe(
      (res) => {
        const filename: string = 'DCClientCert.p12';
        const binaryData = [];
        binaryData.push(res.body);

        const downloadLink = document.createElement('a');

        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();

        this.modal.close();
      },
      (err: HttpErrorResponse) => {
        this.toast.errorToast(this.translate.instant('DCU.CLIENT-CERTS-ERROR'));

        this.modal.close();
      }
    );
  }
}

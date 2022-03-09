import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  form: FormGroup;
  noConfig = false;
  actionRequest: IActionRequestParams;
  allowedExt = [];
  acceptExtensions = [];
  public file: File;
  activate = false;
  differentTypes = false;

  public selectedRowsCount: number;
  public alertText: string;
  uploadDropSubtitle = '';

  ac750 = false;
  // AC750  = .bin
  // DC450G3 and AmeraDC .zip

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private dcuOperatrionService: DataConcentratorUnitsOperationsService,
    private toast: ToastNotificationService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    // this.form = this.createForm();
  }

  // properties - START
  get imageGuidProperty() {
    return 'imageGuid';
  }

  get imageProperty() {
    return 'file';
  }

  ngOnInit() {}
}

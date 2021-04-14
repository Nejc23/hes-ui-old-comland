import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

import {
  IActionRequestParams,
  IActionRequestSetDisconnectorMode
} from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

@Component({
  selector: 'app-plc-meter-breaker-mode',
  templateUrl: './plc-meter-breaker-mode.component.html'
})
export class PlcMeterBreakerModeComponent implements OnInit {
  form: FormGroup;
  disconnectorModes: Codelist<number>[];
  actionRequest: IActionRequestParams;
  errMsg = '';

  selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.disconnectorModeProperty]: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.disconnectorModes = [
      { id: 0, value: $localize`Always connected` },
      { id: 1, value: $localize`Only manual re-connection allowed` },
      { id: 2, value: $localize`Remote and manual re-connection allowed` },
      { id: 3, value: $localize`Only manual re-connection allowed / Manual disconnection not allowed` },
      { id: 4, value: $localize`Remote and manual re-connection allowed / Manual disconnection not allowed` },
      { id: 5, value: $localize`Manual and local re-connection allowed` },
      { id: 6, value: $localize`Manual and local re-connection allowed / Manual disconnection not allowed` }
    ];
  }

  fillData(): IActionRequestSetDisconnectorMode {
    const formData: IActionRequestSetDisconnectorMode = {
      breakerMode: this.form.get(this.disconnectorModeProperty).value ? this.form.get(this.disconnectorModeProperty).value.id : null,
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds
    };

    return formData;
  }

  // properties - START
  get disconnectorModeProperty() {
    return 'disconnectorMode';
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    this.errMsg = '';
    const values = this.fillData();

    const request = this.myGridService.setDisconnectorMode(values);
    const successMessage = $localize`Meter Units set Breaker mode was successfully`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        console.log(result);
        this.modal.close();
      },
      (err) => {
        // error
        this.errMsg = err.error.errors.breakerMode[0];
      }
    );
  }
}

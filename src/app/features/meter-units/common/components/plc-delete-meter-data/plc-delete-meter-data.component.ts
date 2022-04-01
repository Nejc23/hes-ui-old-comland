import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { dateOnlyServerFormat } from 'src/app/shared/forms/consts/date-format';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ModalService } from '../../../../../core/modals/services/modal.service';

export interface DeleteMeterDataPayload {
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-plc-delete-meter-data',
  templateUrl: './plc-delete-meter-data.component.html',
  styleUrls: ['./plc-delete-meter-data.component.scss']
})
export class PlcDeleteMeterDataComponent implements OnInit {
  form: FormGroup;
  payload: DeleteMeterDataPayload;
  selectedTimeRangeType: number = 1;
  timeRangeTypes: Codelist<number>[] = [
    { id: 1, value: this.translate.instant('PLC-METER.DELETE.DELETE-DATA-BEFORE-DATE-OPTION') },
    { id: 2, value: this.translate.instant('PLC-METER.DELETE.DELETE-DATA-AFTER-DATE-OPTION') },
    { id: 3, value: this.translate.instant('PLC-METER.DELETE.DELETE-DATA-ALL-DATA-OPTION') }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private modalService: ModalService
  ) {
    this.form = this.createForm();
  }

  get startDateProperty(): string {
    return 'startDate';
  }

  get endDateProperty(): string {
    return 'endDate';
  }

  get today(): Date {
    return moment().startOf('day').toDate();
  }

  get timeRangeTypesProperty(): string {
    return 'timeRangeTypes';
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.timeRangeTypesProperty]: [this.timeRangeTypes.find((x) => x.id == this.selectedTimeRangeType), Validators.required],
      [this.startDateProperty]: [this.today, Validators.required],
      [this.endDateProperty]: [this.today, Validators.required]
    });
  }

  ngOnInit() {
    this.form.get(this.startDateProperty).setValue(this.today);
    this.form.get(this.endDateProperty).setValue(this.today);
  }

  onDismiss() {
    this.activeModal.dismiss();
  }

  onConfirm() {
    if (this.selectedTimeRangeType == 1) {
      // Delete data before date.
      this.payload = {
        startDate: null,
        endDate: moment(this.form.get(this.startDateProperty).value).format(dateOnlyServerFormat)
      } as DeleteMeterDataPayload;
    } else if (this.selectedTimeRangeType == 2) {
      // Delete data after date.
      this.payload = {
        startDate: moment(this.form.get(this.startDateProperty).value).format(dateOnlyServerFormat),
        endDate: null
      } as DeleteMeterDataPayload;
    } else if (this.selectedTimeRangeType == 3) {
      // Delete all data.
      this.payload = {
        startDate: null,
        endDate: null
      } as DeleteMeterDataPayload;
    } else {
      throw new Error(`Unhandled selected time range type ${this.selectedTimeRangeType}.`);
    }

    this.activeModal.close(this.payload);
  }

  timeRangeTypeChanged() {
    const value = this.form.get(this.timeRangeTypesProperty).value;
    if (value == null) {
      this.form.get(this.timeRangeTypesProperty).setValue(this.timeRangeTypes.find((x) => x.id == this.selectedTimeRangeType));
    } else {
      this.selectedTimeRangeType = value.id as number;
    }
  }
}

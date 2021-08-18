import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

export interface FormData {
  name: string;
  control: AbstractControl;
}

export enum CardItemType {
  FORM = 'form',
  CHART = 'pie-chart'
}

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit, OnChanges {
  @Input() title = '';
  @Input() buttonLabel = '';
  @Input() buttonIconName = '';

  @Input() withEdit = false;
  @Input() form: FormGroup;
  @Input() showMoreButton = false;
  @Input() paginationLimit;
  @Output() buttonClickEvent = new EventEmitter<boolean>();
  @Input() type: CardItemType;
  @Input() meterUnitData = [];

  cardTypeItemEnum = CardItemType;
  initLimit = 0;
  controls: Array<FormData> = [];
  unitGraphSize = [208, 208];

  meterStatusGraphColors = [
    {
      name: 'Installed',
      value: '#2ECC71'
    },
    {
      name: 'Installing',
      value: '#FFB800'
    },
    {
      name: 'Awaiting',
      value: '#8B6DFF'
    },
    {
      name: 'Lost',
      value: '#2CD8C5'
    },
    {
      name: 'Other',
      value: '#E85AFF'
    },
    {
      name: 'Blacklist',
      value: '#000000'
    }
  ];
  private PAGINATION_INCREMENT = 4;

  constructor() {}

  ngOnInit(): void {
    if (this.showMoreButton) {
      this.initLimit = this.paginationLimit;
    }
    // MOCK DATA
  }

  ngOnChanges() {
    if (this.form) {
      this.controls = [];
      Object.keys(this.form.controls).forEach((control: string) => {
        const typedControl: AbstractControl = this.form.controls[control];
        this.controls.push({
          name: control,
          control: typedControl
        });
        // should log the form controls value and be typed correctly
      });
      if (!this.showMoreButton) {
        this.initLimit = this.controls.length;
      }
    }
  }

  showMoreItems() {
    this.paginationLimit += this.PAGINATION_INCREMENT;
  }

  showLessItems() {
    this.paginationLimit = this.initLimit;
  }

  onButtonClicked() {
    this.buttonClickEvent.emit(true);
  }
}

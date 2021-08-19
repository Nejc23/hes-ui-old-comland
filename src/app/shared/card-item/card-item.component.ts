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
  // TODO MODEL
  @Input() meterUnitData = [];
  @Input() tags = [];

  // cardTypeItemEnum = CardItemType;
  initLimit = 0;
  controls: Array<FormData> = [];
  unitGraphSize = [208, 208];

  meterStatusGraphColors = [
    {
      name: 'Installed',
      value: '#50B167'
    },
    {
      name: 'Installing',
      value: '#E9BD4A'
    },
    {
      name: 'Awaiting',
      value: '#981D78'
    },
    {
      name: 'Blacklist',
      value: '#C748A6'
    },
    {
      name: 'Deinstalled',
      value: '#E180C8'
    },
    {
      name: 'Disappeared',
      value: '#053876'
    },
    {
      name: 'Lost',
      value: '#1C5BA8'
    },
    {
      name: 'Other',
      value: '#5992D7'
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

  addBgColor(name: string) {
    let exist = this.meterStatusGraphColors.find((color) => color.name.toLowerCase() === name.toLowerCase());
    if (exist) {
      return exist.value;
    }
  }
}

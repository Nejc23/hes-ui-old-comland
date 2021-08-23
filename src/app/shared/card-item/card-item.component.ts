import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { icon, latLng, marker, tileLayer } from 'leaflet';
import { brand } from '../../../environments/brand/default/brand';
import { environment } from '../../../environments/environment';

export interface FormData {
  name: string;
  control: AbstractControl;
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
  @Input() buttonWithLink = false;
  @Input() buttonLinkUrl = '';
  @Input() paginationLimit;
  @Output() buttonClickEvent = new EventEmitter<boolean>();
  // TODO MODEL
  @Input() meterUnitData = [];
  @Input() tags = [];
  @Input() latLang = [];
  // cardTypeItemEnum = CardItemType;
  initLimit = 0;
  controls: Array<FormData> = [];
  unitGraphSize = [208, 208];

  map: any;
  marker: any;
  options: any;
  accessToken = environment.mapBoxToken;

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
    if (this.latLang.length > 0) {
      this.marker = marker([this.latLang[0], this.latLang[1]], {
        icon: icon({
          iconSize: [64, 64],
          iconAnchor: [13, 41],
          iconUrl: 'assets/images/icons/marker-' + brand.brand.toLowerCase() + '.svg'
        })
      });

      this.options = {
        layers: [
          tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.accessToken
          }),
          this.marker
        ],
        zoom: 13,
        center: latLng(this.latLang[0], this.latLang[1])
      };
    }
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

import { Component, Input, OnInit } from '@angular/core';

export enum MiniCardItemType {
  CHART = 'chart',
  GAUGE = 'gauge'
}

@Component({
  selector: 'app-mini-card-item',
  templateUrl: './mini-card-item.component.html',
  styleUrls: ['./mini-card-item.component.scss']
})
export class MiniCardItemComponent implements OnInit {
  @Input() gaugeValue: number;
  @Input() chartData = [];
  @Input() type: MiniCardItemType;
  @Input() label = '';
  miniCardItemTypeEnum = MiniCardItemType;

  colors = [
    {
      to: 84,
      color: '#E43458'
    },
    {
      from: 85,
      to: 94,
      color: '#E9BD4A'
    },
    {
      from: 95,
      to: 100,
      color: '#37A350'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  addColorToChart(value: any) {
    if (value.dataItem > 95) {
      return '#37A350';
    } else if (value.dataItem < 95 && value.dataItem > 84) {
      return '#E9BD4A';
    } else {
      return '#E43458';
    }
  }
}

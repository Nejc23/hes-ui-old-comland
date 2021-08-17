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
      to: 66,
      color: '#E43458'
    },
    {
      from: 66,
      to: 100,
      color: '#37A350'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}

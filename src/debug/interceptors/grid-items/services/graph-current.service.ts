import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class GridItemsCurrentDataService {
  static graphCurrentValues: any[];
  static currentDate: Date = new Date();

  constructor() {}

  static getGraphCurrent() {
    if (this.graphCurrentValues === undefined) {
      this.currentDate.setHours(this.currentDate.getHours() - 12);

      this.addMinutes(this.currentDate);

      this.graphCurrentValues = [
        {
          name: this.addMinutes(this.currentDate),
          value: 100
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 150
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 300
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 200
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 50
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 70
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 80
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 90
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 130
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 170
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 180
        },
        {
          name: this.addMinutes(this.currentDate),
          value: 180
        }
      ];
    }
    return this.graphCurrentValues;
  }

  static setGraphCurrent(value: any) {
    this.graphCurrentValues = value;
  }

  static getCurrentDateCurrent() {
    return this.addMinutes(this.currentDate);
  }

  static addMinutes(date: Date): string {
    date.setMinutes(date.getMinutes() + 10); // timestamp
    this.currentDate = new Date(date); // Date object
    return this.currentDate.getHours() + ':' + this.currentDate.getMinutes();
  }
}

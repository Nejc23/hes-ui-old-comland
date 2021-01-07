import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription, Observable, timer } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-auto-refresh',
  templateUrl: './auto-refresh.component.html'
})
export class AutoRefreshComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Output() timerExpired: EventEmitter<any> = new EventEmitter<any>();

  @Input() searchDate: moment.Moment = moment();
  @Input() elapseTime: number;
  @Input() hidden = true;

  searchEndDate: moment.Moment;
  remainingTime: number;
  minutes: number;
  seconds: number;

  everySeconds: Observable<number> = timer(0, 1000);

  constructor() {
    this.searchEndDate = this.searchDate.add(this.elapseTime, 'seconds');
  }

  ngOnInit() {
    this.subscription = this.everySeconds.subscribe((seconds) => {
      const currentTime: moment.Moment = moment();
      this.remainingTime = this.searchEndDate.diff(currentTime);
      this.remainingTime = this.remainingTime / 1000;

      if (this.remainingTime <= 0) {
        this.searchDate = moment();
        this.searchEndDate = this.searchDate.add(this.elapseTime, 'seconds');

        this.timerExpired.emit();
      } else {
        this.minutes = Math.floor(this.remainingTime / 60);
        this.seconds = Math.floor(this.remainingTime - this.minutes * 60);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

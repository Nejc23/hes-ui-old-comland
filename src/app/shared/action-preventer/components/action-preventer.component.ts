import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-action-preventer',
  templateUrl: './action-preventer.component.html'
})
export class ActionPreventerComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  showPreventionLayer = false;

  constructor(private loader: LoadingBarService) {}

  ngOnInit() {
    this.subscription = this.loader.progress$.subscribe((x) => {
      this.onProgress(x);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onProgress(progress: number) {
    this.showPreventionLayer = progress === 0 ? false : true;
  }
}

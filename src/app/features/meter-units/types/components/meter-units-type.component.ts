import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-meter-units-type',
  templateUrl: './meter-units-type.component.html'
})
export class MeterUnitsTypeComponent implements OnInit, OnDestroy {
  id = 0;
  private paramsSub: Subscription;
  constructor(private sidebarService: SidebarService, private i18n: I18n, public fb: FormBuilder, private route: ActivatedRoute) {
    this.sidebarService.headerTitle = 'Meter Units type';

    this.paramsSub = route.params.subscribe(params => {
      this.id = params.id;
      //  load data
    });
  }
  ngOnInit() {}

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}

import { Component, ElementRef, OnInit } from '@angular/core';
import { LicensingService } from '../../../api/configuration/services/licensing.service';
import { BreadcrumbService } from '../../../shared/breadcrumbs/services/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';

export interface LicencingData {
  installedMeters: number;
  allowedMeters: number;
  activeUsers?: number;
  modules?: string[];
}

@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.scss']
})
export class LicenceComponent implements OnInit {
  data: LicencingData = {
    installedMeters: 0,
    allowedMeters: 0
  };

  constructor(
    private elRef: ElementRef,
    private licensingService: LicensingService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.breadcrumbService.setPageName(this.translate.instant('MENU.LICENCE'));
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  licenceColor() {
    const percentage = (this.data.installedMeters / this.data.allowedMeters) * 100;
    if (percentage > 90) {
      return 'red';
    }
    if (percentage > 70) {
      return 'yellow';
    }
    return 'green';
  }

  getData() {
    this.licensingService.licensingGet().subscribe((res) => {
      this.data = res;
    });
  }
}

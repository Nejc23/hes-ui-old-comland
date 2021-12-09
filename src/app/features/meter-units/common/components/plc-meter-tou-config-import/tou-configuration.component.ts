import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { ModalConfirmComponent } from '../../../../../shared/modals/components/modal-confirm.component';
import { TouConfigService } from '../../services/tou-config.service';
import { TouConfigurationImportComponent } from './tou-configuration-import.component';

@Component({
  selector: 'app-plc-meter-tou-config-import',
  templateUrl: './tou-configuration.component.html',
  styleUrls: ['./tou-configuration.component.scss']
})
export class TouConfigurationComponent implements OnInit {
  wizard = false;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private elRef: ElementRef,
    private router: Router,
    private touService: TouConfigService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setPageName(this.translate.instant('MENU.TOU-CONFIGURATION'));
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  navigate() {
    this.router.navigate(['/schedulerJobs']);
  }

  goBack() {
    window.history.back();
  }

  openWizard() {
    this.wizard = true;
    if (JSON.parse(sessionStorage.getItem('touConfig'))) {
      // Pressing escape key or clicking oustside the modal won't close it
      const modalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
      };
      const modalRef = this.modalService.open(ModalConfirmComponent, modalOptions);
      const component: ModalConfirmComponent = modalRef.componentInstance;

      component.modalTitle = this.translate.instant('TOU-CONFIG.CONTINUE');
      component.modalBody = this.translate.instant('TOU-CONFIG.CONTINUE-TEXT');
      component.btnConfirmText = this.translate.instant('TOU-CONFIG.CONTINUE');
      component.btnCancelText = this.translate.instant('TOU-CONFIG.CREATE-NEW');
      component.hideCloseButton = true;

      modalRef.result
        .then(() => {
          this.touService.createNewTouConfigurationClient();
          this.router.navigate(['/configuration/importTouConfiguration/wizard/basic']);
        })
        .catch(() => {
          this.createNewAndNavigate('wizard/basic');
        });
    } else {
      this.createNewAndNavigate('wizard/basic');
    }
  }

  openImportModal() {
    this.modalService.open(TouConfigurationImportComponent);
  }

  isList() {
    return '/configuration/importTouConfiguration/list' === this.router.url;
  }

  isSummary() {
    return '/configuration/importTouConfiguration/wizard/summary' === this.router.url;
  }

  getTitle() {
    return this.touService.getTouConfig()?.basic?.id;
  }

  navigateToList() {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;

    component.modalTitle = this.translate.instant('TOU-CONFIG.CLOSE-WIZARD');
    component.modalBody = this.translate.instant('TOU-CONFIG.CLOSE-WIZARD-TEXT', {
      configurationName:
        this.touService.touConfigurationClient.basic.description.length > 0
          ? `\"${this.touService.touConfigurationClient.basic.description}\" `
          : ''
    });

    modalRef.result.then(() => {
      this.createNewAndNavigate('list');
    });
  }

  saveTouConfig() {
    this.touService.saveTouConfiguration();
  }

  isValid() {
    return this.touService.isConfigurationValid();
  }

  createNewAndNavigate(path: string) {
    sessionStorage.removeItem('touConfig');
    this.touService.createNewTouConfigurationClient();
    this.router.navigate(['/configuration/importTouConfiguration/' + path]);
  }
}

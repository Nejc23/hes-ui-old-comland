import { Component, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigurationRoute } from '../../base-template/enums/configuration.enum';
import { PlcMeterTemplatesImportComponent } from 'src/app/features/meter-units/common/components/plc-meter-templates-import/plc-meter-templates-import.component';
import { PlcMeterTouConfigImportComponent } from 'src/app/features/meter-units/common/components/plc-meter-tou-config-import/plc-meter-tou-config-import.component';

@Component({
  selector: 'app-modal-container',
  template: ''
})
export class ModalContainerComponent implements OnDestroy {
  destroy = new Subject<any>();
  currentDialog = null;

  constructor(private modalService: NgbModal, route: ActivatedRoute, router: Router) {
    console.log(router.url);
    route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      // When router navigates on this component is takes the params and opens up the photo detail modal
      this.currentDialog = this.modalService.open(
        router.url.endsWith('/importTemplates') ? PlcMeterTemplatesImportComponent : PlcMeterTouConfigImportComponent,
        { centered: true }
      );
      this.currentDialog.componentInstance.photo = params.id;

      // Go back to home page after the modal is closed
      this.currentDialog.result.then(
        result => {
          router.navigateByUrl(`/${ConfigurationRoute.configuration}`);
        },
        reason => {
          router.navigateByUrl(`/${ConfigurationRoute.configuration}`);
        }
      );
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}

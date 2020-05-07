import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionsService } from '../../../core/permissions/services/permissions.service';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';

@Directive({
  selector: '[appHideIfActionUnauthorized]'
})
export class HideIfActionUnauthorizedDirective implements OnInit {
  @Input('functionality') permission: FunctionalityEnumerator; // Required permission passed in
  @Input('action') action: ActionEnumerator; // Required permission passed in

  constructor(private el: ElementRef, private authorizationService: PermissionsService) {}

  ngOnInit() {
    if (!this.authorizationService.hasActionAccess(this.permission, this.action)) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}

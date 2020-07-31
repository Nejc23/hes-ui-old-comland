import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionsService } from '../../../core/permissions/services/permissions.service';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';

@Directive({
  selector: '[appDisableIfActionUnauthorized]'
})
export class DisableIfActionUnauthorizedDirective implements OnInit {
  @Input() functionality: FunctionalityEnumerator; // Required permission passed in
  @Input() action: ActionEnumerator; // Required permission passed in

  constructor(private el: ElementRef, private authorizationService: PermissionsService) {}

  ngOnInit() {
    if (!this.authorizationService.hasActionAccess(this.functionality, this.action)) {
      this.el.nativeElement.disabled = true;
    }
  }
}
